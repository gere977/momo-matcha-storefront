import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { articles } from "@lib/content/articles"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  return {
    title: "Matcha tudástár | Momo Matcha",
    description:
      "Útmutatók és tudnivalók a matcháról: elkészítés, koffein, minőség, receptek — a Momo Matcha tudástára.",
    alternates: { canonical: "/hu/tudastar" },
    robots: countryCode === "hu" ? undefined : { index: false, follow: true },
  }
}

// The content hub listing. Articles live in lib/content/articles.ts.
export default function TudastarPage() {
  const entries = Object.entries(articles)

  return (
    <div className="bg-matcha-cream">
      <div className="content-container py-20 small:py-28">
        <header className="mb-12 text-center">
          <span className="block text-xs font-bold tracking-[3px] text-matcha mb-2">
            TUDÁSTÁR
          </span>
          <h1 className="font-heading font-bold text-5xl small:text-6xl text-matcha-accent leading-none">
            Minden a matcháról
          </h1>
          <p className="mt-4 text-lg text-matcha-text/70 max-w-xl mx-auto">
            Elkészítés, tudnivalók és receptek — hogy a matchád tényleg olyan
            legyen, amilyennek lennie kell.
          </p>
        </header>

        <div className="grid grid-cols-1 small:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {entries.map(([slug, article]) => (
            <LocalizedClientLink
              key={slug}
              href={`/tudastar/${slug}`}
              className="group bg-white rounded-2xl border border-matcha-kraft/40 p-8 flex flex-col gap-3 hover:shadow-xl hover:shadow-matcha-dark/10 hover:-translate-y-1 hover:border-matcha transition-[transform,box-shadow,border-color] duration-200 ease-out-quart"
            >
              <span className="text-[11px] font-bold uppercase tracking-[2px] text-matcha">
                {article.category}
              </span>
              <h2 className="font-heading font-bold text-2xl text-matcha-text leading-snug group-hover:text-matcha-accent transition-colors">
                {article.title}
              </h2>
              <p className="text-sm text-matcha-text/70 leading-relaxed flex-1">
                {article.description}
              </p>
              <span className="text-sm font-bold text-matcha-accent">
                Elolvasom →
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </div>
  )
}
