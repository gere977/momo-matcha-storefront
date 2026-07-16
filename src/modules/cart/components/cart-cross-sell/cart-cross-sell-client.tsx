"use client"

import { addToCart } from "@lib/data/cart"
import { trackEvent } from "@lib/util/analytics"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export type CartCrossSellItem = {
  handle: string
  title: string
  image?: string
  variantId: string
  variantLabel: string
  amount: number
  currencyCode: string
}

type ItemState = "idle" | "adding" | "success" | "error"

export default function CartCrossSellClient({
  items,
  countryCode,
}: {
  items: CartCrossSellItem[]
  countryCode: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [states, setStates] = useState<Record<string, ItemState>>({})

  const quickAdd = async (item: CartCrossSellItem) => {
    if (states[item.variantId] === "adding") return

    setStates((current) => ({ ...current, [item.variantId]: "adding" }))
    try {
      await addToCart({
        variantId: item.variantId,
        quantity: 1,
        countryCode,
      })
      setStates((current) => ({ ...current, [item.variantId]: "success" }))
      router.refresh()
      trackEvent("cart_cross_sell", pathname, document.referrer, {
        value: item.amount,
        currency: item.currencyCode,
        items: [
          {
            item_id: item.variantId,
            item_name: item.title,
            price: item.amount,
            quantity: 1,
          },
        ],
      })
    } catch {
      setStates((current) => ({ ...current, [item.variantId]: "error" }))
    }
  }

  return (
    <section aria-labelledby="cart-cross-sell-title" className="pt-1">
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-matcha-accent">
          Jól jöhet mellé
        </p>
        <h2
          id="cart-cross-sell-title"
          className="mt-1 font-editorial text-2xl font-bold text-matcha-deep"
        >
          Egészítsd ki a rituálédat
        </h2>
      </div>

      <div className="grid gap-3 xsmall:grid-cols-2">
        {items.map((item) => {
          const state = states[item.variantId] ?? "idle"

          return (
            <article
              key={item.variantId}
              className="grid grid-cols-[5.5rem_1fr] gap-3 rounded-2xl border border-matcha-kraft/70 bg-matcha-bg/55 p-3"
            >
              <LocalizedClientLink
                href={`/products/${item.handle}`}
                className="relative aspect-square overflow-hidden rounded-xl bg-white active:scale-[0.98]"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="88px"
                    className="object-contain p-1.5"
                  />
                )}
              </LocalizedClientLink>
              <div className="min-w-0 py-0.5">
                <LocalizedClientLink
                  href={`/products/${item.handle}`}
                  className="line-clamp-2 text-xs font-bold leading-snug text-matcha-deep hover:text-matcha-accent"
                >
                  {item.title}
                </LocalizedClientLink>
                <p className="mt-1 text-[10px] text-matcha-sage">
                  {item.variantLabel}
                </p>
                <p className="mt-1.5 text-xs font-bold text-matcha-deep">
                  {convertToLocale({
                    amount: item.amount,
                    currency_code: item.currencyCode,
                  })}
                </p>
                <button
                  type="button"
                  onClick={() => quickAdd(item)}
                  disabled={state === "adding" || state === "success"}
                  className="mt-2 min-h-8 rounded-full bg-matcha-deep px-3 text-[10px] font-bold text-white transition-[transform,background-color,opacity] hover:bg-matcha active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state === "adding"
                    ? "Hozzáadás..."
                    : state === "success"
                    ? "Kosárban"
                    : state === "error"
                    ? "Újra"
                    : "Gyors hozzáadás"}
                </button>
                <div className="mt-1 min-h-3" aria-live="polite">
                  {state === "error" && (
                    <p className="text-[9px] text-strawberry">
                      Nem sikerült, próbáld újra.
                    </p>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
