const Star = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E23B2E" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const REVIEWS = [
  {
    text: '„Sok matchát próbáltam már, de ez messze a legsimább. Egyáltalán nem keserű — mély, gazdag umami íz. Teljesen megérte."',
    name: "Szabó Anna",
    product: "Ceremonial Matcha",
    initial: "S",
  },
  {
    text: '„Átálltam kávéról matcha latte-ra minden reggel. Az energia teljesen más — fókuszált és nyugodt, délutáni összeomlás nélkül. A szállítás is gyors volt."',
    name: "Kiss Péter",
    product: "Matcha Latte Grade",
    initial: "K",
  },
  {
    text: '„Gyönyörű csomagolás, hihetetlen minőség. Tényleg érezni a különbséget a szupermarketes matchához képest. Biztosan rendelek újra."',
    name: "Nagy Eszter",
    product: "Ceremonial Matcha",
    initial: "N",
  },
]

const Reviews = () => {
  return (
    <section className="bg-matcha-bg pt-20 px-6">
      <div className="content-container">
        <div className="flex flex-wrap items-center gap-12 mb-12">
          <div className="flex items-center gap-4">
            <span className="font-heading text-7xl text-matcha-accent leading-none">4.9</span>
            <div>
              <div className="flex gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="text-xs text-matcha-text/50 font-semibold">40+ vélemény alapján</p>
            </div>
          </div>
          <div className="flex-1">
            <span className="block text-xs font-bold tracking-[3px] text-matcha mb-2">
              VÉLEMÉNYEK
            </span>
            <h2 className="font-heading text-4xl small:text-5xl text-matcha-text leading-tight">
              Mit mondanak vásárlóink
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-2xl p-7 border border-matcha-kraft/30 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="text-sm text-matcha-text/80 italic leading-relaxed flex-1">
                {r.text}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-matcha-kraft/30">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-heading text-lg bg-gradient-to-br from-matcha to-matcha-dark">
                  {r.initial}
                </div>
                <div>
                  <p className="font-bold text-sm text-matcha-text">{r.name}</p>
                  <p className="text-xs text-matcha-text/40">{r.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews
