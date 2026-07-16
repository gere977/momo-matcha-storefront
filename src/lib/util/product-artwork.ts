type ProductArtwork = {
  cart: string
  social: string
}

// Social images are pre-compressed JPEG versions of the splash art (the PNGs
// are 1.4–1.8 MB, too heavy for OG crawlers and link previews).
const PRODUCT_ARTWORK: Record<string, ProductArtwork> = {
  "original-premium-momo-matcha": {
    cart: "/images/products/momo-original-tin.png",
    social: "/images/products/momo-original-splash-card.jpg",
  },
  "epres-premium-momo-matcha": {
    cart: "/images/products/momo-strawberry-tin.png",
    social: "/images/products/momo-strawberry-splash.jpg",
  },
  "vanilias-premium-momo-matcha": {
    cart: "/images/products/momo-vanilla-tin.png",
    social: "/images/products/momo-vanilla-splash.jpg",
  },
  "csokoladas-premium-momo-matcha": {
    cart: "/images/products/momo-chocolate-tin.png",
    social: "/images/products/momo-chocolate-splash.jpg",
  },
  "matcha-szett": {
    cart: "/images/products/momo-accessories-set.png",
    social: "/images/products/momo-accessories-card.jpg",
  },
}

export function getProductCartImage(
  handle?: string | null,
  fallback?: string | null
) {
  return (handle && PRODUCT_ARTWORK[handle]?.cart) || fallback || undefined
}

export function getProductSocialImage(
  handle?: string | null,
  fallback?: string | null
) {
  return (handle && PRODUCT_ARTWORK[handle]?.social) || fallback || undefined
}

export function getAbsoluteArtworkUrl(
  artwork?: string,
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://momomatcha.hu"
) {
  if (!artwork) return undefined

  try {
    return new URL(artwork, baseUrl).toString()
  } catch {
    return artwork
  }
}
