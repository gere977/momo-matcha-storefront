import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <main className="momo-store-page">
      <div
        className="content-container relative z-10 pb-20 pt-8 small:pb-28 small:pt-14"
        data-testid="category-container"
      >
        <header className="mb-9 max-w-3xl small:mb-12 small:pl-[17.25rem]">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-matcha-accent xsmall:text-xs">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-matcha-accent" />
            Japánból, gondosan válogatva
          </p>
          <h1
            className="text-balance font-editorial text-4xl font-bold leading-[0.98] tracking-[-0.035em] text-matcha-deep xsmall:text-5xl small:text-6xl"
            data-testid="store-page-title"
          >
            Találd meg a <span className="italic">matchád.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-matcha-sage xsmall:text-base">
            Tiszta vagy ízesített matcha, plusz minden kellék a saját lassú
            rituálédhoz.
          </p>
        </header>

        <div className="flex flex-col small:flex-row small:items-start">
          <RefinementList sortBy={sort} />
          <div className="w-full min-w-0">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

export default StoreTemplate
