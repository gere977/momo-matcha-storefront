"use client"

import { addToCart } from "@lib/data/cart"
import { trackEvent } from "@lib/util/analytics"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export type FamilyBundleItem = {
  handle: string
  title: string
  shortName: string
  image: string
  surfaceClass: string
  variantId?: string
  variantLabel?: string
  amount?: number
  currencyCode?: string
  available: boolean
}

type FamilyBundleProps = {
  items: FamilyBundleItem[]
  total?: number
  currencyCode?: string
  countryCode: string
  freeShippingThreshold: number
  placement: "store" | "product"
}

type BundleStatus = "idle" | "adding" | "success" | "error"

export default function MomoFamilyBundleClient({
  items,
  total,
  currencyCode,
  countryCode,
  freeShippingThreshold,
  placement,
}: FamilyBundleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<BundleStatus>("idle")
  const [addedHandles, setAddedHandles] = useState<string[]>([])
  const [activeTitle, setActiveTitle] = useState<string>()
  const [error, setError] = useState<string>()

  const unavailable = items.filter((item) => !item.available)
  const canAdd =
    unavailable.length === 0 &&
    typeof total === "number" &&
    Boolean(currencyCode)
  const remainingCount = items.length - addedHandles.length
  const qualifiesForFreeShipping =
    currencyCode?.toLowerCase() === "huf" &&
    typeof total === "number" &&
    total >= freeShippingThreshold

  const addFamily = async () => {
    if (!canAdd || status === "adding" || status === "success") return

    setStatus("adding")
    setError(undefined)

    const completed = new Set(addedHandles)
    const pendingItems = items.filter((item) => !completed.has(item.handle))

    for (const item of pendingItems) {
      if (!item.variantId) continue
      setActiveTitle(item.shortName)

      try {
        await addToCart({
          variantId: item.variantId,
          quantity: 1,
          countryCode,
        })
        completed.add(item.handle)
        setAddedHandles(Array.from(completed))
      } catch {
        setStatus("error")
        setError(
          `${item.shortName} hozzáadása nem sikerült. A már kosárba tett ízeket nem adjuk hozzá újra.`
        )
        setActiveTitle(undefined)
        router.refresh()
        return
      }
    }

    setStatus("success")
    setActiveTitle(undefined)
    router.refresh()
    trackEvent("bundle_add", pathname, document.referrer, {
      value: total,
      currency: currencyCode,
      items: items.map((item) => ({
        item_id: item.variantId,
        item_name: item.title,
        price: item.amount,
        quantity: 1,
      })),
    })
  }

  const buttonLabel = () => {
    if (status === "adding")
      return `${activeTitle ?? "Következő íz"} hozzáadása...`
    if (status === "success") return "A Momo család a kosárban van"
    if (status === "error") return `Folytatás, még ${remainingCount} íz`
    return "Mind a négyet kérem"
  }

  return (
    <section
      aria-labelledby={`momo-family-bundle-${placement}`}
      className={`relative overflow-hidden rounded-[2rem] border border-matcha-kraft/70 bg-[#fffaf1] px-5 py-7 shadow-[0_24px_70px_rgba(38,77,55,0.08)] xsmall:px-7 small:px-10 small:py-10 ${
        placement === "store" ? "mb-10 small:ml-[17.25rem] small:mb-14" : ""
      }`}
    >
      <div
        className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-strawberry/15 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-matcha/15 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative grid items-center gap-7 medium:grid-cols-[1fr_0.82fr] medium:gap-12">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-matcha-accent xsmall:text-xs">
            Egy doboz mind a négy ízből
          </p>
          <h2
            id={`momo-family-bundle-${placement}`}
            className="mt-2 max-w-2xl text-balance font-editorial text-3xl font-bold leading-[1.02] tracking-[-0.025em] text-matcha-deep xsmall:text-4xl"
          >
            Ismerd meg a teljes <span className="italic">Momo családot.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-matcha-sage xsmall:text-base">
            Original, epres, vaníliás és csokoládés matcha, a jelenleg elérhető
            változatokból. A teljes ár mindig az aktuális termékárak összege.
          </p>

          <div className="mt-6 grid grid-cols-4 gap-2 xsmall:gap-3">
            {items.map((item) => (
              <LocalizedClientLink
                key={item.handle}
                href={`/products/${item.handle}`}
                className="group text-center active:scale-[0.98]"
              >
                <div
                  className={`relative aspect-square overflow-hidden rounded-2xl ${item.surfaceClass}`}
                >
                  <Image
                    src={item.image}
                    alt={`${item.shortName} Momo Matcha fémdoboz`}
                    fill
                    sizes="(max-width: 512px) 20vw, (max-width: 1024px) 16vw, 150px"
                    className="object-contain p-1 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105"
                  />
                </div>
                <span className="mt-2 block text-[10px] font-bold text-matcha-deep xsmall:text-xs">
                  {item.shortName}
                </span>
                <span className="mt-0.5 block text-[9px] text-matcha-sage xsmall:text-[10px]">
                  {item.variantLabel ?? "Nem elérhető"}
                </span>
              </LocalizedClientLink>
            ))}
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-matcha-kraft/70 bg-white/80 p-5 backdrop-blur-sm xsmall:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-matcha-sage">
            A négy termék együtt
          </p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <p className="font-editorial text-3xl font-bold text-matcha-deep xsmall:text-4xl">
              {typeof total === "number" && currencyCode
                ? convertToLocale({
                    amount: total,
                    currency_code: currencyCode,
                  })
                : "Ár betöltése..."}
            </p>
            <span className="pb-1 text-xs text-matcha-sage">4 termék</span>
          </div>

          {qualifiesForFreeShipping && (
            <p className="mt-4 rounded-xl bg-matcha-mist/80 px-3.5 py-3 text-xs font-semibold leading-relaxed text-matcha-deep">
              Ez az összeállítás eléri az ingyenes szállítás jelenlegi{" "}
              {convertToLocale({
                amount: freeShippingThreshold,
                currency_code: currencyCode ?? "huf",
              })}
              -os értékhatárát. A végleges feltételeket a kosárban látod.
            </p>
          )}

          {unavailable.length > 0 && (
            <p className="mt-4 text-xs font-semibold leading-relaxed text-strawberry">
              Jelenleg nem kérhető együtt minden íz. Nem elérhető:{" "}
              {unavailable.map((item) => item.shortName).join(", ")}.
            </p>
          )}

          <div className="mt-5 grid gap-2.5">
            <button
              type="button"
              onClick={addFamily}
              disabled={!canAdd || status === "adding" || status === "success"}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-matcha-deep px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(27,82,52,0.18)] transition-[transform,background-color,opacity] duration-200 hover:bg-matcha active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {buttonLabel()}
            </button>
            {status === "success" && (
              <LocalizedClientLink
                href="/cart"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-matcha-deep px-5 text-sm font-bold text-matcha-deep transition-colors hover:bg-matcha-mist active:bg-matcha-mist/80"
              >
                Kosár megnyitása
              </LocalizedClientLink>
            )}
          </div>

          <div className="mt-3 min-h-5" aria-live="polite">
            {status === "adding" && (
              <p className="text-xs text-matcha-sage">
                {addedHandles.length} / {items.length} termék hozzáadva
              </p>
            )}
            {error && <p className="text-xs text-strawberry">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
