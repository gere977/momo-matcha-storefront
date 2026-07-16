"use client"

import { HttpTypes } from "@medusajs/types"
import {
  FLAVOR_PROFILES,
  MATCHA_FLAVOR_HANDLES,
  getFlavorProfile,
  getIngredients,
  getProductOrigin,
  getVariantLabel,
  isMatchaFlavor,
} from "@lib/util/product-merchandising"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

import Accordion from "./accordion"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const isFlavor = isMatchaFlavor(product.handle)
  const firstTab = isFlavor ? "Íz és elkészítés" : "Mi van a szettben?"

  const tabs = [
    {
      label: firstTab,
      component: isFlavor ? (
        <FlavorInfoTab product={product} />
      ) : (
        <SetInfoTab product={product} />
      ),
    },
    ...(isFlavor
      ? [
          {
            label: "A négy íz egymás mellett",
            component: <FlavorComparison currentHandle={product.handle} />,
          },
        ]
      : []),
    {
      label: "Szállítás és visszaküldés",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple" defaultValue={[firstTab]}>
        {tabs.map((tab) => (
          <Accordion.Item
            key={tab.label}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-matcha-kraft/70 bg-white/70 p-3.5">
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-matcha-sage">
      {label}
    </p>
    <p className="mt-1.5 text-sm font-semibold leading-snug text-matcha-deep">
      {value}
    </p>
  </div>
)

const FlavorInfoTab = ({ product }: ProductTabsProps) => {
  const profile = getFlavorProfile(product.handle)
  if (!profile) return null

  const ingredients = getIngredients(product)
  const origin = getProductOrigin(product)
  const sizes = Array.from(
    new Set((product.variants ?? []).map(getVariantLabel).filter(Boolean))
  ).join(", ")

  return (
    <div className="space-y-6 py-6 text-sm leading-relaxed text-matcha-text">
      <div className="grid grid-cols-1 gap-2.5 xsmall:grid-cols-3">
        <Fact label="Ízprofil" value={profile.taste} />
        <Fact label="Édesség és érzet" value={profile.sweetness} />
        <Fact label="Legjobb így" value={profile.bestUse} />
      </div>

      <div className="rounded-2xl bg-matcha-deep px-5 py-5 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-matcha-mist">
          Így készítsd el
        </p>
        <ol className="mt-3 grid gap-3 text-sm leading-relaxed text-white/90">
          <li>
            <strong className="text-white">1.</strong> Szitálj 1-2 g matchát a
            tálba, majd adj hozzá 70-80 ml, 75-80 °C-os vizet.
          </li>
          <li>
            <strong className="text-white">2.</strong> Habosítsd gyors, cikkcakk
            mozdulatokkal. Ne használj forrásban lévő vizet.
          </li>
          <li>
            <strong className="text-white">3.</strong> Lattéhoz öntsd fel
            150-200 ml meleg vagy hideg tejjel.
          </li>
        </ol>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 border-y border-matcha-kraft/70 py-5 xsmall:grid-cols-2">
        <div>
          <dt className="text-xs font-bold text-matcha-deep">Származás</dt>
          <dd className="mt-1 text-matcha-sage">{origin ?? "Nincs megadva"}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold text-matcha-deep">
            Választható méretek
          </dt>
          <dd className="mt-1 text-matcha-sage">{sizes || "Nincs megadva"}</dd>
        </div>
        <div className="xsmall:col-span-2">
          <dt className="text-xs font-bold text-matcha-deep">Összetevők</dt>
          <dd className="mt-1 text-matcha-sage">
            {ingredients ?? (
              <>
                A pontos összetevőlista még nincs feltöltve. Ha ez fontos neked,
                vásárlás előtt írj az{" "}
                <a
                  className="font-semibold text-matcha-accent underline decoration-matcha-accent/30 underline-offset-4"
                  href="mailto:info@momomatcha.hu"
                >
                  info@momomatcha.hu
                </a>{" "}
                címre.
              </>
            )}
          </dd>
        </div>
        <div className="xsmall:col-span-2">
          <dt className="text-xs font-bold text-matcha-deep">Tárolás</dt>
          <dd className="mt-1 text-matcha-sage">
            Tartsd jól lezárva, fénytől és hőtől védve. Felbontás után hűtőben
            tárold, és lehetőleg 4-6 héten belül használd el.
          </dd>
        </div>
      </dl>
    </div>
  )
}

const SetInfoTab = ({ product }: ProductTabsProps) => {
  const material =
    product.material ||
    ((product.metadata as Record<string, unknown> | null)?.material_hu as
      | string
      | undefined)

  return (
    <div className="space-y-5 py-6 text-sm leading-relaxed text-matcha-text">
      <div className="rounded-2xl bg-matcha-mist/70 p-5">
        <p className="font-editorial text-xl font-bold text-matcha-deep">
          Egy doboz, négy eszköz
        </p>
        <p className="mt-2 text-matcha-sage">
          Kerámia tál, bambusz habverő, habverőtartó és szűrő. A szettben minden
          alapvető eszköz megvan az otthoni matchakészítéshez.
        </p>
      </div>

      <div className="border-y border-matcha-kraft/70 py-5">
        <p className="text-xs font-bold text-matcha-deep">Anyag és méretek</p>
        <p className="mt-1 text-matcha-sage">
          {material ??
            "A pontos anyag- és méretadatok még nincsenek feltöltve. Kérdés esetén írj nekünk vásárlás előtt."}
        </p>
      </div>
    </div>
  )
}

const FlavorComparison = ({
  currentHandle,
}: {
  currentHandle?: string | null
}) => (
  <div className="grid grid-cols-2 gap-2.5 py-6">
    {MATCHA_FLAVOR_HANDLES.map((handle) => {
      const flavor = FLAVOR_PROFILES[handle]
      const isCurrent = handle === currentHandle

      return (
        <LocalizedClientLink
          key={handle}
          href={`/products/${handle}`}
          aria-current={isCurrent ? "page" : undefined}
          className={`group rounded-2xl border p-3 transition-[transform,border-color,background-color] duration-200 active:scale-[0.98] ${
            isCurrent
              ? "border-matcha-accent bg-matcha-mist/70"
              : "border-matcha-kraft/70 bg-white/70 hover:-translate-y-0.5 hover:border-matcha-accent/60"
          }`}
        >
          <div
            className={`relative aspect-square rounded-xl ${flavor.surfaceClass}`}
          >
            <Image
              src={flavor.image}
              alt={`${flavor.shortName} Momo Matcha fémdoboz`}
              fill
              sizes="(max-width: 512px) 38vw, 180px"
              className="object-contain p-2 transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </div>
          <p className="mt-3 text-sm font-bold text-matcha-deep">
            {flavor.shortName}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-matcha-sage">
            {flavor.taste}
          </p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-matcha-accent">
            {isCurrent ? "Ezt nézed" : "Megnézem"}
          </p>
        </LocalizedClientLink>
      )
    })}
  </div>
)

const ShippingInfoTab = () => (
  <div className="space-y-5 py-6 text-sm leading-relaxed text-matcha-text">
    <div>
      <p className="font-bold text-matcha-deep">Szállítás</p>
      <p className="mt-1 text-matcha-sage">
        A választható szállítási módokat, az aktuális díjat és a várható
        érkezést a pénztárban látod.
      </p>
      <LocalizedClientLink
        href="/pages/shipping"
        className="mt-2 inline-flex font-semibold text-matcha-accent underline decoration-matcha-accent/30 underline-offset-4"
      >
        Szállítási részletek
      </LocalizedClientLink>
    </div>
    <div className="border-t border-matcha-kraft/70 pt-5">
      <p className="font-bold text-matcha-deep">Visszaküldés</p>
      <p className="mt-1 text-matcha-sage">
        A visszaküldés feltételeit és lépéseit az elállási tájékoztatóban
        találod.
      </p>
      <LocalizedClientLink
        href="/pages/refunds"
        className="mt-2 inline-flex font-semibold text-matcha-accent underline decoration-matcha-accent/30 underline-offset-4"
      >
        Elállási tájékoztató
      </LocalizedClientLink>
    </div>
  </div>
)

export default ProductTabs
