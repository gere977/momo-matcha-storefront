import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const Story = () => {
  return (
    <section className="overflow-hidden bg-matcha-bg px-6 py-20 small:py-28">
      <div className="content-container grid items-center gap-10 small:grid-cols-[1.05fr_0.95fr] small:gap-16">
        <div className="relative min-h-[28rem] overflow-hidden rounded-[2.25rem] small:min-h-[39rem]">
          <Image
            src="/images/story.jpg"
            alt="Friss tealevelek közelről"
            fill
            sizes="(max-width: 767px) 100vw, 52vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matcha-dark/70 via-transparent to-[#fff2c4]/10" />

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 rounded-2xl border border-white/25 bg-matcha-dark/70 p-5 text-white backdrop-blur-md small:bottom-7 small:left-7 small:right-auto small:max-w-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-vanilla">
                Nem kell túlgondolni
              </span>
              <p className="mt-2 font-heading text-xl font-bold leading-tight">
                Kiméred. Felöntöd. Felhabosítod.
              </p>
            </div>
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-matcha-accent text-xl"
            >
              →
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-matcha">
            A Momo-féle rutin
          </span>
          <h2 className="mt-4 text-balance font-heading text-5xl font-bold leading-[0.98] text-matcha-dark small:text-6xl">
            Jó matchához nem kell tökéletes reggel.
          </h2>
          <p className="mt-6 max-w-[38rem] text-pretty text-base leading-relaxed text-matcha-text/70 small:text-lg">
            Elég egy kis por, megfelelő hőmérsékletű víz és két nyugodt perc. A
            Momo abban segít, hogy a matcha ne külön projekt legyen, hanem egy
            olyan rutin, amit egy átlagos hétköznapon is jólesik megtartani.
          </p>

          <dl className="mt-9 grid grid-cols-3 border-y border-matcha-kraft/60 py-6">
            <div>
              <dt className="font-heading text-2xl font-bold text-matcha-dark">
                1–2 g
              </dt>
              <dd className="mt-1 text-xs text-matcha-text/50">egy adaghoz</dd>
            </div>
            <div className="border-l border-matcha-kraft/60 pl-5 small:pl-7">
              <dt className="font-heading text-2xl font-bold text-matcha-dark">
                75–80 °C
              </dt>
              <dd className="mt-1 text-xs text-matcha-text/50">ideális víz</dd>
            </div>
            <div className="border-l border-matcha-kraft/60 pl-5 small:pl-7">
              <dt className="font-heading text-2xl font-bold text-matcha-dark">
                2 perc
              </dt>
              <dd className="mt-1 text-xs text-matcha-text/50">
                az alaprecept
              </dd>
            </div>
          </dl>

          <LocalizedClientLink
            href="/tudastar/matcha-keszites"
            className="group mt-8 inline-flex items-center gap-3 font-bold text-matcha-dark underline decoration-matcha-accent/50 decoration-2 underline-offset-8 transition-colors hover:text-matcha-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matcha"
          >
            Mutasd a négy lépést
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Story
