import { NextRequest, NextResponse } from "next/server"
import crypto from "node:crypto"

const PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN
const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v25.0"
const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  ""
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
const rateBuckets = new Map<string, { count: number; resetAt: number }>()

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex")
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const bucket = rateBuckets.get(ip)
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  bucket.count += 1
  return bucket.count > 20
}

export async function POST(req: NextRequest) {
  if (req.cookies.get("momo_consent")?.value !== "all") {
    return NextResponse.json({ ok: true, skipped: "consent" })
  }
  if (!PIXEL_ID || !ACCESS_TOKEN || !BACKEND_URL || !PUBLISHABLE_KEY) {
    return NextResponse.json({ ok: true, skipped: "not_configured" })
  }

  const requestIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (isRateLimited(requestIp)) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  let body: Record<string, any>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const orderId = String(body.order_id || "").slice(0, 128)
  if (!/^order_[A-Za-z0-9_-]{4,120}$/.test(orderId)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  // Never trust browser-supplied revenue. Re-fetch the order and derive the
  // conversion value/items from Medusa. The customer JWT is forwarded when
  // present; guest confirmation still relies on Medusa's unguessable order id.
  let order: Record<string, any>
  try {
    const jwt = req.cookies.get("_medusa_jwt")?.value
    const response = await fetch(
      `${BACKEND_URL}/store/orders/${encodeURIComponent(
        orderId
      )}?fields=id,total,currency_code,email,shipping_address.phone,*items`,
      {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_KEY,
          ...(jwt ? { authorization: `Bearer ${jwt}` } : {}),
        },
        cache: "no-store",
      }
    )
    const data = response.ok ? await response.json() : null
    if (!data?.order?.id) {
      return NextResponse.json({ ok: false }, { status: 404 })
    }
    order = data.order
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 })
  }

  const value = Number(order.total)
  const currency = String(order.currency_code || "HUF")
    .toUpperCase()
    .slice(0, 3)
  const eventId = `momo_order_${order.id}`.slice(0, 160)
  const items = Array.isArray(order.items) ? order.items.slice(0, 50) : []

  if (!Number.isFinite(value) || value < 0) {
    return NextResponse.json({ ok: false }, { status: 422 })
  }

  const forwarded = req.headers.get("x-forwarded-for")
  const clientIp = forwarded?.split(",")[0]?.trim()
  const userAgent = req.headers.get("user-agent") || undefined
  const normalizedEmail = String(order.email || "").trim().toLowerCase()
  const normalizedPhone = String(order.shipping_address?.phone || "").replace(
    /[^\d+]/g,
    ""
  )

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: String(body.event_source_url || "").slice(0, 1000),
        action_source: "website",
        user_data: {
          ...(clientIp ? { client_ip_address: clientIp } : {}),
          ...(userAgent ? { client_user_agent: userAgent } : {}),
          ...(normalizedEmail ? { em: [sha256(normalizedEmail)] } : {}),
          ...(normalizedPhone ? { ph: [sha256(normalizedPhone)] } : {}),
          ...(req.cookies.get("_fbp")?.value
            ? { fbp: req.cookies.get("_fbp")?.value }
            : {}),
          ...(req.cookies.get("_fbc")?.value
            ? { fbc: req.cookies.get("_fbc")?.value }
            : {}),
        },
        custom_data: {
          order_id: orderId,
          value,
          currency,
          content_type: "product",
          content_ids: items
            .map((item: any) => item.variant_id || item.id)
            .filter(Boolean),
          contents: items.map((item: any) => ({
            id: item.variant_id || item.id,
            quantity: Number(item.quantity) || 1,
            item_price: Number(item.unit_price) || 0,
          })),
          num_items: items.reduce(
            (sum: number, item: any) => sum + (Number(item.quantity) || 1),
            0
          ),
        },
      },
    ],
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(
        ACCESS_TOKEN
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 })
  }
}
