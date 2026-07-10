import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

// Matches the automatic INGYENSZALLITAS15000 promotion configured in Medusa.
const FREE_SHIPPING_THRESHOLD = Number(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 15000
)

// Goal-gradient nudge: shows how close the cart is to free shipping with a
// progress bar. Renders for HUF carts only (the threshold is a HUF amount).
const FreeShippingBar = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const currencyCode = cart.currency_code ?? "huf"
  if (currencyCode.toLowerCase() !== "huf") {
    return null
  }

  const subtotal = cart.item_subtotal ?? 0
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal
  const progress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  )

  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl bg-matcha/10 px-4 py-3"
      data-testid="free-shipping-bar"
    >
      <p className="text-xs font-semibold text-matcha-dark">
        {remaining > 0 ? (
          <>
            Még{" "}
            <span className="text-matcha-accent">
              {convertToLocale({ amount: remaining, currency_code: currencyCode })}
            </span>{" "}
            és a szállítás ingyenes! 🚚
          </>
        ) : (
          <>A szállításod ingyenes! 🎉</>
        )}
      </p>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Ingyenes szállítás állapota"
      >
        <div
          className="h-full rounded-full bg-matcha transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default FreeShippingBar
