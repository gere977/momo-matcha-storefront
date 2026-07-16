const PROOFS = [
  {
    value: "4 íz",
    label: "a tiszta umamitól a krémes kakaósig",
  },
  {
    value: "1–2 g",
    label: "matcha elég egy otthoni adaghoz",
  },
  {
    value: "2 perc",
    label: "és kész lehet a meleg vagy jeges italod",
  },
  {
    value: "15 000 Ft",
    label: "felett a szállítás a miénk",
  },
] as const

const Features = () => {
  return (
    <section
      className="border-y border-matcha-kraft/45 bg-[#fffaf0] px-6"
      aria-label="Momo Matcha röviden"
    >
      <div className="content-container grid grid-cols-2 py-5 small:grid-cols-4 small:py-0">
        {PROOFS.map((proof, index) => (
          <div
            key={proof.value}
            className={`px-3 py-4 small:px-7 small:py-6 ${
              index % 2 === 1 ? "border-l border-matcha-kraft/50" : ""
            } ${
              index > 1
                ? "border-t border-matcha-kraft/50 small:border-t-0"
                : ""
            } ${
              index > 0 ? "small:border-l small:border-matcha-kraft/50" : ""
            }`}
          >
            <strong className="block font-heading text-xl font-bold text-matcha-dark small:text-2xl">
              {proof.value}
            </strong>
            <span className="mt-1 block max-w-[13rem] text-xs leading-snug text-matcha-text/55 small:text-sm">
              {proof.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
