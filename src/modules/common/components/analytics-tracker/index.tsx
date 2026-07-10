"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { trackEvent } from "@lib/util/analytics"

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
    lastTracked.current = pathname

    // Strip the country code segment so stats group by real page
    const normalized = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/") || "/"

    trackEvent("page_view", normalized, document.referrer || null)

    // Explicit funnel events on top of the pageview, so the admin funnel
    // doesn't depend on path heuristics alone.
    if (normalized.includes("/checkout")) {
      trackEvent("begin_checkout", normalized)
    }
    if (/\/order\/.+\/confirmed/.test(normalized)) {
      trackEvent("purchase", normalized)
    }
  }, [pathname])

  return null
}

export default AnalyticsTracker
