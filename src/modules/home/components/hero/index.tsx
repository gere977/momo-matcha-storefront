import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Hero entrance runs as pure CSS (`hero-in` keyframes in globals.css) so the
// LCP image and headline are visible without waiting for the JS bundle —
// GSAP only drives the scroll parallax on [data-hero-section].
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
          <span className="hero-in inline-block mb-5 px-4 py-1.5 rounded-full bg-matcha-accent text-white text-[11px] font-bold uppercase tracking-[2px] shadow-sm">
            Új · ízesített matchák 🍓
          </span>
          <h1
            className="hero-in font-heading font-bold text-6xl md:text-7xl leading-[1.02] text-matcha-dark"
            style={{ animationDelay: "120ms" }}
          >
            Találd meg a{" "}
            <span className="text-matcha-accent">rituálédat</span>
          </h1>
          <p
            className="hero-in mt-5 text-lg text-matcha-text/75 max-w-md mx-auto md:mx-0"
            style={{ animationDelay: "240ms" }}
          >
            Prémium, bio matcha Japánból — a klasszikus szertartásostól a
            gyümölcsös ízesítettekig.
          </p>
          <div
            className="hero-in mt-8 flex flex-wrap items-center gap-3 justify-center md:justify-start"
            style={{ animationDelay: "360ms" }}
          >
            <LocalizedClientLink
              href="/store"
              className="group inline-flex items-center gap-3 pl-9 pr-3 py-3 rounded-full bg-matcha-accent text-white font-bold uppercase tracking-wider text-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-transform duration-200 ease-out-quart shadow-lg shadow-matcha-accent/25"
            >
              Vásárolj most
              <span
                aria-hidden
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-200 ease-out-quart group-hover:translate-x-0.5"
              >
                →
              </span>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/collections/matcha"
              className="inline-block px-9 py-4 rounded-full bg-white text-matcha-dark font-bold uppercase tracking-wider text-sm border border-matcha-kraft hover:bg-matcha-kraft/30 active:scale-[0.98] transition-[background-color,transform] duration-200 ease-out-quart"
            >
              Matcha teák
            </LocalizedClientLink>
          </div>
        </div>

        {/* Lifestyle photo with an offset color card behind it */}
        <div
          className="hero-in relative mx-auto w-full max-w-sm"
          style={{ animationDelay: "200ms" }}
        >
          <div className="absolute -inset-3 rotate-3 rounded-large bg-strawberry/30" />
          <div className="absolute -inset-3 -rotate-2 rounded-large bg-matcha/20" />
          <Image
            src="/images/lifestyle-drinking.png"
            alt="Matcha készítése kézzel, bambusz habverővel"
            width={299}
            height={437}
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 90vw, 384px"
            className="relative rounded-large shadow-2xl w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
