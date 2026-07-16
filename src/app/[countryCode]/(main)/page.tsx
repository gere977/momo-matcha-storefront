import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import Features from "@modules/home/components/features"
import FlavorFinder from "@modules/home/components/flavor-finder"
import Story from "@modules/home/components/story"
import Reviews from "@modules/home/components/reviews"
import Recipes from "@modules/home/components/recipes"
import Faq from "@modules/home/components/faq"
import ComingSoon from "@modules/home/components/coming-soon"

// No FAQPage JSON-LD here: /gyik marks up the full FAQ set, and duplicating
// the same questions on two URLs risks Google ignoring both.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  return {
    title: "Momo Matcha | Négy íz, egy könnyű matcha-rutin",
    description:
      "Original és ízesített matchák 30 g-os fémdobozban. Találd meg a hozzád illő ízt, és készítsd el tisztán, lattéban vagy jéggel.",
    alternates: { canonical: "/hu" },
    robots: countryCode === "hu" ? undefined : { index: false, follow: true },
  }
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FlavorFinder />
      <Reviews />
      <Story />
      <Recipes />
      <ComingSoon />
      <Faq />
    </>
  )
}
