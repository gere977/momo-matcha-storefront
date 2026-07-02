import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Fredoka, Quicksand } from "next/font/google"
import GsapScrollEffects from "@modules/common/components/gsap-scroll-effects"
import "styles/globals.css"

// Chunky, rounded, friendly genZ display font for headings + the wordmark.
const fredoka = Fredoka({
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
