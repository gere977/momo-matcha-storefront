// Client-side helpers for the first-party analytics beacon (/api/track).
// No cookies, no external service — session id is a random localStorage token.

const SESSION_KEY = "momo_session"
const UTM_KEY = "momo_utm"

export function getSessionId(): string {
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

type Utm = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

// Captures utm_* params from the landing URL once per session, so every
// subsequent event of the visit is attributed to the campaign that brought
// the visitor here.
export function captureUtm(): Utm {
  try {
    const params = new URLSearchParams(window.location.search)
    const fresh: Utm = {}
    for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
      const v = params.get(key)
      if (v) fresh[key] = v.slice(0, 128)
    }
    if (Object.keys(fresh).length) {
      window.sessionStorage.setItem(UTM_KEY, JSON.stringify(fresh))
      return fresh
    }
    const stored = window.sessionStorage.getItem(UTM_KEY)
    return stored ? (JSON.parse(stored) as Utm) : {}
  } catch {
    return {}
  }
}

export function trackEvent(
  event: "page_view" | "add_to_cart" | "begin_checkout" | "purchase",
  path: string,
  referrer?: string | null
) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        path,
        referrer: referrer ?? null,
        session_id: getSessionId(),
        ...captureUtm(),
      }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // analytics must never break the storefront
  }
}
