import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"
import { contentPageSlugs } from "@lib/content/pages"

const COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_REGION || "hu"

type HandleRow = { handle: string; updated_at?: string }

// Lightweight direct fetch: only handles + timestamps are needed, so we skip
// the SDK (which pulls in cookies/cart context) and hit the store API bare.
async function fetchHandles(path: string, key: string): Promise<HandleRow[]> {
  const backend = process.env.MEDUSA_BACKEND_URL
  if (!backend) return []
  try {
    const res = await fetch(
      `${backend}${path}?limit=1000&fields=handle,updated_at`,
      {
        headers: {
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
        },
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data[key] ?? []) as HandleRow[]
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `${getBaseURL()}/${COUNTRY_CODE}`

  const [products, collections, categories] = await Promise.all([
    fetchHandles("/store/products", "products"),
    fetchHandles("/store/collections", "collections"),
    fetchHandles("/store/product-categories", "product_categories"),
  ])

  const entry = (
    path: string,
    updatedAt?: string,
    priority = 0.7
  ): MetadataRoute.Sitemap[number] => ({
    url: `${base}${path}`,
    lastModified: updatedAt ? new Date(updatedAt) : new Date(),
    priority,
  })

  return [
    entry("", undefined, 1),
    entry("/store", undefined, 0.9),
    ...products.map((p) => entry(`/products/${p.handle}`, p.updated_at, 0.8)),
    ...collections.map((c) =>
      entry(`/collections/${c.handle}`, c.updated_at, 0.8)
    ),
    ...categories.map((c) =>
      entry(`/categories/${c.handle}`, c.updated_at, 0.6)
    ),
    ...contentPageSlugs.map((slug) => entry(`/pages/${slug}`, undefined, 0.4)),
  ]
}
