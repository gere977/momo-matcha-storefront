import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images?.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  // Prefer the real product description for search snippets; fall back to a
  // branded default rather than repeating the title.
  const description =
    product.description?.replace(/\s+/g, " ").trim().slice(0, 160) ||
    `${product.title} — prémium, bio ceremonial matcha Ujiból, Japánból. Rendelj a Momo Matcha webshopból!`

  return {
    title: `${product.title} | Momo Matcha`,
    description,
    alternates: {
      canonical: `/${params.countryCode}/products/${handle}`,
    },
    openGraph: {
      title: `${product.title} | Momo Matcha`,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

// Approved-review aggregate for the JSON-LD (rating stars in search results).
async function fetchReviewAggregate(
  productId: string
): Promise<{ average: number | null; count: number }> {
  const backend = process.env.MEDUSA_BACKEND_URL
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (!backend || !key) return { average: null, count: 0 }
  try {
    const res = await fetch(
      `${backend}/store/reviews?product_id=${encodeURIComponent(productId)}&limit=1`,
      {
        headers: { "x-publishable-api-key": key },
        next: { revalidate: 300 },
      }
    )
    if (!res.ok) return { average: null, count: 0 }
    const data = await res.json()
    return { average: data.average ?? null, count: data.count ?? 0 }
  } catch {
    return { average: null, count: 0 }
  }
}

// Product structured data (price, availability) — this is what earns
// price-rich results in Google. Prices are tax-inclusive HUF major units.
function buildProductJsonLd(
  product: HttpTypes.StoreProduct,
  countryCode: string,
  reviews?: { average: number | null; count: number }
) {
  const prices = (product.variants ?? [])
    .map((v) => v.calculated_price?.calculated_amount)
    .filter((p): p is number => typeof p === "number")

  const currency =
    product.variants?.[0]?.calculated_price?.currency_code?.toUpperCase() ??
    "HUF"

  const inStock = (product.variants ?? []).some(
    (v: any) =>
      !v.manage_inventory ||
      v.allow_backorder ||
      (v.inventory_quantity ?? 0) > 0
  )

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://momomatcha.hu"

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    image: product.thumbnail ?? undefined,
    brand: { "@type": "Brand", name: "Momo Matcha" },
    ...(reviews && reviews.count > 0 && reviews.average
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviews.average,
            reviewCount: reviews.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: currency,
      lowPrice: prices.length ? Math.min(...prices) : undefined,
      highPrice: prices.length ? Math.max(...prices) : undefined,
      offerCount: prices.length || undefined,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${baseUrl}/${countryCode}/products/${product.handle}`,
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const images = getImagesForVariant(pricedProduct, selectedVariantId) ?? []
  const reviewAggregate = await fetchReviewAggregate(pricedProduct.id)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildProductJsonLd(pricedProduct, params.countryCode, reviewAggregate)
          ),
        }}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images}
      />
    </>
  )
}
