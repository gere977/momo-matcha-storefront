import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import Features from "@modules/home/components/features"
import Story from "@modules/home/components/story"
import Reviews from "@modules/home/components/reviews"
import Recipes from "@modules/home/components/recipes"
import Faq from "@modules/home/components/faq"
import ComingSoon from "@modules/home/components/coming-soon"

// No FAQPage JSON-LD here: /gyik marks up the full FAQ set, and duplicating
// the same questions on two URLs risks Google ignoring both.

export const metadata: Metadata = {
  title: "Momo Matcha | Találd meg a rituálédat",
  description:
    "Prémium, bio szertartásos matcha Ujiból, Japánból. Klasszikus és ízesített matchák, gyors szállítással.",
}

export default function Home() {
  return (
    <>
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
