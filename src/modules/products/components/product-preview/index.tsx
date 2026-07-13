import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group flex h-full flex-col"
    >
      <div
        data-testid="product-wrapper"
        className="flex h-full flex-col bg-white rounded-2xl overflow-hidden border border-matcha-kraft/60 transition-[transform,box-shadow,border-color] duration-200 ease-out-quart group-hover:shadow-xl group-hover:shadow-matcha-dark/10 group-hover:-translate-y-1 group-hover:border-matcha"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          alt={product.title}
          isFeatured={isFeatured}
        />
        <div className="flex min-h-[8rem] flex-1 flex-col items-start justify-between gap-2 p-4 txt-compact-medium small:min-h-[6.75rem] small:p-5">
          <Text
            className="min-h-[4.05em] overflow-hidden font-body text-[13px] font-semibold leading-[1.35] text-matcha-text [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] small:min-h-[2.7em] small:text-sm small:[-webkit-line-clamp:2]"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="flex shrink-0 self-end items-center gap-x-2 whitespace-nowrap font-bold tabular-nums text-matcha">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
