import { verifyCartRecoveryToken } from "@lib/util/cart-recovery"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  ""
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

type RecoveryStatus = "restored" | "merged" | "partial" | "invalid"

function cartRedirect(req: NextRequest, status: RecoveryStatus) {
  const destination = new URL("/hu/cart", req.nextUrl.origin)
  destination.searchParams.set("utm_source", "email")
  destination.searchParams.set("utm_medium", "email")
  destination.searchParams.set("utm_campaign", "abandoned_cart")
  destination.searchParams.set("recovery", status)
  return destination
}

async function retrieveCart(cartId: string) {
  const fields = encodeURIComponent("id,completed_at,*items")
  const response = await fetch(
    `${BACKEND_URL}/store/carts/${encodeURIComponent(cartId)}?fields=${fields}`,
    {
      headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
      cache: "no-store",
    }
  )
  if (!response.ok) return null
  const body = await response.json()
  return body?.cart && !body.cart.completed_at ? body.cart : null
}

export async function GET(req: NextRequest) {
  const cartId = verifyCartRecoveryToken(req.nextUrl.searchParams.get("token"))

  if (!cartId || !BACKEND_URL || !PUBLISHABLE_KEY) {
    return NextResponse.redirect(cartRedirect(req, "invalid"), 303)
  }

  try {
    const recoveredCart = await retrieveCart(cartId)
    if (!recoveredCart?.id) {
      return NextResponse.redirect(cartRedirect(req, "invalid"), 303)
    }

    const currentCartId = req.cookies.get("_medusa_cart_id")?.value
    if (currentCartId && currentCartId !== cartId) {
      const currentCart = await retrieveCart(currentCartId)
      if (currentCart?.id) {
        let merged = 0
        for (const item of recoveredCart.items ?? []) {
          if (!item.variant_id || !item.quantity) continue
          const add = await fetch(
            `${BACKEND_URL}/store/carts/${encodeURIComponent(
              currentCartId
            )}/line-items`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": PUBLISHABLE_KEY,
              },
              body: JSON.stringify({
                variant_id: item.variant_id,
                quantity: item.quantity,
              }),
              cache: "no-store",
            }
          )
          if (!add.ok) {
            return NextResponse.redirect(
              cartRedirect(req, merged > 0 ? "partial" : "invalid"),
              303
            )
          }
          merged += 1
        }
        return NextResponse.redirect(cartRedirect(req, "merged"), 303)
      }
    }

    const redirect = NextResponse.redirect(cartRedirect(req, "restored"), 303)
    redirect.cookies.set("_medusa_cart_id", cartId, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    return redirect
  } catch {
    return NextResponse.redirect(cartRedirect(req, "invalid"), 303)
  }
}
