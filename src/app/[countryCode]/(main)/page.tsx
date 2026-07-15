import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import Features from "@modules/home/components/features"
import Story from "@modules/home/components/story"
import Reviews from "@modules/home/components/reviews"
import Recipes from "@modules/home/components/recipes"
import Faq from "@modules/home/components/faq"
import ComingSoon from "@modules/home/components/coming-soon"
import { HOME_FAQS } from "@modules/home/components/faq/data"

// FAQPage structured data for rich results, built from the same copy the
// accordion renders.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export const metadata: Metadata = {
  title: "Momo Matcha | Találd meg a rituálédat",
  description:
    "Prémium, bio szertartásos matcha Ujiból, Japánból. Klasszikus és ízesített matchák, gyors szállítással.",
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <Features />
      <Story />
      <ComingSoon />
      <Reviews />
      <Recipes />
      <Faq />
    </>
  )
}
