"use client"

import { useState } from "react"
import { HOME_FAQS } from "./data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-matcha-bg pt-20 pb-4 px-6">
      <div className="content-container">
        <div className="text-center mb-12">
          <span className="block text-xs font-bold tracking-[3px] text-matcha mb-2">GYIK</span>
          <h2 className="font-heading font-bold text-4xl small:text-5xl text-matcha-text">
            Amit tudni érdemes
          </h2>
        </div>

        <div className="max-w-2xl mx-auto flex flex-col bg-matcha-cream rounded-large border border-matcha-kraft/50 px-6 sm:px-8">
          {HOME_FAQS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.q} className="border-b border-matcha-kraft/40">
                <button
                  className={`w-full flex items-center justify-between gap-4 py-5 text-left font-semibold transition-colors ${
                    isOpen ? "text-matcha" : "text-matcha-text hover:text-matcha"
                  }`}
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {item.q}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-matcha" : "text-matcha-kraft"
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out-quart ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <p className="min-h-0 text-sm text-matcha-text/70 leading-relaxed pb-6">
                    {item.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-8 text-center">
          <LocalizedClientLink
            href="/gyik"
            className="inline-flex items-center gap-2 text-sm font-bold text-matcha-accent hover:text-matcha transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha focus-visible:ring-offset-4"
          >
            Minden kérdés és válasz <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Faq
