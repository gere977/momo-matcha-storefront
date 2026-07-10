const Star = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E23B2E" aria-hidden="true">
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
    <section className="bg-matcha-bg pt-20 px-6">
      <div className="content-container">
        <div className="flex flex-wrap items-center gap-12 mb-12">
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
          <div className="flex-1">
            <span className="block text-xs font-bold tracking-[3px] text-matcha mb-2">
              VÉLEMÉNYEK
            </span>
            <h2 className="font-heading font-bold text-4xl small:text-5xl text-matcha-text leading-tight">
              Mit mondanak vásárlóink
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-7 border border-matcha-kraft/30 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex gap-0.5" aria-label={`${r.rating} csillag`}>
                {Array.from({ length: Math.max(1, Math.min(5, r.rating)) }).map(
                  (_, i) => (
                    <Star key={i} />
                  )
                )}
              </div>
              <p className="text-sm text-matcha-text/80 italic leading-relaxed flex-1">
                „{r.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-matcha-kraft/30">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-heading text-lg bg-gradient-to-br from-matcha to-matcha-dark">
                  {r.name?.charAt(0)?.toUpperCase() || "M"}
                </div>
                <div>
                  <p className="font-bold text-sm text-matcha-text">{r.name}</p>
                  {r.product_title && (
                    <p className="text-xs text-matcha-text/40">
                      {r.product_title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews
