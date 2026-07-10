import { Metadata } from "next"
import { notFound } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { articles } from "@lib/content/articles"

type Params = Promise<{ countryCode: string; slug: string }>

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://momomatcha.hu"

// Rendered on demand (same as the /tudastar hub). A generateStaticParams
// that only returned `slug` without `countryCode` made production render
// 500 — don't partially prerender under the country segment.

export async function generateMetadata(props: {
  params: Params
}): Promise<Metadata> {
  const { slug, countryCode } = await props.params
  const article = articles[slug]

  if (!article) {
    return { title: "Momo Matcha" }
  }

  return {
    title: `${article.title} | Momo Matcha`,
    description: article.description,
    alternates: { canonical: `/${countryCode}/tudastar/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
    },
  }
}

// Article (or HowTo) + BreadcrumbList JSON-LD, per the AEO plan: dates and
// publisher in schema, question-form headings + direct answers in the body.
function buildJsonLd(slug: string, countryCode: string) {
  const article = articles[slug]
  const url = `${BASE_URL}/${countryCode}/tudastar/${slug}`

  const publisher = {
    "@type": "Organization",
    name: "Momo Matcha",
    url: BASE_URL,
    logo: { "@type": "ImageObject", url: `${BASE_URL}/images/logo.jpg` },
  }

  const main =
    article.schemaType === "HowTo"
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: article.title,
          description: article.description,
          datePublished: article.datePublished,
          dateModified: article.dateModified,
          inLanguage: "hu",
          step: (article.howToSteps ?? []).map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
          publisher,
        }
      : {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.datePublished,
          dateModified: article.dateModified,
          inLanguage: "hu",
          author: publisher,
          publisher,
          mainEntityOfPage: url,
        }

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Főoldal", item: `${BASE_URL}/${countryCode}` },
      { "@type": "ListItem", position: 2, name: "Tudástár", item: `${BASE_URL}/${countryCode}/tudastar` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  }

  return [main, breadcrumbs]
}

export default async function ArticlePage(props: { params: Params }) {
  const { slug, countryCode } = await props.params
  const article = articles[slug]

  if (!article) {
    notFound()
  }

  const formattedDate = new Date(article.dateModified).toLocaleDateString(
    "hu-HU",
    { year: "numeric", month: "long", day: "numeric" }
  )

  return (
    <div className="bg-matcha-cream">
      {buildJsonLd(slug, countryCode).map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
      <div className="content-container py-20 small:py-28">
        <div className="max-w-[800px] mx-auto">
          <nav className="mb-6 text-sm text-matcha-text/50" aria-label="Breadcrumb">
            <LocalizedClientLink href="/tudastar" className="hover:text-matcha">
              Tudástár
            </LocalizedClientLink>{" "}
            / <span>{article.category}</span>
          </nav>

          <header className="mb-12 border-b border-matcha-kraft/60 pb-8">
            <h1 className="font-heading text-5xl small:text-6xl leading-none text-matcha-accent">
              {article.title}
            </h1>
            <p className="mt-3 text-lg text-matcha-text/70">
              {article.description}
            </p>
            <p className="mt-2 text-sm text-matcha-text/50">
              Momo Matcha · frissítve: {formattedDate}
            </p>
          </header>

          <article className="flex flex-col">
            {article.blocks.map((block, i) => {
              if (block.type === "heading") {
                return (
                  <h2
                    key={i}
                    className="font-heading text-2xl text-matcha-dark mt-10 mb-3 first:mt-0"
                  >
                    {block.text}
                  </h2>
                )
              }

              if (block.type === "list") {
                return (
                  <ul
                    key={i}
                    className="list-disc pl-6 mb-4 text-matcha-text/80 leading-relaxed marker:text-matcha"
                  >
                    {block.items.map((item, j) => (
                      <li key={j} className="mb-1.5">
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              }

              // paragraph — trusted, authored inline HTML (lib/content/articles.ts)
              return (
                <p
                  key={i}
                  className="mb-3 leading-[1.8] text-matcha-text/80 [&_strong]:text-matcha-text [&_a]:text-matcha-accent [&_a]:underline [&_a:hover]:text-matcha"
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
              )
            })}
          </article>

          <div className="mt-12 rounded-2xl bg-matcha/10 p-6 text-center">
            <p className="font-heading font-bold text-xl text-matcha-dark mb-3">
              Kóstolnád is, nem csak olvasnál róla? 🍵
            </p>
            <LocalizedClientLink
              href="/store"
              className="inline-block px-8 py-3.5 rounded-full bg-matcha-accent text-white font-bold uppercase tracking-wider text-sm hover:bg-matcha transition-colors"
            >
              Irány a bolt
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
