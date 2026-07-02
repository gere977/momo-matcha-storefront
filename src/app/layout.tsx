import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Nunito, Quicksand } from "next/font/google"
import GsapScrollEffects from "@modules/common/components/gsap-scroll-effects"
import "styles/globals.css"

// Rounded, friendly genZ display font for headings + the wordmark. Nunito has
// complete, well-tested Hungarian coverage, so the double-acutes (ő, ű) render
// correctly — unlike Fredoka / Baloo 2, whose ő fell back to a mismatched glyph.
const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
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
