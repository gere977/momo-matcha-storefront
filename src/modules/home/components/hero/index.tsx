import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div
      data-hero-section
      className="h-[90vh] min-h-[560px] w-full relative flex items-center justify-center bg-cover bg-top"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=2000&auto=format&fit=crop')",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(45,74,30,0.12) 0%, rgba(0,0,0,0.18) 100%)",
        }}
      />
      <div className="relative z-10 bg-matcha-bg/90 backdrop-blur-sm px-14 py-14 rounded text-center max-w-[520px] shadow-2xl mx-4">
        <h1
          data-hero-el
          className="font-heading text-6xl md:text-8xl leading-none text-matcha-accent -tracking-wide"
        >
          Találd meg a rituálédat
        </h1>
        <p data-hero-el className="mt-4 text-lg text-matcha-text/70 tracking-wide">
          Prémium, bio szertartásos matcha Ujiból, Japánból
        </p>
        <LocalizedClientLink
          data-hero-el
          href="/store"
          className="inline-block mt-6 px-10 py-4 rounded-full bg-matcha-accent text-white font-bold uppercase tracking-wider text-sm hover:bg-matcha hover:-translate-y-0.5 transition-all"
        >
          Vásárolj most
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
