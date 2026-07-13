import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Nunito, Quicksand } from "next/font/google"
import GsapScrollEffects from "@modules/common/components/gsap-scroll-effects"
import AnalyticsTracker from "@modules/common/components/analytics-tracker"
import { Analytics } from "@vercel/analytics/next"
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
  verification: {
    google: "pdOdBZAicMDNQqsQs_FWuVNKuqFOV5rRMeZzNzKLm20",
  },
}

// Organization entity signal for search + AI knowledge graphs. Social
// profiles go into NEXT_PUBLIC_SOCIAL_LINKS (comma-separated URLs) once the
// brand accounts exist — no code change needed.
const socialLinks = (process.env.NEXT_PUBLIC_SOCIAL_LINKS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Momo Matcha",
  url: getBaseURL(),
  logo: `${getBaseURL()}/images/logo.jpg`,
  description:
    "Prémium, bio ceremonial matcha Ujiból, Japánból — klasszikus és ízesített matchák magyar webshopja.",
  email: "info@momomatcha.hu",
  ...(socialLinks.length ? { sameAs: socialLinks } : {}),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="hu" data-mode="light" className={`${nunito.variable} ${quicksand.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <GsapScrollEffects />
        <AnalyticsTracker />
        {/* Vercel Web Analytics — cookieless page views + Web Vitals,
            complements the first-party analytics-lite tracker. */}
        <Analytics />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
