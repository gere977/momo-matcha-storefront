import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getManualRelatedHandles } from "@lib/util/product-merchandising"
import { HttpTypes } from "@medusajs/types"

import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)
  const preferredHandles = getManualRelatedHandles(product.handle)

  if (!region || preferredHandles.length === 0) return null

  const products = await listProducts({
    countryCode,
    queryParams: { limit: 100, is_giftcard: false },
  })
    .then(({ response }) => {
      const byHandle = new Map(
        response.products.map((candidate) => [candidate.handle, candidate])
      )

      return preferredHandles
        .map((handle) => byHandle.get(handle))
        .filter((candidate): candidate is HttpTypes.StoreProduct =>
          Boolean(candidate)
        )
        .slice(0, 3)
    })
    .catch(() => [])

  if (products.length === 0) return null

  return (
    <div className="product-page-constraint">
      <div className="mb-9 max-w-xl small:mb-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-matcha-accent xsmall:text-xs">
          Következő csésze
        </p>
        <h2 className="mt-2 text-balance font-editorial text-3xl font-bold leading-[1.05] tracking-[-0.025em] text-matcha-deep xsmall:text-4xl">
          Kóstold meg <span className="italic">ezt is.</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-matcha-sage">
          Kézzel válogatott folytatás az ízhez vagy eszközhöz, amit most nézel.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-5 xsmall:grid-cols-2 small:grid-cols-3">
        {products.map((relatedProduct) => (
          <li key={relatedProduct.id}>
            <Product region={region} product={relatedProduct} />
          </li>
        ))}
      </ul>
    </div>
  )
}
