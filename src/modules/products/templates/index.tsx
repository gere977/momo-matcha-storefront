import React, { Suspense } from "react"

import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductReviews from "@modules/products/components/product-reviews"
import ProductSplash from "@modules/products/components/product-splash"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import MomoFamilyBundle from "@modules/products/components/momo-family-bundle"
import ProductInfo from "@modules/products/templates/product-info"
import { isMatchaFlavor } from "@lib/util/product-merchandising"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="momo-product-page">
      <div className="relative z-10">
        <section
          className="content-container grid items-center gap-8 pb-16 pt-4 xsmall:gap-12 xsmall:pt-8 small:grid-cols-2 small:pb-24"
          data-testid="product-container"
        >
          <ProductSplash product={product} images={images} />

          <div className="flex flex-col gap-y-6 pb-4 xsmall:gap-y-8 small:py-10">
            <ProductInfo product={product} />
            <ProductOnboardingCta />
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
            <ProductTabs product={product} />
          </div>
        </section>

        <Suspense fallback={null}>
          <ProductReviews productId={product.id} />
        </Suspense>

        {isMatchaFlavor(product.handle) && (
          <div className="content-container mt-16 small:mt-24">
            <Suspense
              fallback={<div className="h-72 rounded-[2rem] bg-white/60" />}
            >
              <MomoFamilyBundle countryCode={countryCode} placement="product" />
            </Suspense>
          </div>
        )}

        <div
          className="content-container my-16 small:my-32"
          data-testid="related-products-container"
        >
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate
