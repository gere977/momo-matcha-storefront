"use client"

import {
  ANALYTICS_READY_EVENT,
  CONSENT_EVENT,
} from "@modules/common/components/consent-manager"
import { trackEvent } from "@lib/util/analytics"
import { useEffect } from "react"

type Item = {
  id: string
  name: string
  price: number
  quantity: number
}

type Props = {
  orderId: string
  value: number
  currency: string
  items: Item[]
}

export default function OrderAnalytics({
  orderId,
  value,
  currency,
  items,
}: Props) {
  useEffect(() => {
    const storageKey = `momo_purchase_${orderId}`
    const mountedAt = Date.now()
    const googleConfigured = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
    const metaConfigured = Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID)
    let sending = false

    const send = async () => {
      try {
        if (window.localStorage.getItem("momo_consent_v1") !== "all") return
        if (window.localStorage.getItem(storageKey)) return
      } catch {
        return
      }

      // Consent can be accepted before Next has finished loading the optional
      // tags. Give configured tags a short chance to become ready, then fall
      // back to first-party + CAPI so ad blockers never lose the conversion.
      const optionalTagPending =
        (googleConfigured && !window.gtag) ||
        (metaConfigured && !window.fbq)
      if (optionalTagPending && Date.now() - mountedAt < 3500) return
      if (sending) return
      sending = true

      const eventId = `momo_order_${orderId}`
      const eventItems = items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      const firstParty = trackEvent("purchase", window.location.pathname, null, {
        event_id: eventId,
        order_id: orderId,
        value,
        currency,
        items: eventItems,
      })

      // The endpoint validates the consent cookie and becomes a no-op until
      // META_PIXEL_ID + META_CAPI_ACCESS_TOKEN are configured server-side.
      const meta = fetch("/api/conversions/meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          order_id: orderId,
          value,
          currency,
          items: eventItems,
          event_source_url: window.location.href,
        }),
        keepalive: true,
      }).catch(() => null)

      try {
        const [firstPartyOk, metaResponse] = await Promise.all([
          firstParty,
          meta,
        ])
        if (firstPartyOk && metaResponse?.ok) {
          window.localStorage.setItem(storageKey, "1")
        }
      } catch {
        // Non-critical.
      } finally {
        sending = false
      }
    }

    send()
    const retries = [500, 1500, 3600, 10_000, 30_000].map((delay) =>
      window.setTimeout(() => void send(), delay)
    )
    window.addEventListener(CONSENT_EVENT, send)
    window.addEventListener(ANALYTICS_READY_EVENT, send)
    return () => {
      retries.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener(CONSENT_EVENT, send)
      window.removeEventListener(ANALYTICS_READY_EVENT, send)
    }
  }, [currency, items, orderId, value])

  return null
}
