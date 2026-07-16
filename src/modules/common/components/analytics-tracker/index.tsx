"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { trackEvent } from "@lib/util/analytics"
import { CONSENT_EVENT } from "@modules/common/components/consent-manager"

// Fires one beacon per route change to /api/track (first-party analytics -
// no cookies, no external service). UTM params from the landing URL are
// captured once per session and attached to every event for campaign
// attribution in the admin Statisztika page.
const AnalyticsTracker = () => {
  const pathname = usePathname()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || lastTracked.current === pathname) {
      return
    }

    const emit = () => {
      if (lastTracked.current === pathname) return

      // Strip the country code segment so stats group by real page
      const normalized = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/") || "/"

      trackEvent("page_view", normalized, document.referrer || null)

      // trackEvent becomes a no-op without consent. Only mark the route as
      // emitted once consent exists so accepting the banner records the
      // current landing page instead of waiting for the next navigation.
      try {
        if (window.localStorage.getItem("momo_consent_v1") !== "all") return
      } catch {
        return
      }

      lastTracked.current = pathname
      // Purchase is emitted by OrderAnalytics with transaction id, value,
      // currency and items. A route-only purchase here would double count it.
    }

    emit()
    window.addEventListener(CONSENT_EVENT, emit)
    return () => window.removeEventListener(CONSENT_EVENT, emit)
  }, [pathname])

  return null
}

export default AnalyticsTracker
