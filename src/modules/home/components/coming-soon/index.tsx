"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Waitlist capture for the upcoming peach flavor — the emails land in the
// backend waitlist_signup table, so launch day starts with an audience.
// (The vanilla flavor graduated from this section to a live product.)
const ComingSoon = () => {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  )
  const [message, setMessage] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState("sending")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "oszibarackos" }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message)
      setMessage(data?.message ?? "Szólunk, amint érkezik! 🍵")
      setState("done")
    } catch (err: any) {
      setMessage(err?.message || "Nem sikerült feliratkozni — próbáld újra.")
      setState("error")
    }
  }

  return (
    <section className="bg-matcha-bg pt-20 px-6">
      <div className="content-container">
        <div className="relative overflow-hidden rounded-large bg-white border border-matcha-kraft/40 px-6 py-12 small:px-14 text-center">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-vanilla/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-strawberry/25 blur-3xl" />

          <div className="relative">
            <span className="block text-xs font-bold tracking-[3px] text-matcha mb-2">
              HAMAROSAN
            </span>
            <h2 className="font-heading font-bold text-4xl small:text-5xl text-matcha-text mb-3">
              🍑 Az őszibarackos úton van
            </h2>
            <p className="text-matcha-text/70 max-w-md mx-auto mb-8">
              Iratkozz fel, és elsőként szólunk, amint kóstolható! A vaníliás
              már megérkezett —{" "}
              <LocalizedClientLink
                href="/products/vanilias-premium-momo-matcha"
                className="font-bold text-matcha-accent hover:underline"
              >
                kóstold meg itt
              </LocalizedClientLink>
              .
            </p>

            {state === "done" ? (
              <p className="font-semibold text-matcha-dark bg-matcha/10 inline-block rounded-full px-6 py-3">
                {message}
              </p>
            ) : (
              <form
                onSubmit={submit}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex w-full max-w-md flex-col small:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="E-mail címed"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-full border border-matcha-kraft/60 bg-white px-5 py-3.5 text-sm text-matcha-text placeholder:text-matcha-text/40 focus:outline-none focus:border-matcha"
                    aria-label="E-mail cím"
                  />
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="px-8 py-3.5 rounded-full bg-matcha-accent text-white font-bold uppercase tracking-wider text-sm hover:bg-matcha transition-colors disabled:opacity-60"
                  >
                    {state === "sending" ? "Küldés…" : "Értesíts!"}
                  </button>
                </div>
                {state === "error" && (
                  <p className="text-sm text-red-600">{message}</p>
                )}
                <p className="text-xs text-matcha-text/40 max-w-sm">
                  Csak az új ízek érkezéséről küldünk e-mailt — se spam, se
                  hírlevél-áradat.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComingSoon
