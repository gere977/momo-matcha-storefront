import { listProducts } from "@lib/data/products"
import { getProductCartImage } from "@lib/util/product-artwork"
import {
  getCartRecommendationHandles,
  getVariantLabel,
  getVariantPrice,
  pickMerchandisingVariant,
} from "@lib/util/product-merchandising"
import { HttpTypes } from "@medusajs/types"

import CartCrossSellClient from "./cart-cross-sell-client"
import type { CartCrossSellItem } from "./cart-cross-sell-client"

export default async function CartCrossSell({
  cart,
  countryCode,
}: {
  cart: HttpTypes.StoreCart
  countryCode: string
}) {
  const cartHandles = (cart.items ?? [])
    .map((item) => item.product?.handle)
    .filter((handle): handle is string => Boolean(handle))
  const preferredHandles = getCartRecommendationHandles(cartHandles)

  if (preferredHandles.length === 0) return null

  const products = await listProducts({
    countryCode,
    queryParams: { limit: 100, is_giftcard: false },
  })
    .then(({ response }) => response.products)
    .catch(() => [])
  const productsByHandle = new Map(
    products.map((product) => [product.handle, product])
  )

  const recommendations = preferredHandles
    .map((handle) => productsByHandle.get(handle))
    .filter((product): product is HttpTypes.StoreProduct => Boolean(product))
    .map((product): CartCrossSellItem | undefined => {
      const variant = pickMerchandisingVariant(product)
      const price = getVariantPrice(variant)

      if (!variant?.id || !price) return undefined

      return {
        handle: product.handle ?? "",
        title: product.title,
        image: getProductCartImage(product.handle, product.thumbnail),
        variantId: variant.id,
        variantLabel: getVariantLabel(variant),
        amount: price.amount,
        currencyCode: price.currencyCode,
      }
    })
    .filter((item): item is CartCrossSellItem => Boolean(item))

  if (recommendations.length === 0) return null

  return (
    <CartCrossSellClient items={recommendations} countryCode={countryCode} />
  )
}
