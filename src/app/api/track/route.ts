import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  ""
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

// Same-origin proxy for the pageview beacon - keeps the browser free of CORS
// and backend-URL concerns.
export async function POST(req: NextRequest) {
  if (!BACKEND_URL || !PUBLISHABLE_KEY) {
    return NextResponse.json({ ok: false }, { status: 200 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  try {
    const forwardedFor = req.headers.get("x-forwarded-for")
    const response = await fetch(`${BACKEND_URL}/store/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_KEY,
        ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}),
      },
      body: JSON.stringify({
        path: body.path,
        event: body.event,
        referrer: body.referrer,
        session_id: body.session_id,
        event_id: body.event_id,
        order_id: body.order_id,
        value: body.value,
        currency: body.currency,
        utm_source: body.utm_source,
        utm_medium: body.utm_medium,
        utm_campaign: body.utm_campaign,
      }),
      cache: "no-store",
    })
    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: response.status })
    }
  } catch {
    // analytics must never break the storefront
  }

  return NextResponse.json({ ok: true })
}
