"use client"

import { useState } from "react"

const FLAVORS = [
  { id: "vanilias", label: "Vaníliás", emoji: "🍦" },
  { id: "oszibarackos", label: "Őszibarackos", emoji: "🍑" },
]

// Waitlist capture for the upcoming flavors — the emails land in the
// backend waitlist_signup table, so launch day starts with an audience.
const ComingSoon = () => {
  const [flavor, setFlavor] = useState(FLAVORS[0].id)
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
        body: JSON.stringify({ email, source: flavor }),
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
              Új ízek érkeznek
            </h2>
            <p className="text-matcha-text/70 max-w-md mx-auto mb-8">
              A vaníliás és az őszibarackos matcha már úton van. Iratkozz fel,
              és elsőként szólunk, amint kóstolható!
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
                <div className="flex gap-2" role="radiogroup" aria-label="Ízesítés">
                  {FLAVORS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      role="radio"
                      aria-checked={flavor === f.id}
                      onClick={() => setFlavor(f.id)}
                      className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${
                        flavor === f.id
                          ? "bg-matcha text-white border-matcha"
                          : "bg-white text-matcha-text border-matcha-kraft hover:border-matcha"
                      }`}
                    >
                      {f.emoji} {f.label}
                    </button>
                  ))}
                </div>
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
