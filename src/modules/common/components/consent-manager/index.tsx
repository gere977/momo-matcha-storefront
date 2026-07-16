"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export const CONSENT_STORAGE_KEY = "momo_consent_v1"
export const CONSENT_EVENT = "momo:consent"
export const OPEN_CONSENT_EVENT = "momo:open-consent"
export const ANALYTICS_READY_EVENT = "momo:analytics-ready"

type ConsentChoice = "all" | "necessary"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
    _fbq?: unknown
  }
}

function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === "all" || value === "necessary" ? value : null
  } catch {
    return null
  }
}

function persistConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice)
    document.cookie = `momo_consent=${choice}; Max-Age=15552000; Path=/; SameSite=Lax; Secure`
  } catch {
    // The banner still closes when storage is unavailable. No optional tag is
    // loaded unless the in-memory choice is explicitly "all".
  }
  if (choice === "necessary" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }))
}

export default function ConsentManager() {
  const pathname = usePathname()
  const [choice, setChoice] = useState<ConsentChoice | null>(null)
  const [ready, setReady] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const [metaReady, setMetaReady] = useState(false)
  const googlePageTracked = useRef<string | null>(null)
  const metaPageTracked = useRef<string | null>(null)

  const googleId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const optionalTagsEnabled = choice === "all"

  useEffect(() => {
    setChoice(readConsent())
    setReady(true)

    const reopen = () => setChoice(null)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  useEffect(() => {
    if (!optionalTagsEnabled || !pathname) return

    if (
      googleId &&
      googleReady &&
      window.gtag &&
      googlePageTracked.current !== pathname
    ) {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
      })
      googlePageTracked.current = pathname
    }
    if (
      metaPixelId &&
      metaReady &&
      window.fbq &&
      metaPageTracked.current !== pathname
    ) {
      window.fbq("track", "PageView")
      metaPageTracked.current = pathname
    }
  }, [googleId, googleReady, metaPixelId, metaReady, optionalTagsEnabled, pathname])

  const markGoogleReady = () => {
    setGoogleReady(true)
    window.dispatchEvent(new Event(ANALYTICS_READY_EVENT))
  }

  const markMetaReady = () => {
    setMetaReady(true)
    window.dispatchEvent(new Event(ANALYTICS_READY_EVENT))
  }

  const choose = (nextChoice: ConsentChoice) => {
    if (nextChoice === "all") {
      googlePageTracked.current = null
      metaPageTracked.current = null
    }
    persistConsent(nextChoice)
    setChoice(nextChoice)
  }

  return (
    <>
      {optionalTagsEnabled && googleId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleId}`}
            strategy="afterInteractive"
          />
          <Script
            id="momo-ga4"
            strategy="afterInteractive"
            onReady={markGoogleReady}
          >
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function(){dataLayer.push(arguments);};
              gtag('js', new Date());
              gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
              gtag('config', '${googleId}', { send_page_view: false });
            `}
          </Script>
        </>
      )}

      {optionalTagsEnabled && metaPixelId && (
        <Script
          id="momo-meta-pixel"
          strategy="afterInteractive"
          onReady={markMetaReady}
        >
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
          `}
        </Script>
      )}

      {/* Even cookieless audience measurement follows the promise made by the
          banner: optional analytics starts only after explicit consent. */}
      {optionalTagsEnabled && <Analytics />}

      {ready && choice === null && (
        <section
          role="dialog"
          aria-label="Süti beállítások"
          aria-live="polite"
          className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl rounded-[1.5rem] border border-matcha-kraft/70 bg-matcha-cream/95 p-5 shadow-[0_18px_60px_rgba(35,76,56,0.2)] backdrop-blur-md small:inset-x-6 small:flex small:items-center small:gap-6 small:p-6"
        >
          <div className="min-w-0 flex-1">
            <p className="font-heading text-xl font-bold text-matcha-dark">
              Te döntöd el, mit mérhetünk
            </p>
            <p className="mt-1 text-sm leading-relaxed text-matcha-text/75">
              A szükséges sütik tartják meg a kosarad. Analitikát és hirdetési
              mérést csak akkor kapcsolunk be, ha engedélyezed. {" "}
              <LocalizedClientLink
                href="/pages/adatkezeles"
                className="font-semibold text-matcha-dark underline underline-offset-2"
              >
                Részletek
              </LocalizedClientLink>
            </p>
          </div>
          <div className="mt-4 flex shrink-0 flex-col gap-2 xsmall:flex-row small:mt-0">
            <button
              type="button"
              onClick={() => choose("necessary")}
              className="min-h-11 rounded-full border border-matcha-dark px-5 text-sm font-bold text-matcha-dark transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha-dark active:scale-[0.98]"
            >
              Csak szükséges
            </button>
            <button
              type="button"
              onClick={() => choose("all")}
              className="min-h-11 rounded-full bg-matcha-accent px-5 text-sm font-bold text-white transition hover:bg-matcha-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha-dark active:scale-[0.98]"
            >
              Engedélyezem
            </button>
          </div>
        </section>
      )}
    </>
  )
}
