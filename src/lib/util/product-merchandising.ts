import { HttpTypes } from "@medusajs/types"

export const MATCHA_FLAVOR_HANDLES = [
  "original-premium-momo-matcha",
  "epres-premium-momo-matcha",
  "vanilias-premium-momo-matcha",
  "csokoladas-premium-momo-matcha",
] as const

export const MATCHA_SET_HANDLE = "matcha-szett"

export type MatchaFlavorHandle = (typeof MATCHA_FLAVOR_HANDLES)[number]

export type FlavorProfile = {
  handle: MatchaFlavorHandle
  shortName: string
  taste: string
  sweetness: string
  bestUse: string
  image: string
  surfaceClass: string
  accentClass: string
}

export const FLAVOR_PROFILES: Record<MatchaFlavorHandle, FlavorProfile> = {
  "original-premium-momo-matcha": {
    handle: "original-premium-momo-matcha",
    shortName: "Original",
    taste: "Tiszta, klasszikus matcha",
    sweetness: "Ízesítés nélkül",
    bestUse: "Tisztán, vízzel",
    image: "/images/products/momo-original-tin.png",
    surfaceClass: "bg-matcha-mist/60",
    accentClass: "text-matcha-deep",
  },
  "epres-premium-momo-matcha": {
    handle: "epres-premium-momo-matcha",
    shortName: "Epres",
    taste: "Epres, gyümölcsös",
    sweetness: "Édes, gyümölcsös érzet",
    bestUse: "Meleg vagy jeges latte",
    image: "/images/products/momo-strawberry-tin.png",
    surfaceClass: "bg-strawberry/15",
    accentClass: "text-strawberry",
  },
  "vanilias-premium-momo-matcha": {
    handle: "vanilias-premium-momo-matcha",
    shortName: "Vaníliás",
    taste: "Lágy, vaníliás és selymes",
    sweetness: "Lágy ízérzet",
    bestUse: "Meleg vagy jeges latte",
    image: "/images/products/momo-vanilla-tin.png",
    surfaceClass: "bg-vanilla/25",
    accentClass: "text-matcha-deep",
  },
  "csokoladas-premium-momo-matcha": {
    handle: "csokoladas-premium-momo-matcha",
    shortName: "Csokoládés",
    taste: "Matcha csokoládés jegyekkel",
    sweetness: "Csokoládés ízérzet",
    bestUse: "Meleg vagy jeges latte",
    image: "/images/products/momo-chocolate-tin.png",
    surfaceClass: "bg-chocolate/15",
    accentClass: "text-chocolate",
  },
}

const RELATED_HANDLES: Record<string, string[]> = {
  "original-premium-momo-matcha": [
    "epres-premium-momo-matcha",
    "vanilias-premium-momo-matcha",
    "csokoladas-premium-momo-matcha",
  ],
  "epres-premium-momo-matcha": [
    "vanilias-premium-momo-matcha",
    "csokoladas-premium-momo-matcha",
    MATCHA_SET_HANDLE,
    "original-premium-momo-matcha",
  ],
  "vanilias-premium-momo-matcha": [
    "epres-premium-momo-matcha",
    "csokoladas-premium-momo-matcha",
    MATCHA_SET_HANDLE,
    "original-premium-momo-matcha",
  ],
  "csokoladas-premium-momo-matcha": [
    "epres-premium-momo-matcha",
    "vanilias-premium-momo-matcha",
    MATCHA_SET_HANDLE,
    "original-premium-momo-matcha",
  ],
  [MATCHA_SET_HANDLE]: [
    "original-premium-momo-matcha",
    "epres-premium-momo-matcha",
  ],
}

export function isMatchaFlavor(
  handle?: string | null
): handle is MatchaFlavorHandle {
  return MATCHA_FLAVOR_HANDLES.includes(handle as MatchaFlavorHandle)
}

export function getFlavorProfile(handle?: string | null) {
  return isMatchaFlavor(handle) ? FLAVOR_PROFILES[handle] : undefined
}

export function getManualRelatedHandles(handle?: string | null) {
  return handle ? RELATED_HANDLES[handle] ?? [] : []
}

export function readProductMetadata(
  product: HttpTypes.StoreProduct,
  keys: string[]
) {
  const metadata = (product.metadata ?? {}) as Record<string, unknown>

  for (const key of keys) {
    const value = metadata[key]
    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }

  return undefined
}

export function getIngredients(product: HttpTypes.StoreProduct) {
  return readProductMetadata(product, [
    "ingredients_hu",
    "ingredients",
    "osszetevok",
  ])
}

export function getProductOrigin(product: HttpTypes.StoreProduct) {
  const metadataOrigin = readProductMetadata(product, [
    "origin_hu",
    "origin",
    "szarmazasi_hely",
  ])

  if (metadataOrigin) return metadataOrigin
  if (product.origin_country?.toLowerCase() === "jp") return "Japán"

  // Every current Momo matcha product is presented as Japanese matcha across
  // the storefront. Keep the fallback broad instead of claiming a subregion.
  return isMatchaFlavor(product.handle) ? "Japán" : undefined
}

export function getVariantLabel(variant: HttpTypes.StoreProductVariant) {
  const optionValues = variant.options
    ?.map((option) => option.value)
    .filter(Boolean)
    .join(" / ")

  return optionValues || variant.title || "Alap változat"
}

export function isVariantPurchasable(variant: HttpTypes.StoreProductVariant) {
  return (
    !variant.manage_inventory ||
    Boolean(variant.allow_backorder) ||
    (variant.inventory_quantity ?? 0) > 0
  )
}

export function pickMerchandisingVariant(product: HttpTypes.StoreProduct) {
  const variants = (product.variants ?? []).filter(isVariantPurchasable)
  const thirtyGram = variants.find((variant) =>
    variant.options?.some(
      (option) => option.value?.replace(/\s/g, "").toLowerCase() === "30g"
    )
  )

  return thirtyGram ?? variants[0]
}

export function getVariantPrice(variant?: HttpTypes.StoreProductVariant) {
  const calculatedPrice = variant?.calculated_price
  const amount = calculatedPrice?.calculated_amount
  const currencyCode = calculatedPrice?.currency_code

  if (typeof amount !== "number" || !currencyCode) return undefined

  return {
    amount,
    currencyCode,
  }
}

export function getCartRecommendationHandles(cartHandles: string[]) {
  const inCart = new Set(cartHandles)
  const recommendations: string[] = []
  const hasFlavor = MATCHA_FLAVOR_HANDLES.some((handle) => inCart.has(handle))

  if (hasFlavor && !inCart.has(MATCHA_SET_HANDLE)) {
    recommendations.push(MATCHA_SET_HANDLE)
  }

  if (inCart.has(MATCHA_SET_HANDLE) && !hasFlavor) {
    recommendations.push("original-premium-momo-matcha")
  }

  const missingFlavor = MATCHA_FLAVOR_HANDLES.find(
    (handle) => !inCart.has(handle) && !recommendations.includes(handle)
  )

  if (missingFlavor) recommendations.push(missingFlavor)

  return recommendations.slice(0, 2)
}
