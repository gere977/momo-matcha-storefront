import { Metadata } from "next"
import { notFound } from "next/navigation"

import { contentPages } from "@lib/content/pages"

type Params = Promise<{ countryCode: string; slug: string }>

export async function generateMetadata(props: {
  params: Params
}): Promise<Metadata> {
  const { countryCode, slug } = await props.params
  const page = contentPages[slug]

  if (!page) {
    return { title: "Momo Matcha" }
  }

  return {
    title: `${page.title} | Momo Matcha`,
    description: page.subtitle ?? page.title,
    alternates: {
      canonical: `/hu/pages/${slug}`,
    },
    robots:
      countryCode === "hu"
        ? undefined
        : { index: false, follow: true },
  }
}

export default async function ContentPageRoute(props: { params: Params }) {
  const { slug } = await props.params
  const page = contentPages[slug]

  if (!page) {
    notFound()
  }

  return (
    <div className="bg-matcha-cream">
      <div className="content-container py-20 small:py-28">
        <div className="max-w-[800px] mx-auto">
          <header className="mb-12 border-b border-matcha-kraft/60 pb-8">
            <h1 className="font-heading text-5xl small:text-6xl leading-none text-matcha-accent">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="mt-3 text-lg text-matcha-text/70">{page.subtitle}</p>
            )}
            {page.updated && (
              <p className="mt-2 text-sm text-matcha-text/50">{page.updated}</p>
            )}
          </header>

          <article className="flex flex-col">
            {page.blocks.map((block, i) => {
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

              // paragraph — trusted, authored inline HTML (see lib/content/pages.ts)
              return (
                <p
                  key={i}
                  className="mb-3 leading-[1.8] text-matcha-text/80 [&_strong]:text-matcha-text [&_a]:text-matcha-accent [&_a]:underline [&_a:hover]:text-matcha"
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
              )
            })}
          </article>
        </div>
      </div>
    </div>
  )
}
