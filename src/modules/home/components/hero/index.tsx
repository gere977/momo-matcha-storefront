import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div
      data-hero-section
      className="h-[90vh] min-h-[560px] w-full relative flex items-center justify-center bg-cover bg-top"
      style={{
        // Swap this file (public/images/hero.jpg) for your own brand photo — 2400px wide, landscape.
        backgroundImage: "url('/images/hero.jpg')",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(247,243,233,0.30) 0%, rgba(59,90,46,0.40) 100%)",
        }}
      />
      <div className="relative z-10 bg-matcha-cream/92 backdrop-blur-sm px-10 py-12 sm:px-14 sm:py-14 rounded-large text-center max-w-[540px] shadow-2xl mx-4 border border-matcha-kraft/60">
        <span
          data-hero-el
          className="opacity-0 translate-y-[30px] inline-block mb-5 px-4 py-1.5 rounded-full bg-strawberry/25 text-[11px] font-bold uppercase tracking-[2px] text-matcha-accent"
        >
          Új · ízesített matchák 🍓
        </span>
        <h1
          data-hero-el
          className="opacity-0 translate-y-[30px] font-heading font-bold text-6xl md:text-7xl leading-[1.05] text-matcha-dark"
        >
          Találd meg a rituálédat
        </h1>
        <p data-hero-el className="opacity-0 translate-y-[30px] mt-4 text-lg text-matcha-text/75">
          Prémium, bio matcha Japánból — a klasszikus szertartásostól a
          gyümölcsös ízesítettekig.
        </p>
        <LocalizedClientLink
          data-hero-el
          href="/store"
          className="opacity-0 translate-y-[30px] inline-block mt-7 px-10 py-4 rounded-full bg-matcha-accent text-white font-bold uppercase tracking-wider text-sm hover:bg-matcha hover:-translate-y-0.5 transition-all shadow-lg shadow-matcha-accent/25"
        >
          Vásárolj most
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
