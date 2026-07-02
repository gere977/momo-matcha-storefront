import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-matcha-bg/85 backdrop-blur-md border-matcha-kraft/40">
        <nav className="content-container text-matcha-text flex items-center justify-between w-full h-full text-[15px] font-body font-semibold">
          <div className="flex-1 basis-0 h-full flex items-center gap-x-6">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink className="hover:text-matcha" href="/">
                Főoldal
              </LocalizedClientLink>
              <LocalizedClientLink className="hover:text-matcha" href="/collections/matcha">
                Matcha Teák
              </LocalizedClientLink>
              <LocalizedClientLink className="hover:text-matcha" href="/categories/kiegeszitok">
                Kiegészítők
              </LocalizedClientLink>
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="flex items-center leading-none"
              data-testid="nav-store-link"
            >
              {/* mix-blend-multiply drops the logo's white background into the
                  cream nav bar without needing a transparent PNG. */}
              <img
                src="/images/logo.jpg"
                alt="Momo Matcha"
                className="h-14 w-auto"
                style={{ mixBlendMode: "multiply" }}
              />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-matcha font-semibold text-matcha"
                href="/account"
                data-testid="nav-account-link"
              >
                Fiókom
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-matcha flex gap-2 font-bold text-matcha-accent"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Kosár (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
