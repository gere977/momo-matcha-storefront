import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404 — Az oldal nem található",
  description: "A keresett oldal nem létezik.",
}

// Branded 404: a lost visitor should land on a path back to the products,
// not a dead end. Plain <Link> because this route lives outside the
// [countryCode] segment — the middleware adds the locale on click.
export default function NotFound() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center bg-matcha-bg">
      <span className="text-6xl" aria-hidden>
        🍵
      </span>
      <h1 className="font-heading font-bold text-4xl small:text-5xl text-matcha-dark">
        Ez az oldal nem található
      </h1>
      <p className="text-matcha-text/70 max-w-md">
        A keresett oldal nem létezik vagy elköltözött. A matcha viszont itt
        van — nézz körül a termékeink között!
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-5">
        <Link
          href="/store"
          className="inline-block px-8 py-3.5 rounded-full bg-matcha-accent text-white font-bold uppercase tracking-wider text-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-transform duration-200 ease-out-quart shadow-lg shadow-matcha-accent/25"
        >
          Termékek böngészése
        </Link>
        <Link
          href="/"
          className="font-semibold text-matcha-dark hover:text-matcha-accent transition-colors"
        >
          Vissza a főoldalra
        </Link>
      </div>
    </div>
  )
}
