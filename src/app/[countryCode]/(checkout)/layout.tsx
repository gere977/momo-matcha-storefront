import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-matcha-bg relative small:min-h-screen">
      <div className="h-16 bg-matcha-bg border-b border-matcha-kraft/40">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-matcha-text flex items-center gap-x-2 uppercase flex-1 basis-0"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus text-matcha-text/70 hover:text-matcha-accent">
              Vissza a kosárhoz
            </span>
            <span className="mt-px block small:hidden txt-compact-plus text-matcha-text/70 hover:text-matcha-accent">
              Vissza
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="font-heading text-3xl text-matcha-accent hover:text-matcha-accent leading-none"
            data-testid="store-link"
          >
            Momo Matcha
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
