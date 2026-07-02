import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Baloo_2, Quicksand } from "next/font/google"
import GsapScrollEffects from "@modules/common/components/gsap-scroll-effects"
import "styles/globals.css"

// Chunky, rounded, friendly genZ display font for headings + the wordmark.
// Baloo 2 has strong latin-ext coverage, so Hungarian double-acutes (ő, ű)
// render properly instead of looking out of place.
const baloo = Baloo_2({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
})

const quicksand = Quicksand({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Momo Matcha | Találd meg a rituálédat",
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="hu" data-mode="light" className={`${fredoka.variable} ${quicksand.variable}`}>
      <body>
        <GsapScrollEffects />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
