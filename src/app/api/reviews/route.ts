import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  ""
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

// Same-origin proxy for review submission — keeps the browser free of CORS
// and backend-URL concerns (same pattern as /api/track).
export async function POST(req: NextRequest) {
  if (!BACKEND_URL || !PUBLISHABLE_KEY) {
    return NextResponse.json(
      { message: "A vélemények most nem elérhetők." },
      { status: 503 }
    )
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: "Hibás kérés." }, { status: 400 })
  }

  try {
    const res = await fetch(`${BACKEND_URL}/store/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_KEY,
        // Forward the caller IP so the backend rate limit applies per-visitor.
        "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
      },
      body: JSON.stringify({
        product_id: body.product_id,
        name: body.name,
        email: body.email,
        rating: body.rating,
        text: body.text,
      }),
      cache: "no-store",
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json(
      { message: "Nem sikerült elküldeni — próbáld újra kicsit később." },
      { status: 502 }
    )
  }
}
