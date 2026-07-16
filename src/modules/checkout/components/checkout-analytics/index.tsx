"use client"

import { trackEvent } from "@lib/util/analytics"
import { CONSENT_EVENT } from "@modules/common/components/consent-manager"
import { useEffect } from "react"

type Props = {
  cartId: string
  value: number
  currency: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}

export default function CheckoutAnalytics({
  cartId,
  value,
  currency,
  items,
}: Props) {
  useEffect(() => {
    const key = `momo_checkout_${cartId}`
    const send = async () => {
      try {
        if (window.localStorage.getItem("momo_consent_v1") !== "all") return
        if (window.sessionStorage.getItem(key)) return
      } catch {
        return
      }

      const ok = await trackEvent(
        "begin_checkout",
        window.location.pathname,
        document.referrer,
        {
          event_id: key,
          value,
          currency,
          items: items.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }
      )
      if (ok) {
        try {
          window.sessionStorage.setItem(key, "1")
        } catch {}
      }
    }

    void send()
    window.addEventListener(CONSENT_EVENT, send)
    return () => window.removeEventListener(CONSENT_EVENT, send)
  }, [cartId, currency, items, value])

  return null
}
