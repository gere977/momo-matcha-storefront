"use client"

import { useMemo, useState } from "react"
import { FAQ_CATEGORIES, FAQS, FaqCategory } from "@modules/home/components/faq/data"

type CategoryFilter = "all" | FaqCategory

export default function FaqBrowser() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<CategoryFilter>("all")

  const normalizedQuery = query.trim().toLocaleLowerCase("hu-HU")
  const filteredFaqs = useMemo(
    () =>
      FAQS.filter((item) => {
        const matchesCategory = category === "all" || item.category === category
        const haystack = `${item.q} ${item.a}`.toLocaleLowerCase("hu-HU")
        return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery))
      }),
    [category, normalizedQuery]
  )

  return (
    <div className="grid grid-cols-1 gap-10 small:grid-cols-[15rem_minmax(0,1fr)] small:gap-14">
      <aside className="small:sticky small:top-36 small:self-start" aria-label="GYIK témakörök">
        <label htmlFor="faq-search" className="block text-xs font-bold uppercase tracking-[0.18em] text-matcha-text/55">
          Keresés a válaszok között
        </label>
        <div className="relative mt-3">
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pl. szállítás, koffein…"
            className="w-full rounded-full border border-matcha-kraft/60 bg-white/75 py-3.5 pl-5 pr-11 text-sm text-matcha-text outline-none transition-[border-color,box-shadow] placeholder:text-matcha-text/35 focus:border-matcha focus:ring-4 focus:ring-matcha/10"
          />
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-matcha">
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>
        </div>

        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-2 small:flex-col small:overflow-visible" role="group" aria-label="Szűrés témakör szerint">
          {[{ id: "all", label: "Minden kérdés" }, ...FAQ_CATEGORIES].map((item) => {
            const active = category === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id as CategoryFilter)}
                aria-pressed={active}
                className={`shrink-0 rounded-full px-4 py-2.5 text-left text-sm font-semibold transition-[background-color,color,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha focus-visible:ring-offset-2 ${
                  active
                    ? "bg-matcha-dark text-white"
                    : "bg-white/70 text-matcha-text/70 hover:bg-matcha/10 hover:text-matcha-dark"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </aside>

      <section aria-live="polite" aria-label="Gyakori kérdések és válaszok">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-matcha-kraft/50 pb-4">
          <p className="font-heading text-2xl font-bold text-matcha-dark">
            {category === "all"
              ? "Minden kérdés"
              : FAQ_CATEGORIES.find((item) => item.id === category)?.label}
          </p>
          <p className="text-sm tabular-nums text-matcha-text/45">{filteredFaqs.length} válasz</p>
        </div>

        {filteredFaqs.length ? (
          <div className="divide-y divide-matcha-kraft/45">
            {filteredFaqs.map((item) => (
              <details key={item.id} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-heading text-lg font-bold leading-snug text-matcha-text transition-colors hover:text-matcha-accent focus-visible:outline-none focus-visible:text-matcha-accent [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="relative h-6 w-6 shrink-0 rounded-full border border-matcha/40 transition-[background-color,border-color,transform] group-open:rotate-45 group-open:border-matcha group-open:bg-matcha group-open:text-white" aria-hidden="true">
                    <span className="absolute left-1/2 top-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
                  </span>
                </summary>
                <p className="max-w-[68ch] pb-6 pr-10 text-[15px] leading-7 text-matcha-text/70">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] bg-white/60 px-6 py-14 text-center">
            <p className="font-heading text-2xl font-bold text-matcha-dark">Erre most nincs találat.</p>
            <p className="mt-2 text-sm text-matcha-text/60">Próbálj rövidebb keresést, vagy válaszd a „Minden kérdés” témát.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setCategory("all")
              }}
              className="mt-5 text-sm font-bold text-matcha-accent underline decoration-matcha-accent/30 underline-offset-4 hover:text-matcha"
            >
              Szűrők törlése
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
