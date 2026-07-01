const FEATURES = [
  {
    title: "100% Bio",
    body: "Egyenesen Uji, Japán forrásából — a ceremoniális matcha szülőhelyéről.",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M28 6 C28 6, 10 18, 10 32 C10 42.5 18 50 28 50 C38 50 46 42.5 46 32 C46 18 28 6 28 6 Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 18 C28 18, 20 28, 28 38"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Prémium",
    body: "Kőőrléssel selymes porrá alakítva a legfinomabb, leggazdagabb ízért.",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 20 C14 14 20 10 28 10 C36 10 42 14 42 20 C42 26 38 30 34 32 L34 44 L22 44 L22 32 C18 30 14 26 14 20 Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="20" y1="38" x2="36" y2="38" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="22" y1="44" x2="34" y2="44" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Fókusz & Nyugalom",
    body: "Tiszta energia remegés nélkül — az L-teanin megőrzi az egyensúlyt és az éberséget.",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="14" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="28" cy="28" r="6" stroke="currentColor" strokeWidth="1.4" />
        <line x1="28" y1="8" x2="28" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="28" y1="43" x2="28" y2="48" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="28" cy="28" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
]

const Features = () => {
  return (
    <section className="bg-matcha-bg py-20 px-6">
      <div className="content-container grid grid-cols-1 small:grid-cols-3 gap-12 text-center">
        {FEATURES.map((f) => (
          <div key={f.title} data-reveal-col className="opacity-0 translate-y-[40px]">
            <div className="w-14 h-14 mx-auto mb-5 text-matcha">{f.icon}</div>
            <h3 className="font-heading text-3xl text-matcha-text mb-2">{f.title}</h3>
            <p className="text-sm text-matcha-text/70 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
