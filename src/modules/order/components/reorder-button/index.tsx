"use client"

import { addToCart } from "@lib/data/cart"
import { trackEvent } from "@lib/util/analytics"
import { HttpTypes } from "@medusajs/types"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"

export default function ReorderButton({
  order,
}: {
  order: HttpTypes.StoreOrder
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ countryCode?: string }>()
  const countryCode = params?.countryCode || "hu"
  const [state, setState] = useState<"idle" | "adding" | "error">("idle")
  const [addedVariantIds, setAddedVariantIds] = useState<string[]>([])
  const items = useMemo(
    () =>
      (order.items ?? [])
        .map((item) => ({
          variantId: item.variant_id,
          quantity: item.quantity,
        }))
        .filter(
          (item): item is { variantId: string; quantity: number } =>
            Boolean(item.variantId) && item.quantity > 0
        ),
    [order.items]
  )

  if (!items.length || order.status === "canceled") return null

  const reorder = async () => {
    if (state === "adding") return
    setState("adding")

    try {
      const completed = new Set(addedVariantIds)
      const pending = items.filter((item) => !completed.has(item.variantId))

      for (const item of pending) {
        await addToCart({
          variantId: item.variantId,
          quantity: item.quantity,
          countryCode,
        })
        completed.add(item.variantId)
        setAddedVariantIds(Array.from(completed))
      }
      trackEvent("reorder", pathname, document.referrer, {
        order_id: order.id,
        currency: order.currency_code,
        value: order.total,
        items: items.map((item) => ({
          item_id: item.variantId,
          quantity: item.quantity,
        })),
      })
      router.push(`/${countryCode}/cart`)
      router.refresh()
    } catch {
      setState("error")
    }
  }

  return (
    <div className="rounded-2xl border border-matcha/20 bg-matcha-bg px-5 py-4 small:flex small:items-center small:justify-between small:gap-5">
      <div>
        <p className="font-heading text-lg font-bold text-matcha-dark">
          Jöhet ugyanaz még egyszer?
        </p>
        <p className="mt-1 text-sm text-matcha-text/70">
          A rendelés elérhető tételeit egy kattintással a kosaradba tesszük.
        </p>
      </div>
      <button
        type="button"
        onClick={reorder}
        disabled={state === "adding"}
        className="mt-4 min-w-44 rounded-full bg-matcha-dark px-6 py-3 text-sm font-bold text-white transition hover:bg-matcha disabled:cursor-wait disabled:opacity-60 small:mt-0"
      >
        {state === "adding"
          ? "Kosárba tesszük…"
          : state === "error"
          ? "Folytatom →"
          : "Újrarendelem →"}
      </button>
      {state === "error" && (
        <p className="mt-2 text-xs font-semibold text-red-700 small:sr-only">
          Valamelyik tétel most nem elérhető. Próbáld újra később.
        </p>
      )}
    </div>
  )
}
