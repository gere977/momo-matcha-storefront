import { Suspense } from "react"
import Image from "next/image"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import NavLink from "@modules/layout/components/nav-link"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Announcement bar - the current promotion (matches the automatic
          INGYENSZALLITAS15000 promotion configured in Medusa). */}
      <div className="bg-matcha text-white text-center text-sm font-heading font-bold tracking-wide py-2 px-4">
        🍵 Ingyenes szállítás 15 000 Ft feletti rendelésre!
      </div>
      <header className="relative h-20 mx-auto border-b duration-200 bg-matcha-bg/85 backdrop-blur-md border-matcha-kraft/40">
        <nav className="content-container text-matcha-text flex items-center justify-between w-full h-full text-lg font-heading font-bold">
          <div className="flex-1 basis-0 h-full flex items-center gap-x-6">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <NavLink href="/">Főoldal</NavLink>
              <NavLink href="/collections/matcha">Matcha Teák</NavLink>
              <NavLink href="/categories/kiegeszitok">Kiegészítők</NavLink>
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="flex items-center leading-none"
              data-testid="nav-store-link"
            >
              <Image
                src="/images/logo-transparent.png"
                alt="Momo Matcha"
                width={82}
                height={56}
                priority
                className="h-14 w-[82px] object-contain"
              />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <NavLink href="/account" data-testid="nav-account-link">
                Fiókom
              </NavLink>
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
