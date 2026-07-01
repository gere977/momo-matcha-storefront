import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Hiba történt",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">Az oldal nem található</h1>
      <p className="text-small-regular text-ui-fg-base">
        A keresett kosár nem létezik. Töröld a sütiket, és próbáld újra.
      </p>
      <InteractiveLink href="/">Vissza a főoldalra</InteractiveLink>
    </div>
  )
}
