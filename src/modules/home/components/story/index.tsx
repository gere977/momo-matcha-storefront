const Story = () => {
  return (
    <section
      data-story-section
      className="relative py-28 px-6 bg-cover overflow-hidden"
      style={{
        backgroundColor: "#2D4A1E",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1634302200795-ca6b96458476?w=2000&auto=format&fit=crop&q=80')",
        backgroundPosition: "center 30%",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(45,74,30,0.75) 0%, rgba(20,35,12,0.82) 100%)",
        }}
      />
      <div data-story-content className="relative z-10 text-center max-w-2xl mx-auto">
        <span className="block text-xs tracking-[4px] uppercase text-white/60 mb-5">
          A mi történetünk
        </span>
        <h2 className="font-heading text-6xl small:text-7xl leading-none text-matcha-bg mb-6">
          Az Uji dombjain született.
        </h2>
        <p className="text-lg text-white/80 leading-relaxed mb-8">
          Japán, Uji ősi teakertjeinek mélyén évszázadok óta termesztenek ceremoniális
          matchát. Mi megtaláltuk ezeket a kerteket — és elhozzuk rituáléjukat a
          reggeleitekbe.
        </p>
        <a
          href="/pages/about"
          className="inline-block text-matcha-bg font-semibold tracking-wide text-sm border-b border-white/50 pb-1 hover:text-matcha-kraft hover:border-matcha-kraft transition-colors"
        >
          Ismerje meg a matchát →
        </a>
      </div>
    </section>
  )
}

export default Story
