import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Story = () => {
  return (
    <section
      data-story-section
      className="relative py-28 px-6 bg-cover overflow-hidden"
      style={{
        backgroundColor: "#3B5A2E",
        // Swap this file (public/images/story.jpg) for your own brand photo.
        backgroundImage: "url('/images/story.jpg')",
        backgroundPosition: "center 30%",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,90,46,0.74) 0%, rgba(30,45,22,0.85) 100%)",
        }}
      />
      <div data-story-content className="relative z-10 text-center max-w-2xl mx-auto">
        <span className="opacity-0 translate-y-[30px] block text-xs tracking-[4px] uppercase text-white/60 mb-5">
          A mi történetünk
        </span>
        <h2 className="opacity-0 translate-y-[30px] font-heading font-bold text-6xl small:text-7xl leading-none text-matcha-bg mb-6">
          Az Uji dombjain született.
        </h2>
        <p className="opacity-0 translate-y-[30px] text-lg text-white/80 leading-relaxed mb-8">
          Japán, Uji ősi teakertjeinek mélyén évszázadok óta termesztenek ceremoniális
          matchát. Mi megtaláltuk ezeket a kerteket — és elhozzuk rituáléjukat a
          reggeleitekbe.
        </p>
        <LocalizedClientLink
          href="/pages/about"
          className="opacity-0 translate-y-[30px] inline-block mt-2 px-8 py-3.5 rounded-full bg-matcha-cream text-matcha-dark font-bold uppercase tracking-wider text-xs hover:bg-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-[background-color,transform] duration-200 ease-out-quart"
        >
          Ismerje meg a matchát
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default Story
