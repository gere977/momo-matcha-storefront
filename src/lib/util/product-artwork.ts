type ProductArtwork = {
  cart: string
  social: string
}

const PRODUCT_ARTWORK: Record<string, ProductArtwork> = {
  "original-premium-momo-matcha": {
    cart: "/images/products/momo-original-tin.png",
    social: "/images/products/momo-original-splash-card.png",
  },
  "epres-premium-momo-matcha": {
    cart: "/images/products/momo-strawberry-tin.png",
    social: "/images/products/momo-strawberry-splash.png",
  },
  "vanilias-premium-momo-matcha": {
    cart: "/images/products/momo-vanilla-tin.png",
    social: "/images/products/momo-vanilla-splash.png",
  },
  "csokoladas-premium-momo-matcha": {
    cart: "/images/products/momo-chocolate-tin.png",
    social: "/images/products/momo-chocolate-splash.png",
  },
  "matcha-szett": {
    cart: "/images/products/momo-accessories-set.png",
    social: "/images/products/momo-accessories-card.png",
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
