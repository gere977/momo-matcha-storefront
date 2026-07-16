"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Footer newsletter capture — signups land in the backend waitlist table
// with source "newsletter" (exportable from the admin Feliratkozók page).
const NewsletterSignup = () => {
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
        body: JSON.stringify({ email, source: "newsletter" }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message)
      setMessage("Köszönjük! Hamarosan jelentkezünk. 🍵")
      setState("done")
    } catch (err: any) {
      setMessage(err?.message || "Nem sikerült feliratkozni — próbáld újra.")
      setState("error")
    }
  }

  if (state === "done") {
    return (
      <p className="text-sm font-semibold text-matcha-dark">{message}</p>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <span className="txt-small-plus text-matcha-text">Hírlevél</span>
      <p className="text-xs text-matcha-text/60">
        Receptek, tippek és kedvezmények — elsőként. Se spam.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="E-mail címed"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-w-0 rounded-full border border-matcha-kraft/60 bg-white px-4 py-2 text-sm text-matcha-text placeholder:text-matcha-text/40 focus:outline-none focus:border-matcha"
          aria-label="E-mail cím a hírlevélhez"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="px-5 py-2 rounded-full bg-matcha text-white font-bold text-xs uppercase tracking-wider hover:bg-matcha-dark transition-colors disabled:opacity-60"
        >
          {state === "sending" ? "…" : "Feliratkozom"}
        </button>
      </div>
      <p className="text-[11px] leading-relaxed text-matcha-text/55">
        A Feliratkozom gombbal kéred a Momo leveleket. Bármikor egy kattintással
        leiratkozhatsz. Részletek az{" "}
        <LocalizedClientLink
          href="/pages/adatkezeles"
          className="underline underline-offset-2 hover:text-matcha-dark"
        >
          adatkezelési tájékoztatóban
        </LocalizedClientLink>
        .
      </p>
      {state === "error" && (
        <p className="text-xs text-red-600">{message}</p>
      )}
    </form>
  )
}

export default NewsletterSignup
