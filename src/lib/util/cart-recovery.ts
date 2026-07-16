import "server-only"
import crypto from "node:crypto"

type CartRecoveryPayload = {
  cart_id: string
  expires_at: number
  version: number
}

export function verifyCartRecoveryToken(token: unknown): string | null {
  const secret = process.env.CART_RECOVERY_SECRET || ""
  if (!secret) return null

  const [payload, suppliedSignature, ...rest] = String(token ?? "").split(".")
  if (!payload || !suppliedSignature || rest.length) return null

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url")
  const encoder = new TextEncoder()
  const supplied = encoder.encode(suppliedSignature)
  const expected = encoder.encode(expectedSignature)

  if (
    supplied.length !== expected.length ||
    !crypto.timingSafeEqual(supplied, expected)
  ) {
    return null
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as CartRecoveryPayload
    const cartId = String(parsed.cart_id ?? "")

    if (
      parsed.version !== 1 ||
      !Number.isFinite(parsed.expires_at) ||
      parsed.expires_at <= Date.now() ||
      !/^cart_[A-Za-z0-9_-]{4,120}$/.test(cartId)
    ) {
      return null
    }

    return cartId
  } catch {
    return null
  }
}
