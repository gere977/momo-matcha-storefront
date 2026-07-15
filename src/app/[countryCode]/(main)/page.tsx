import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Features from "@modules/home/components/features"
import Story from "@modules/home/components/story"
import Reviews from "@modules/home/components/reviews"
import Recipes from "@modules/home/components/recipes"
import Faq from "@modules/home/components/faq"
import ComingSoon from "@modules/home/components/coming-soon"
import { FAQS } from "@modules/home/components/faq/data"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

// FAQPage structured data for rich results — built from the same copy the
// accordion renders.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export const metadata: Metadata = {
  title: "Momo Matcha | Találd meg a rituálédat",
  description:
    "Prémium, bio szertartásos matcha Ujiból, Japánból. Klasszikus és ízesített matchák, gyors szállítással — rituálék a lassú élethez.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <ul className="flex flex-col gap-x-6">
        <FeaturedProducts collections={collections} region={region} />
      </ul>
      <Features />
      <Story />
      <ComingSoon />
      <Reviews />
      <Recipes />
      <Faq />
    </>
  )
}
