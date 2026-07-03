"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const SESSION_KEY = "momo_session"

function getSessionId(): string {
  try {
    let id = window.localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      window.localStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return "anon"
  }
}

// Fires one beacon per route change to /api/track (first-party analytics -
// no cookies, no external service).
const AnalyticsTracker = () => {
  const pathname = usePathname()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || lastTracked.current === pathname) {
      return
    }
    lastTracked.current = pathname

    // Strip the country code segment so stats group by real page
    const normalized = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/")

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: normalized || "/",
        referrer: document.referrer || null,
        session_id: getSessionId(),
      }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}

export default AnalyticsTracker
