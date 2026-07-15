import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import InteractiveLink from "@modules/common/components/interactive-link"
import FlavorFamily, {
  FAMILY_FLAVOR_HANDLES,
} from "@modules/home/components/featured-products/flavor-family"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts?.length) {
    return null
  }

  const familyProducts = pricedProducts.filter((product) =>
    FAMILY_FLAVOR_HANDLES.has(product.handle ?? "")
  )
  const showFlavorFamily =
    collection.handle === "matcha" && familyProducts.length === 4

  return (
    <div className="content-container py-16 small:py-24 bg-matcha-bg">
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="font-heading font-bold text-4xl small:text-5xl text-matcha-text mb-2">
          {collection.title}
        </h2>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          Összes termék
        </InteractiveLink>
      </div>
      {showFlavorFamily ? (
        <FlavorFamily products={familyProducts} />
      ) : (
        <ul className="grid grid-cols-2 gap-6 small:grid-cols-3">
          {pricedProducts.map((product) => (
            <li key={product.id} className="h-full">
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
