// Client-side helpers for first-party analytics plus consent-gated GA4/Meta
// events. Optional measurement stays completely off until the visitor accepts.

const SESSION_KEY = "momo_session"
const SESSION_TTL_MS = 30 * 60_000
const UTM_KEY = "momo_utm"
const CONSENT_KEY = "momo_consent_v1"

type StoredSession = { id: string; last_seen: number }

export function hasAnalyticsConsent(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "all"
  } catch {
    return false
  }
}

export function getSessionId(): string {
  try {
    const now = Date.now()
    const stored = window.localStorage.getItem(SESSION_KEY)
    let session: StoredSession | null = null

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredSession
        if (parsed.id && now - parsed.last_seen <= SESSION_TTL_MS) {
          session = parsed
        }
      } catch {
        // Previous versions stored a never-expiring raw id. Start a fresh,
        // bounded session rather than carrying it forward forever.
      }
    }

    if (!session) {
      session = {
        id: Math.random().toString(36).slice(2) + now.toString(36),
        last_seen: now,
      }
    } else {
      session.last_seen = now
    }

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session.id
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

export type AnalyticsEvent =
  | "page_view"
  | "product_click"
  | "flavor_finder_complete"
  | "add_to_cart"
  | "bundle_add"
  | "cart_cross_sell"
  | "reorder"
  | "begin_checkout"
  | "purchase"

export type CommerceEventData = {
  event_id?: string
  order_id?: string
  value?: number
  currency?: string
  items?: Array<{
    item_id?: string
    item_name?: string
    price?: number
    quantity?: number
  }>
}

function sendExternalEvent(event: AnalyticsEvent, data: CommerceEventData) {
  const externalName: Partial<Record<AnalyticsEvent, string>> = {
    product_click: "select_item",
    flavor_finder_complete: "generate_lead",
    add_to_cart: "add_to_cart",
    bundle_add: "add_to_cart",
    cart_cross_sell: "add_to_cart",
    reorder: "add_to_cart",
    begin_checkout: "begin_checkout",
    purchase: "purchase",
  }

  const name = externalName[event]
  if (name && window.gtag) {
    window.gtag("event", name, {
      transaction_id: data.order_id,
      value: data.value,
      currency: data.currency?.toUpperCase(),
      items: data.items,
    })
  }

  if (!window.fbq) return
  const metaName: Partial<Record<AnalyticsEvent, string>> = {
    product_click: "ViewContent",
    flavor_finder_complete: "Lead",
    add_to_cart: "AddToCart",
    bundle_add: "AddToCart",
    cart_cross_sell: "AddToCart",
    reorder: "AddToCart",
    begin_checkout: "InitiateCheckout",
    purchase: "Purchase",
  }
  const mapped = metaName[event]
  if (!mapped) return

  const params = {
    value: data.value,
    currency: data.currency?.toUpperCase(),
    content_ids: data.items?.map((item) => item.item_id).filter(Boolean),
    content_type: "product",
    num_items: data.items?.reduce(
      (sum, item) => sum + (item.quantity ?? 1),
      0
    ),
  }
  if (data.event_id) {
    window.fbq("track", mapped, params, { eventID: data.event_id })
  } else {
    window.fbq("track", mapped, params)
  }
}

export async function trackEvent(
  event: AnalyticsEvent,
  path: string,
  referrer?: string | null,
  data: CommerceEventData = {}
): Promise<boolean> {
  try {
    if (!hasAnalyticsConsent()) return false

    const request = fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        path,
        referrer: referrer ?? null,
        session_id: getSessionId(),
        event_id: data.event_id,
        order_id: data.order_id,
        value: data.value,
        currency: data.currency,
        ...captureUtm(),
      }),
      keepalive: true,
    })

    sendExternalEvent(event, data)
    const response = await request
    const result = await response.json().catch(() => ({}))
    return response.ok && result?.ok === true
  } catch {
    // analytics must never break the storefront
    return false
  }
}
