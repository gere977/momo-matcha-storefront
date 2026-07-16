"use client"

import { hasAnalyticsConsent, trackEvent } from "@lib/util/analytics"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useState } from "react"

type FlavorKey = "original" | "strawberry" | "vanilla" | "chocolate"
type FlavorScores = Record<FlavorKey, number>

const FLAVORS: Record<
  FlavorKey,
  {
    label: string
    title: string
    note: string
    handle: string
    image: string
    color: string
    soft: string
  }
> = {
  original: {
    label: "Original",
    title: "Original Prémium Momo Matcha",
    note: "Tiszta, umamis karakter — ha a klasszikus matchaélményt keresed.",
    handle: "original-premium-momo-matcha",
    image: "/images/products/momo-original-tin.png",
    color: "#327a4d",
    soft: "#e4efca",
  },
  strawberry: {
    label: "Epres",
    title: "Epres Prémium Momo Matcha",
    note: "Friss, gyümölcsös irány — jéggel és lattéban is könnyen szerethető.",
    handle: "epres-premium-momo-matcha",
    image: "/images/products/momo-strawberry-tin.png",
    color: "#d9577d",
    soft: "#ffd9e3",
  },
  vanilla: {
    label: "Vaníliás",
    title: "Vaníliás Prémium Momo Matcha",
    note: "Lágy, selymes választás egy nyugodtabb, krémesebb lattéhoz.",
    handle: "vanilias-premium-momo-matcha",
    image: "/images/products/momo-vanilla-tin.png",
    color: "#af8244",
    soft: "#f6e4c6",
  },
  chocolate: {
    label: "Csokoládés",
    title: "Csokoládés Prémium Momo Matcha",
    note: "Mélyebb, kakaós íz — ha a matchád egy kicsit desszert is lenne.",
    handle: "csokoladas-premium-momo-matcha",
    image: "/images/products/momo-chocolate-tin.png",
    color: "#74432e",
    soft: "#e8c0a9",
  },
}

const QUESTIONS: Array<{
  question: string
  eyebrow: string
  options: Array<{
    label: string
    hint: string
    scores: Partial<FlavorScores>
  }>
}> = [
  {
    eyebrow: "Első korty",
    question: "Hogy innád leggyakrabban?",
    options: [
      {
        label: "Tisztán, vízzel",
        hint: "A klasszikus vonal érdekel",
        scores: { original: 3 },
      },
      {
        label: "Jegesen, tejjel",
        hint: "Friss és könnyű legyen",
        scores: { strawberry: 2, vanilla: 1 },
      },
      {
        label: "Meleg lattéban",
        hint: "Krémes reggelt kérek",
        scores: { vanilla: 2, chocolate: 1 },
      },
      {
        label: "Desszertesebben",
        hint: "Jöhet a kakaósabb karakter",
        scores: { chocolate: 3 },
      },
    ],
  },
  {
    eyebrow: "Ízradar",
    question: "Melyik íz húz most?",
    options: [
      {
        label: "Tiszta & umamis",
        hint: "Nem kell mellé extra íz",
        scores: { original: 3 },
      },
      {
        label: "Friss & gyümölcsös",
        hint: "Egy kis pink energia",
        scores: { strawberry: 3 },
      },
      {
        label: "Lágy & vaníliás",
        hint: "Soft morning hangulat",
        scores: { vanilla: 3 },
      },
      {
        label: "Mély & kakaós",
        hint: "Comfort drink módra",
        scores: { chocolate: 3 },
      },
    ],
  },
  {
    eyebrow: "Utolsó kérdés",
    question: "Milyen reggel passzol hozzád?",
    options: [
      {
        label: "Letisztult",
        hint: "Kevés dolog, jó alapok",
        scores: { original: 2 },
      },
      {
        label: "Mozgalmas",
        hint: "Gyors, jeges, indulhatunk",
        scores: { strawberry: 2 },
      },
      {
        label: "Lassú",
        hint: "Meleg bögre, semmi sietség",
        scores: { vanilla: 2 },
      },
      {
        label: "Bekuckózós",
        hint: "Krémes és kicsit extra",
        scores: { chocolate: 2 },
      },
    ],
  },
]

const EMPTY_SCORES: FlavorScores = {
  original: 0,
  strawberry: 0,
  vanilla: 0,
  chocolate: 0,
}

const FLAVOR_KEYS = Object.keys(FLAVORS) as FlavorKey[]

function emitFinderEvent(action: string, value: string) {
  const path = `/interactions/flavor-finder/${action}/${encodeURIComponent(
    value
  )}`

  if (action === "result") {
    trackEvent("flavor_finder_complete", path, null, {
      items: [{ item_name: FLAVORS[value as FlavorKey]?.title ?? value }],
    })
  }

  if (action === "product-click") {
    trackEvent("product_click", path, null, {
      items: [{ item_name: FLAVORS[value as FlavorKey]?.title ?? value }],
    })
  }

  if (!hasAnalyticsConsent()) return

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, string>>
  }
  analyticsWindow.dataLayer?.push({
    event: `flavor_finder_${action}`,
    value,
  })
}

export default function FlavorFinder() {
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<FlavorScores>(EMPTY_SCORES)
  const [result, setResult] = useState<FlavorKey | null>(null)

  const answer = (optionLabel: string, optionScores: Partial<FlavorScores>) => {
    const nextScores = { ...scores }
    FLAVOR_KEYS.forEach((key) => {
      nextScores[key] += optionScores[key] ?? 0
    })

    emitFinderEvent(`answer-${step + 1}`, optionLabel)
    setScores(nextScores)

    if (step === QUESTIONS.length - 1) {
      const winner = FLAVOR_KEYS.reduce((best, current) =>
        nextScores[current] > nextScores[best] ? current : best
      )
      setResult(winner)
      emitFinderEvent("result", winner)
      return
    }

    setStep((current) => current + 1)
  }

  const restart = () => {
    setStep(0)
    setScores(EMPTY_SCORES)
    setResult(null)
    emitFinderEvent("restart", "quiz")
  }

  const match = result ? FLAVORS[result] : null
  const currentQuestion = QUESTIONS[step]

  return (
    <section
      id="melyik-momo"
      className="scroll-mt-24 overflow-hidden bg-matcha-bg px-6 pb-12 pt-16 small:pb-20 small:pt-24"
    >
      <div className="content-container">
        <div className="grid overflow-hidden rounded-[2rem] border border-matcha/20 bg-matcha-dark shadow-[0_28px_80px_rgba(35,76,56,0.16)] small:grid-cols-[0.78fr_1.22fr]">
          <div className="relative flex min-h-[20rem] flex-col justify-between overflow-hidden px-7 py-9 small:min-h-[34rem] small:px-10 small:py-12">
            <span
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#ff5353] opacity-90"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-matcha opacity-45 blur-2xl"
            />

            <div className="relative z-10 max-w-sm">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-vanilla">
                3 kérdés · kb. 20 másodperc
              </span>
              <h2 className="mt-4 text-balance font-heading text-4xl font-bold leading-[0.98] text-white small:text-6xl">
                Melyik Momo vagy?
              </h2>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70 small:text-base">
                Nem kell matchaszakértőnek lenned. Mondd meg, hogyan innád, mi
                ízlik, és mutatjuk, melyikkel kezdenénk a helyedben.
              </p>
            </div>

            <p className="relative z-10 mt-10 text-xs text-white/45">
              Gyors íztipp, nem személyiségteszt. Bár az eredmény néha gyanúsan
              pontos.
            </p>
          </div>

          <div
            className="relative flex min-h-[31rem] flex-col bg-[#fffaf0] px-6 py-8 small:min-h-[34rem] small:px-10 small:py-10"
            aria-live="polite"
          >
            {match ? (
              <div className="grid h-full flex-1 items-center gap-5 small:grid-cols-[0.9fr_1.1fr]">
                <div
                  className="relative mx-auto aspect-square w-full max-w-[16rem] overflow-hidden rounded-full"
                  style={{ backgroundColor: match.soft }}
                >
                  <Image
                    src={match.image}
                    alt={`${match.label} Momo Matcha fémdoboz`}
                    fill
                    sizes="(max-width: 767px) 70vw, 260px"
                    quality={82}
                    className="object-contain p-3 drop-shadow-[0_20px_20px_rgba(35,76,56,0.18)]"
                  />
                </div>

                <div>
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.22em]"
                    style={{ color: match.color }}
                  >
                    A te Momód
                  </span>
                  <h3 className="mt-3 text-balance font-heading text-3xl font-bold leading-tight text-matcha-dark small:text-4xl">
                    {match.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-matcha-text/70">
                    {match.note}
                  </p>
                  <LocalizedClientLink
                    href={`/products/${match.handle}`}
                    onClick={() => emitFinderEvent("product-click", result!)}
                    className="mt-7 inline-flex items-center gap-3 rounded-full bg-matcha-accent px-7 py-3.5 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-matcha-accent/25"
                  >
                    Megnézem ezt az ízt <span aria-hidden="true">→</span>
                  </LocalizedClientLink>
                  <button
                    type="button"
                    onClick={restart}
                    className="mt-4 block text-xs font-semibold text-matcha-text/55 underline decoration-matcha-kraft underline-offset-4 hover:text-matcha-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha"
                  >
                    Újrakezdem
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="mb-8 flex items-center gap-2"
                  aria-hidden="true"
                >
                  {QUESTIONS.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        index <= step
                          ? "bg-matcha-accent"
                          : "bg-matcha-kraft/60"
                      }`}
                    />
                  ))}
                </div>

                <fieldset className="flex flex-1 flex-col">
                  <legend className="w-full">
                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-matcha">
                      {currentQuestion.eyebrow}
                    </span>
                    <span className="mt-2 block text-balance font-heading text-3xl font-bold leading-tight text-matcha-dark small:text-4xl">
                      {currentQuestion.question}
                    </span>
                  </legend>

                  <div className="mt-7 grid flex-1 gap-3 small:grid-cols-2">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => answer(option.label, option.scores)}
                        className="group flex min-h-24 flex-col justify-center rounded-2xl border border-matcha-kraft/70 bg-white px-5 py-4 text-left shadow-[0_8px_24px_rgba(68,83,62,0.05)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-matcha hover:shadow-[0_12px_28px_rgba(68,83,62,0.12)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-matcha/20"
                      >
                        <span className="font-heading text-lg font-bold text-matcha-dark">
                          {option.label}
                        </span>
                        <span className="mt-1 text-xs leading-relaxed text-matcha-text/50">
                          {option.hint}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
