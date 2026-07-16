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
    <section className="bg-matcha-bg px-6 py-16 small:py-20">
      <div className="content-container">
        <div className="relative grid items-center gap-6 overflow-hidden rounded-[1.75rem] border border-[#e8c9b3] bg-[#f8e7dc] px-6 py-7 small:grid-cols-[auto_0.9fr_1.1fr] small:gap-8 small:px-9 small:py-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-strawberry/20 blur-3xl" />
          <div
            aria-hidden="true"
            className="relative mx-auto flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#f29a78] shadow-[inset_-10px_-10px_0_rgba(207,102,79,0.16)] small:mx-0"
          >
            <span className="absolute -top-2 right-3 h-7 w-4 -rotate-45 rounded-full bg-matcha" />
            <span className="font-heading text-3xl font-bold text-white">
              M
            </span>
          </div>

          <div className="relative text-center small:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-matcha">
              Következő íz
            </span>
            <h2 className="mt-2 font-heading text-2xl font-bold leading-tight text-matcha-dark small:text-3xl">
              Az őszibarackos még készül.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-matcha-text/60">
              Szólunk, amikor kóstolható. Addig a vaníliás már itt van —{" "}
              <LocalizedClientLink
                href="/products/vanilias-premium-momo-matcha"
                className="font-bold text-matcha-accent hover:underline"
              >
                kóstold meg itt
              </LocalizedClientLink>
              .
            </p>
          </div>

          <div className="relative">
            {state === "done" ? (
              <p className="rounded-2xl bg-white/65 px-5 py-4 text-center text-sm font-semibold text-matcha-dark">
                {message}
              </p>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-2.5">
                <div className="flex w-full flex-col gap-2 medium:flex-row">
                  <input
                    type="email"
                    required
                    placeholder="E-mail címed"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-1 rounded-full border border-[#dfbca5] bg-white/80 px-5 py-3 text-sm text-matcha-text placeholder:text-matcha-text/40 focus:border-matcha focus:outline-none focus:ring-4 focus:ring-matcha/10"
                    aria-label="E-mail cím"
                  />
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="shrink-0 rounded-full bg-matcha-accent px-7 py-3 text-sm font-bold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-matcha active:scale-[0.98] disabled:opacity-60"
                  >
                    {state === "sending" ? "Küldés…" : "Kérek egy jelzést"}
                  </button>
                </div>
                {state === "error" && (
                  <p className="text-sm text-red-600">{message}</p>
                )}
                <p className="text-[11px] leading-relaxed text-matcha-text/45">
                  Csak az új íz érkezéséről írunk. Bármikor leiratkozhatsz.
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
