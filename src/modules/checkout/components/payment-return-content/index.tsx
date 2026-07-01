"use client"

import { useEffect, useState } from "react"
import { placeOrder } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Barion redirects the customer here after payment. The order is only authorized
// once our webhook (src/subscribers or the payment provider's getWebhookActionAndData
// on the backend) processes Barion's callback, which is delayed slightly to avoid a
// race condition - so this page retries placeOrder() a few times rather than failing
// immediately if the webhook hasn't caught up yet by the time the browser returns.
const MAX_ATTEMPTS = 6
const RETRY_DELAY_MS = 2500

export default function PaymentReturnContent() {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    const attempt = async (attemptNumber: number) => {
      try {
        await placeOrder()
        // On success, placeOrder() calls redirect() internally, which throws a
        // special Next.js error that never reaches here - this line only runs
        // if cart.complete() succeeded without needing a redirect (shouldn't happen
        // in practice, but included for completeness).
      } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
          throw error
        }
        if (cancelled) return
        if (attemptNumber >= MAX_ATTEMPTS) {
          setFailed(true)
          return
        }
        setTimeout(() => attempt(attemptNumber + 1), RETRY_DELAY_MS)
      }
    }

    attempt(1)

    return () => {
      cancelled = true
    }
  }, [])

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-6">
        <h1 className="font-heading text-4xl text-matcha-accent">
          A fizetés megerősítése tovább tart a vártnál
        </h1>
        <p className="text-matcha-text/70 max-w-md">
          Ha a fizetés sikeres volt, hamarosan e-mailben visszaigazolást kapsz. Ha
          kérdésed van, keress minket bizalommal.
        </p>
        <LocalizedClientLink
          href="/account/orders"
          className="text-matcha font-semibold underline"
        >
          Rendeléseim megtekintése
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-6">
      <h1 className="font-heading text-4xl text-matcha-accent">
        Fizetés megerősítése...
      </h1>
      <p className="text-matcha-text/70">Ne zárd be ezt az ablakot.</p>
    </div>
  )
}
