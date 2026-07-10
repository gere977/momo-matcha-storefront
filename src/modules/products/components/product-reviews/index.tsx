import ReviewForm from "./form"

type StoreReview = {
  id: string
  name: string
  rating: number
  text: string
  created_at: string
}

const Star = ({ filled }: { filled: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "#E23B2E" : "#E5DCC9"}
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

async function fetchProductReviews(productId: string): Promise<{
  reviews: StoreReview[]
  average: number | null
  count: number
}> {
  const backend = process.env.MEDUSA_BACKEND_URL
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (!backend || !key) return { reviews: [], average: null, count: 0 }

  try {
    const res = await fetch(
      `${backend}/store/reviews?product_id=${encodeURIComponent(productId)}&limit=20`,
      {
        headers: { "x-publishable-api-key": key },
        next: { revalidate: 300 },
      }
    )
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

// Moderated customer reviews for one product + the submission form.
// Anchored as #velemenyek — the post-delivery review-request email links here.
export default async function ProductReviews({
  productId,
}: {
  productId: string
}) {
  const { reviews, average, count } = await fetchProductReviews(productId)

  return (
    <section id="velemenyek" className="content-container my-16 small:my-24">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="block text-xs font-bold tracking-[3px] text-matcha mb-2">
            VÉLEMÉNYEK
          </span>
          <h2 className="font-heading font-bold text-3xl small:text-4xl text-matcha-text">
            Vásárlóink értékelései
          </h2>
        </div>
        {average !== null && count > 0 && (
          <p className="text-sm text-matcha-text/60 font-semibold">
            {average.toFixed(1)} ★ · {count} vélemény
          </p>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-matcha-text/60 mb-8">
          Ennél a terméknél még nincs vélemény — legyél te az első értékelő!
        </p>
      ) : (
        <div className="grid grid-cols-1 small:grid-cols-2 gap-4 mb-10">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-6 border border-matcha-kraft/30 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5" aria-label={`${r.rating}/5 csillag`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < r.rating} />
                  ))}
                </div>
                <span className="font-bold text-sm text-matcha-text">
                  {r.name}
                </span>
                <span className="text-xs text-matcha-text/40">
                  {new Date(r.created_at).toLocaleDateString("hu-HU")}
                </span>
              </div>
              <p className="text-sm text-matcha-text/80 leading-relaxed">
                {r.text}
              </p>
            </div>
          ))}
        </div>
      )}

      <ReviewForm productId={productId} />
    </section>
  )
}
