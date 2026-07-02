import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section
      data-hero-section
      className="relative overflow-hidden bg-matcha-bg"
    >
      {/* Colorful soft blobs for a playful, designy backdrop */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-strawberry/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 w-[26rem] h-[26rem] rounded-full bg-matcha/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-vanilla/50 blur-3xl" />

      <div className="content-container relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 items-center py-16 md:py-20 min-h-[82vh]">
        {/* Copy */}
        <div className="text-center md:text-left">
          <span
            data-hero-el
            className="opacity-0 translate-y-[30px] inline-block mb-5 px-4 py-1.5 rounded-full bg-matcha-accent text-white text-[11px] font-bold uppercase tracking-[2px] shadow-sm"
          >
            Új · ízesített matchák 🍓
          </span>
          <h1
            data-hero-el
            className="opacity-0 translate-y-[30px] font-heading font-bold text-6xl md:text-7xl leading-[1.02] text-matcha-dark"
          >
            Találd meg a{" "}
            <span className="text-matcha-accent">rituálédat</span>
          </h1>
          <p
            data-hero-el
            className="opacity-0 translate-y-[30px] mt-5 text-lg text-matcha-text/75 max-w-md mx-auto md:mx-0"
          >
            Prémium, bio matcha Japánból — a klasszikus szertartásostól a
            gyümölcsös ízesítettekig.
          </p>
          <div
            data-hero-el
            className="opacity-0 translate-y-[30px] mt-8 flex flex-wrap gap-3 justify-center md:justify-start"
          >
            <LocalizedClientLink
              href="/store"
              className="inline-block px-9 py-4 rounded-full bg-matcha-accent text-white font-bold uppercase tracking-wider text-sm hover:-translate-y-0.5 transition-all shadow-lg shadow-matcha-accent/25"
            >
              Vásárolj most
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/collections/matcha"
              className="inline-block px-9 py-4 rounded-full bg-white text-matcha-dark font-bold uppercase tracking-wider text-sm border border-matcha-kraft hover:bg-matcha-kraft/30 transition-all"
            >
              Matcha teák
            </LocalizedClientLink>
          </div>
        </div>

        {/* Lifestyle photo with an offset color card behind it */}
        <div data-hero-el className="opacity-0 translate-y-[30px] relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 rotate-3 rounded-large bg-strawberry/30" />
          <div className="absolute -inset-3 -rotate-2 rounded-large bg-matcha/20" />
          <img
            src="/images/lifestyle-drinking.png"
            alt="Momo Matcha"
            className="relative rounded-large shadow-2xl w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
