"use client"

import { useState } from "react"

const FAQS = [
  {
    q: "Mi az a ceremonial grade matcha?",
    a: "A ceremonial grade matcha a legmagasabb minőségű matcha, amelyet az árnyékban nevelt teabokor legfiatalabb leveleiből készítenek, az aratás előtt 3–4 hétig takarva. Kőmalommal őrlik finom porrá, és hagyományosan csak vízzel készítik — tej és cukor nélkül. Természetesen édes, umami-gazdag ízű, keserűség nélkül.",
  },
  {
    q: "Mi a különbség a ceremonial és a latte grade között?",
    a: "A ceremonial grade-et legjobb tisztán, vízzel fogyasztani — finom és komplex ízvilágú. A latte grade kissé karakteresebb, tejjel és édesítőszerekkel is jól érvényesül. Mindkettő minőségi forrásból származik; a különbség a levélválogatásban és a felhasználási célban van.",
  },
  {
    q: "Mennyi koffeint tartalmaz a matcha?",
    a: "Egy adag matcha (1–2g) kb. 35–70mg koffeint tartalmaz — nagyjából fele egy kávénak. De a matchában van L-teanin is, egy aminosav, amely lelassítja a koffein felszívódását és nyugodt fókuszt biztosít. Nincs remegés, nincs összeomlás — csak egyenletes, tiszta energia 4–6 órán át.",
  },
  {
    q: "Honnan származik a Momo Matcha?",
    a: "Matchánk közvetlenül Uji, Japán ősi teakertjeiből érkezik — a japán matcha kultúra szülőhelyéről, ahol 800 éve termesztenek teát. Uji éghajlata, talaja és árnyékolási hagyományai a világ legjobb matcháit teremtik.",
  },
  {
    q: "Hogyan tároljam a matchát?",
    a: "A matchát zárt tartályban, fénytől, hőtől és nedvességtől távol tárold. Felbontás után hűtőben tárold és 4–6 héten belül használd fel a legjobb íz érdekében. Soha ne tárold erős illatú ételek közelében — a matcha könnyen veszi fel az illatokat.",
  },
]

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
          {FAQS.map((item, i) => {
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
                  className={`grid overflow-hidden transition-all duration-300 ${
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
      </div>
    </section>
  )
}

export default Faq
