import { NextResponse } from "next/server"
import {
  getAbsoluteArtworkUrl,
  getProductCartImage,
} from "@lib/util/product-artwork"

// Google Merchant Center product feed (Shopping free listings + ads).
// Register https://momomatcha.hu/product-feed.xml as a scheduled-fetch feed
// in Merchant Center. One item per variant, grouped by product.

export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://momomatcha.hu"
const COUNTRY = process.env.NEXT_PUBLIC_DEFAULT_REGION || "hu"

// Non-tea products need a different Google taxonomy branch than the teas.
const ACCESSORY_HANDLES = new Set(["matcha-szett"])

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function GET() {
  const backend = process.env.MEDUSA_BACKEND_URL
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (!backend || !key) {
    return new NextResponse("feed unavailable", { status: 503 })
  }

  // Region id is needed for calculated prices — resolve it from the country.
  let regionId: string | undefined
  try {
    const regionsRes = await fetch(`${backend}/store/regions`, {
      headers: { "x-publishable-api-key": key },
      next: { revalidate: 3600 },
    })
    const { regions } = await regionsRes.json()
    regionId = regions?.find((r: any) =>
      r.countries?.some((c: any) => c.iso_2 === COUNTRY)
    )?.id
  } catch {
    return new NextResponse("feed unavailable", { status: 503 })
  }

  if (!regionId) {
    return new NextResponse("no region", { status: 503 })
  }

  let products: any[] = []
  try {
    const res = await fetch(
      `${backend}/store/products?limit=100&region_id=${regionId}&fields=` +
        encodeURIComponent(
          "id,title,handle,description,thumbnail,*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,*variants.options"
        ),
      {
        headers: { "x-publishable-api-key": key },
        next: { revalidate: 3600 },
      }
    )
    const data = await res.json()
    products = data.products ?? []
  } catch {
    return new NextResponse("feed unavailable", { status: 503 })
  }

  const items: string[] = []

  for (const product of products) {
    const link = `${BASE_URL}/${COUNTRY}/products/${product.handle}`
    // Google crops Shopping thumbnails roughly square, so use the tin render
    // (product fills the frame) rather than the landscape splash scene.
    const productImage = getAbsoluteArtworkUrl(
      getProductCartImage(product.handle, product.thumbnail),
      BASE_URL
    )
    const googleCategory = ACCESSORY_HANDLES.has(product.handle)
      ? "Home &amp; Garden &gt; Kitchen &amp; Dining &gt; Kitchen Tools &amp; Utensils"
      : "Food, Beverages &amp; Tobacco &gt; Beverages &gt; Tea &amp; Infusions"
    const description = (product.description ?? product.title ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4900)

    for (const variant of product.variants ?? []) {
      const amount = variant.calculated_price?.calculated_amount
      const currency = variant.calculated_price?.currency_code?.toUpperCase()
      if (typeof amount !== "number" || !currency) continue

      const inStock =
        !variant.manage_inventory ||
        variant.allow_backorder ||
        (variant.inventory_quantity ?? 0) > 0

      const sizeOption = (variant.options ?? [])
        .map((o: any) => String(o.value ?? ""))
        .find((v: string) => /^\d+\s*g$/i.test(v))

      const title = sizeOption
        ? `${product.title} — ${sizeOption}`
        : `${product.title}${variant.title && variant.title !== "Default variant" ? ` — ${variant.title}` : ""}`

      items.push(
        `  <item>
    <g:id>${esc(variant.id)}</g:id>
    <g:item_group_id>${esc(product.id)}</g:item_group_id>
    <g:title>${esc(title)}</g:title>
    <g:description>${esc(description)}</g:description>
    <g:link>${esc(link)}</g:link>
    ${productImage ? `<g:image_link>${esc(productImage)}</g:image_link>` : ""}
    <g:price>${amount.toFixed(2)} ${esc(currency)}</g:price>
    <g:availability>${inStock ? "in_stock" : "out_of_stock"}</g:availability>
    <g:condition>new</g:condition>
    <g:brand>Momo Matcha</g:brand>
    <g:identifier_exists>false</g:identifier_exists>
    <g:google_product_category>${googleCategory}</g:google_product_category>
  </item>`
      )
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Momo Matcha</title>
  <link>${BASE_URL}</link>
  <description>Prémium, bio ceremonial matcha Ujiból, Japánból.</description>
${items.join("\n")}
</channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
