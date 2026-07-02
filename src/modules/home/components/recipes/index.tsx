const RECIPES = [
  {
    title: "Klasszikus Matcha Tea",
    time: "3 perc",
    desc: "A legpurább élmény. Csak por, víz és egy bambuszos habverő.",
    steps: [
      "Szitálj 1–2g matchát egy tálba",
      "Adj hozzá 70ml 75°C-os vizet",
      "Habverővel W-mozdulattal keverd habosra",
    ],
    gradient: "linear-gradient(135deg, #e8f0e0 0%, #c8dbb8 100%)",
  },
  {
    title: "Matcha Latte",
    time: "5 perc",
    desc: "Krémes, melegítő és laktató. Tökéletes kávéhelyettesítő a reggeli rutinodhoz.",
    steps: [
      "Keverd el 2g matchát 30ml forró vízzel",
      "Habosítsd fel a 200ml zabot vagy tejet",
      "Öntsd a tejet a matchára, édesítsd ízlés szerint",
    ],
    gradient: "linear-gradient(135deg, #f5ede0 0%, #e8d5b8 100%)",
  },
  {
    title: "Jeges Matcha",
    time: "5 perc",
    desc: "Frissítő és élénkítő. A tökéletes nyári ital, amely nyugodt, fókuszált energiát ad.",
    steps: [
      "Keverd el 2g matchát 30ml forró vízzel",
      "Tölts meg egy poharat jégkockákkal",
      "Öntsd a matchát a jégre, töltsd fel hideg tejjel",
    ],
    gradient: "linear-gradient(135deg, #dff0f5 0%, #b8d8e8 100%)",
  },
]

const Recipes = () => {
  return (
    <section id="recipes" className="bg-matcha-bg pt-20 px-6">
      <div className="content-container">
        <div className="text-center mb-12">
          <span className="block text-xs font-bold tracking-[3px] text-matcha mb-2">
            RECEPTEK
          </span>
          <h2 className="font-heading font-bold text-4xl small:text-5xl text-matcha-text mb-2">
            Készítsd el te is
          </h2>
          <p className="text-matcha-text/50">Három módja, hogy élvezd a matchádat.</p>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-6">
          {RECIPES.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-large overflow-hidden border border-matcha-kraft/40 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div
                className="h-40 flex items-center justify-center text-6xl"
                style={{ background: r.gradient }}
              >
                🍵
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-xs text-matcha-text/40 font-semibold">{r.time}</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-matcha/10 text-matcha">
                    Egyszerű
                  </span>
                </div>
                <h3 className="font-heading font-bold text-2xl text-matcha-dark mb-2">{r.title}</h3>
                <p className="text-sm text-matcha-text/60 leading-relaxed mb-4">{r.desc}</p>
                <ol className="list-decimal list-inside flex flex-col gap-1.5">
                  {r.steps.map((s) => (
                    <li key={s} className="text-sm text-matcha-text/70 leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Recipes
