import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FaqBrowser from "@modules/faq/components/faq-browser"
import { FAQS } from "@modules/home/components/faq/data"

export const metadata: Metadata = {
  title: "Gyakori kérdések | Momo Matcha",
  description:
    "Válaszok a matcha elkészítéséről, koffeintartalmáról, tárolásáról, valamint a Momo Matcha rendelésről és szállításról.",
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}

export default function GyikPage() {
  return (
    <div className="min-h-screen bg-matcha-cream text-matcha-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="relative overflow-hidden border-b border-matcha-kraft/40 bg-[radial-gradient(circle_at_15%_20%,rgba(244,116,139,0.16),transparent_28%),radial-gradient(circle_at_82%_60%,rgba(106,141,83,0.18),transparent_34%)]">
        <div className="pointer-events-none absolute right-[8%] top-14 h-20 w-20 rounded-full bg-strawberry/75 small:h-28 small:w-28" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 right-[-4rem] h-36 w-[32rem] rotate-[-2deg] rounded-[50%_50%_0_0] bg-matcha/15 small:right-[2%]" aria-hidden="true" />

        <div className="content-container relative py-20 small:py-28">
          <LocalizedClientLink href="/" className="text-sm font-semibold text-matcha-text/55 transition-colors hover:text-matcha">
            Főoldal <span aria-hidden="true">/</span> GYIK
          </LocalizedClientLink>
          <div className="mt-9 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-matcha">Segítünk eligazodni</p>
            <h1 className="mt-3 text-balance font-editorial text-5xl font-bold leading-[0.98] tracking-[-0.035em] text-matcha-dark small:text-7xl">
              Kérdésed van? Jó helyen jársz.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-matcha-text/68 small:text-lg">
              Elkészítés, ízek, tárolás vagy szállítás — keresd meg gyorsan a választ, és térj vissza nyugodtan a matcha-rituálédhoz.
            </p>
          </div>
        </div>
      </header>

      <main className="content-container py-16 small:py-24">
        <FaqBrowser />

        <section className="relative mt-20 overflow-hidden rounded-[2rem] bg-matcha-dark px-7 py-10 text-white small:flex small:items-center small:justify-between small:gap-10 small:px-12 small:py-12">
          <div className="relative z-10 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-vanilla">Nem találtad meg?</p>
            <h2 className="mt-2 font-editorial text-3xl font-bold small:text-4xl">Írj nekünk, valódi ember válaszol.</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">Általában egy munkanapon belül jelentkezünk.</p>
          </div>
          <a
            href="mailto:info@momomatcha.hu"
            className="relative z-10 mt-7 inline-flex rounded-full bg-strawberry px-7 py-3.5 text-sm font-bold text-matcha-dark transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-white active:translate-y-0 small:mt-0"
          >
            info@momomatcha.hu
          </a>
          <span className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full border-[3rem] border-white/5" aria-hidden="true" />
        </section>
      </main>
    </div>
  )
}
