import { listProducts } from "@lib/data/products"
import {
  FLAVOR_PROFILES,
  MATCHA_FLAVOR_HANDLES,
  getVariantLabel,
  getVariantPrice,
  pickMerchandisingVariant,
} from "@lib/util/product-merchandising"

import MomoFamilyBundleClient from "./momo-family-bundle-client"
import type { FamilyBundleItem } from "./momo-family-bundle-client"

type MomoFamilyBundleProps = {
  countryCode: string
  placement?: "store" | "product"
}

export default async function MomoFamilyBundle({
  countryCode,
  placement = "store",
}: MomoFamilyBundleProps) {
  const products = await listProducts({
    countryCode,
    queryParams: { limit: 100, is_giftcard: false },
  })
    .then(({ response }) => response.products)
    .catch(() => [])

  const productsByHandle = new Map(
    products.map((product) => [product.handle, product])
  )

  const items: FamilyBundleItem[] = MATCHA_FLAVOR_HANDLES.map((handle) => {
    const product = productsByHandle.get(handle)
    const profile = FLAVOR_PROFILES[handle]
    const variant = product ? pickMerchandisingVariant(product) : undefined
    const price = getVariantPrice(variant)

    return {
      handle,
      title: product?.title ?? `${profile.shortName} Momo Matcha`,
      shortName: profile.shortName,
      image: profile.image,
      surfaceClass: profile.surfaceClass,
      variantId: variant?.id,
      variantLabel: variant ? getVariantLabel(variant) : undefined,
      amount: price?.amount,
      currencyCode: price?.currencyCode,
      available: Boolean(product && variant?.id && price),
    }
  })

  const currencies = new Set(
    items.map((item) => item.currencyCode).filter(Boolean)
  )
  const currencyCode =
    currencies.size === 1
      ? items.find((item) => item.currencyCode)?.currencyCode
      : undefined
  const total = items.every((item) => typeof item.amount === "number")
    ? items.reduce((sum, item) => sum + (item.amount ?? 0), 0)
    : undefined

  const freeShippingThreshold = Number(
    process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 15000
  )

  return (
    <MomoFamilyBundleClient
      items={items}
      total={total}
      currencyCode={currencyCode}
      countryCode={countryCode}
      freeShippingThreshold={freeShippingThreshold}
      placement={placement}
    />
  )
}
