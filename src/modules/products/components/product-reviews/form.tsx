"use client"

import { useState } from "react"

// Review submission form. Successful submissions go to moderation —
// they appear on the site after admin approval (admin "Vélemények" page).
export default function ReviewForm({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, name, email, rating, text }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message || "Nem sikerült elküldeni.")
      }
      setDone(true)
    } catch (err: any) {
      setError(err?.message ?? "Nem sikerült elküldeni.")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-matcha/10 p-6 text-matcha-dark font-semibold">
        Köszönjük a véleményed! 🍵 Jóváhagyás után megjelenik az oldalon.
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-block px-8 py-3.5 rounded-full bg-matcha text-white font-bold uppercase tracking-wider text-sm hover:bg-matcha-dark transition-colors"
      >
        Vélemény írása
      </button>
    )
  }

  const inputCls =
    "w-full rounded-xl border border-matcha-kraft/60 bg-white px-4 py-3 text-sm text-matcha-text placeholder:text-matcha-text/40 focus:outline-none focus:border-matcha"

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl border border-matcha-kraft/40 p-6 flex flex-col gap-4 max-w-xl"
    >
      <div>
        <label className="block text-sm font-bold text-matcha-text mb-1.5">
          Értékelésed
        </label>
        <div className="flex gap-1" role="radiogroup" aria-label="Csillagok">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} csillag`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(null)}
              className="text-2xl leading-none"
              style={{
                color: n <= (hovered ?? rating) ? "#E23B2E" : "#E5DCC9",
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
        <input
          className={inputCls}
          placeholder="Neved *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
        />
        <input
          className={inputCls}
          type="email"
          placeholder="E-mail címed * (nem jelenik meg)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <textarea
        className={inputCls}
        placeholder="Hogy ízlett? Mit érdemes tudni róla? *"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        minLength={10}
        maxLength={1000}
        rows={4}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3.5 rounded-full bg-matcha-accent text-white font-bold uppercase tracking-wider text-sm hover:bg-matcha transition-colors disabled:opacity-60"
        >
          {submitting ? "Küldés…" : "Vélemény elküldése"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-matcha-text/60 underline"
        >
          Mégse
        </button>
      </div>
    </form>
  )
}
