import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Caveat, Quicksand } from "next/font/google"
import GsapScrollEffects from "@modules/common/components/gsap-scroll-effects"
import "styles/globals.css"

const caveat = Caveat({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-heading",
  display: "swap",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Momo Matcha | Találd meg a rituálédat",
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="hu" data-mode="light" className={`${caveat.variable} ${quicksand.variable}`}>
      <body>
        <GsapScrollEffects />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
