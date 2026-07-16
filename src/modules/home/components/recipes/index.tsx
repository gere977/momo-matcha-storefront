import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const QUICK_RECIPES = [
  {
    title: "Jeges epres latte",
    note: "Matchaalap, sok jég és a kedvenc tejed.",
    time: "5 perc",
    image: "/images/products/momo-strawberry-splash.jpg",
    alt: "Epres Momo Matcha doboz rózsaszín splash háttérrel",
  },
  {
    title: "Krémes csokis latte",
    note: "Melegen, habos tejjel egy puhább reggelhez.",
    time: "5 perc",
    image: "/images/products/momo-chocolate-splash.jpg",
    alt: "Csokoládés Momo Matcha doboz kakaós splash háttérrel",
  },
] as const

const Recipes = () => {
  return (
    <section id="recipes" className="bg-[#fffaf0] px-6 py-20 small:py-28">
      <div className="content-container">
        <div className="mb-10 flex flex-col items-start justify-between gap-5 small:flex-row small:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-matcha">
              Kortyról kortyra
            </span>
            <h2 className="mt-3 text-balance font-heading text-4xl font-bold leading-none text-matcha-dark small:text-6xl">
              Készítsd úgy, ahogy jólesik.
            </h2>
          </div>
          <LocalizedClientLink
            href="/tudastar"
            className="group inline-flex items-center gap-2 text-sm font-bold text-matcha-dark underline decoration-matcha-accent/50 decoration-2 underline-offset-8 hover:text-matcha-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha"
          >
            Minden útmutató
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </LocalizedClientLink>
        </div>

        <div className="grid gap-5 small:grid-cols-[1.15fr_0.85fr]">
          <article className="group overflow-hidden rounded-[2rem] bg-matcha-dark text-white">
            <LocalizedClientLink
              href="/tudastar/matcha-keszites"
              className="grid h-full small:grid-rows-[minmax(18rem,1fr)_auto] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-vanilla"
            >
              <div className="relative min-h-[18rem] overflow-hidden">
                <Image
                  src="/images/products/momo-original-splash-card.jpg"
                  alt="Original Momo Matcha doboz zöld splash háttérrel"
                  fill
                  sizes="(max-width: 767px) 100vw, 58vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matcha-dark/45 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-[#fffaf0]/90 px-4 py-2 text-xs font-bold text-matcha-dark backdrop-blur-sm">
                  3 perc · kezdőbarát
                </span>
              </div>

              <div className="grid gap-6 p-7 small:grid-cols-[0.9fr_1.1fr] small:p-9">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-vanilla">
                    Az alap
                  </span>
                  <h3 className="mt-2 font-heading text-3xl font-bold leading-tight small:text-4xl">
                    A kétperces klasszikus
                  </h3>
                </div>
                <ol className="grid gap-2 text-sm leading-relaxed text-white/72">
                  <li>
                    <strong className="mr-2 text-white">01</strong> Szitálj 1–2
                    g matchát a tálba.
                  </li>
                  <li>
                    <strong className="mr-2 text-white">02</strong> Adj hozzá
                    70–80 ml, 75–80 °C-os vizet.
                  </li>
                  <li>
                    <strong className="mr-2 text-white">03</strong> Habosítsd
                    gyors W mozdulatokkal.
                  </li>
                </ol>
              </div>
            </LocalizedClientLink>
          </article>

          <div className="grid gap-5">
            {QUICK_RECIPES.map((recipe) => (
              <article
                key={recipe.title}
                className="group overflow-hidden rounded-[1.6rem] bg-white shadow-[0_18px_45px_rgba(68,83,62,0.08)]"
              >
                <LocalizedClientLink
                  href="/tudastar/matcha-keszites"
                  className="grid min-h-[14rem] grid-cols-[0.92fr_1.08fr] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-matcha/30"
                >
                  <div className="relative min-h-[14rem] overflow-hidden">
                    <Image
                      src={recipe.image}
                      alt={recipe.alt}
                      fill
                      sizes="(max-width: 767px) 46vw, 20vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-5 small:p-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-matcha">
                      {recipe.time}
                    </span>
                    <div>
                      <h3 className="text-balance font-heading text-2xl font-bold leading-tight text-matcha-dark">
                        {recipe.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-matcha-text/55">
                        {recipe.note}
                      </p>
                    </div>
                    <span className="mt-4 text-sm font-bold text-matcha-accent">
                      Mutasd <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </LocalizedClientLink>
              </article>
            ))}
          </div>
        </div>

        <LocalizedClientLink
          href="/tudastar/matcha-vs-kave"
          className="mt-7 flex flex-col justify-between gap-3 border-t border-matcha-kraft/60 pt-6 text-matcha-text/65 small:flex-row small:items-center"
        >
          <span className="text-sm">
            Matcha vagy kávé? Nézd meg a koffein- és elkészítési különbségeket.
          </span>
          <strong className="shrink-0 text-sm text-matcha-dark">
            Őszinte összehasonlítás →
          </strong>
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default Recipes
