const Star = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#E23B2E"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

type StoreReview = {
  id: string
  name: string
  rating: number
  text: string
  product_title?: string | null
  created_at: string
}

// Real, moderated customer reviews from the backend reviews module. The
// section renders nothing until there are approved reviews — we never show
// fabricated ratings or counts (EU consumer-protection rules on fake reviews).
async function fetchReviews(): Promise<{
  reviews: StoreReview[]
  average: number | null
  count: number
}> {
  const backend = process.env.MEDUSA_BACKEND_URL
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (!backend || !key) return { reviews: [], average: null, count: 0 }

  try {
    const res = await fetch(`${backend}/store/reviews?limit=3`, {
      headers: { "x-publishable-api-key": key },
      next: { revalidate: 300 },
    })
    if (!res.ok) return { reviews: [], average: null, count: 0 }
    const data = await res.json()
    return {
      reviews: data.reviews ?? [],
      average: data.average ?? null,
      count: data.count ?? 0,
    }
  } catch {
    return { reviews: [], average: null, count: 0 }
  }
}

const Reviews = async () => {
  const { reviews, average, count } = await fetchReviews()

  if (!reviews.length) {
    return null
  }

  return (
    <section className="bg-[#fffaf0] px-6 py-20 small:py-24">
      <div className="content-container">
        <div className="mb-10 flex flex-col-reverse justify-between gap-8 small:flex-row small:items-end">
          {average !== null && count > 0 && (
            <div className="flex items-center gap-4">
              <span className="font-heading text-7xl text-matcha-accent leading-none">
                {average.toFixed(1)}
              </span>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                <p className="text-xs text-matcha-text/50 font-semibold">
                  {count} valódi vélemény alapján
                </p>
              </div>
            </div>
          )}
          <div className="max-w-2xl">
            <span className="block text-xs font-bold uppercase tracking-[0.24em] text-matcha mb-2">
              Ellenőrzött, valódi vélemények
            </span>
            <h2 className="font-heading font-bold text-4xl small:text-5xl text-matcha-text leading-tight">
              Ők már belekortyoltak.
            </h2>
          </div>
        </div>

        <div className="grid gap-5 small:grid-cols-[1.15fr_0.85fr]">
          {reviews[0] && (
            <article
              className={`relative flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-matcha-dark p-7 text-white small:p-10 ${
                reviews.length === 1 ? "small:col-span-2" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute -right-10 -top-14 font-heading text-[12rem] leading-none text-white/[0.04]"
              >
                ”
              </span>
              <div
                className="relative z-10 flex gap-0.5"
                aria-label={`${reviews[0].rating} csillag`}
              >
                {Array.from({
                  length: Math.max(1, Math.min(5, reviews[0].rating)),
                }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="relative z-10 my-8 max-w-2xl text-pretty font-heading text-2xl font-semibold leading-snug text-white small:text-3xl">
                „{reviews[0].text}”
              </p>
              <div className="relative z-10 flex items-center gap-3 border-t border-white/15 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 font-heading text-lg text-white">
                  {reviews[0].name?.charAt(0)?.toUpperCase() || "M"}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {reviews[0].name}
                  </p>
                  {reviews[0].product_title && (
                    <p className="text-xs text-white/45">
                      {reviews[0].product_title}
                    </p>
                  )}
                </div>
              </div>
            </article>
          )}

          {reviews.length > 1 && (
            <div className="grid gap-5">
              {reviews.slice(1).map((r) => (
                <article
                  key={r.id}
                  className="flex flex-col gap-4 rounded-[1.5rem] bg-white p-6 shadow-[0_14px_40px_rgba(68,83,62,0.07)]"
                >
                  <div
                    className="flex gap-0.5"
                    aria-label={`${r.rating} csillag`}
                  >
                    {Array.from({
                      length: Math.max(1, Math.min(5, r.rating)),
                    }).map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <p className="flex-1 text-pretty text-sm italic leading-relaxed text-matcha-text/75">
                    „{r.text}”
                  </p>
                  <div className="border-t border-matcha-kraft/35 pt-4">
                    <p className="text-sm font-bold text-matcha-text">
                      {r.name}
                    </p>
                    {r.product_title && (
                      <p className="mt-0.5 text-xs text-matcha-text/40">
                        {r.product_title}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Reviews
