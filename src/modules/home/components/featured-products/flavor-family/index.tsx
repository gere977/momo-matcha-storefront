import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const flavorOrder = [
  "original-premium-momo-matcha",
  "epres-premium-momo-matcha",
  "vanilias-premium-momo-matcha",
  "csokoladas-premium-momo-matcha",
] as const

const flavorArtwork: Record<
  (typeof flavorOrder)[number],
  { image: string; label: string; scene: string }
> = {
  "original-premium-momo-matcha": {
    image: "/images/products/momo-original-tin.png",
    label: "Original",
    scene: "original",
  },
  "epres-premium-momo-matcha": {
    image: "/images/products/momo-strawberry-tin.png",
    label: "Epres",
    scene: "strawberry",
  },
  "vanilias-premium-momo-matcha": {
    image: "/images/products/momo-vanilla-tin.png",
    label: "Vaníliás",
    scene: "vanilla",
  },
  "csokoladas-premium-momo-matcha": {
    image: "/images/products/momo-chocolate-tin.png",
    label: "Csokoládés",
    scene: "chocolate",
  },
}

export const FAMILY_FLAVOR_HANDLES = new Set<string>(flavorOrder)

export default function FlavorFamily({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) {
  const orderedProducts = flavorOrder
    .map((handle) => products.find((product) => product.handle === handle))
    .filter((product): product is HttpTypes.StoreProduct => Boolean(product))

  return (
    <section
      id="matcha-csalad"
      className="momo-family-stage"
      aria-label="A Momo Matcha négy íze"
    >
      <span className="momo-family-sun" aria-hidden="true" />

      <svg
        viewBox="0 0 1200 340"
        className="momo-family-mountains"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-60,340 L170,118 L302,246 L485,52 L672,244 L824,104 L1022,248 L1168,142 L1280,340 Z"
          fill="currentColor"
        />
      </svg>

      <svg
        viewBox="0 0 1200 220"
        className="momo-family-wave"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,96 C194,28 310,136 492,78 C676,20 804,128 976,69 C1078,34 1146,54 1200,82 L1200,220 L0,220 Z"
          fill="currentColor"
        />
        <path
          d="M0,96 C194,28 310,136 492,78 C676,20 804,128 976,69 C1078,34 1146,54 1200,82"
          fill="none"
          stroke="rgba(225, 244, 205, 0.82)"
          strokeWidth="4"
        />
      </svg>

      <ul className="momo-family-grid">
        {orderedProducts.map((product) => {
          const artwork =
            flavorArtwork[product.handle as (typeof flavorOrder)[number]]
          const { cheapestPrice } = getProductPrice({ product })

          return (
            <li
              key={product.id}
              className={`momo-family-flavor momo-family-flavor--${artwork.scene}`}
            >
              <LocalizedClientLink
                href={`/products/${product.handle}`}
                className="momo-family-link group/family"
                aria-label={`${product.title} megnyitása`}
              >
                <span className="momo-family-product">
                  <span className="momo-family-glow" aria-hidden="true" />
                  <Image
                    src={artwork.image}
                    alt={product.title}
                    fill
                    quality={82}
                    sizes="(max-width: 767px) 44vw, 24vw"
                    className="momo-family-tin object-contain"
                  />
                </span>

                <span className="momo-family-caption">
                  <span>
                    <span className="momo-family-label">{artwork.label}</span>
                    <span className="momo-family-size">30 g fémdoboz</span>
                  </span>
                  <span className="momo-family-price">
                    {cheapestPrice?.calculated_price}
                    <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>

      <p className="momo-family-note">
        <span>4 íz</span>
        <span aria-hidden="true">·</span>
        <span>1 közös rituálé</span>
      </p>
    </section>
  )
}
