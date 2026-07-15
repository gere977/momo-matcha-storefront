import { Text, clx } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

type CardArtwork = {
  image: string
  scene: "original" | "strawberry" | "vanilla" | "chocolate" | "accessories"
}

const cardArtwork: Record<string, CardArtwork> = {
  "original-premium-momo-matcha": {
    image: "/images/products/momo-original-tin.png",
    scene: "original",
  },
  "epres-premium-momo-matcha": {
    image: "/images/products/momo-strawberry-tin.png",
    scene: "strawberry",
  },
  "vanilias-premium-momo-matcha": {
    image: "/images/products/momo-vanilla-tin.png",
    scene: "vanilla",
  },
  "csokoladas-premium-momo-matcha": {
    image: "/images/products/momo-chocolate-tin.png",
    scene: "chocolate",
  },
  "matcha-szett": {
    image: "/images/products/momo-accessories-card.png",
    scene: "accessories",
  },
}

const ProductCardScene = ({
  artwork,
  title,
  isFeatured,
}: {
  artwork: CardArtwork
  title: string
  isFeatured?: boolean
}) => (
  <div
    className={clx(
      "momo-card-scene relative w-full overflow-hidden",
      `momo-card-scene--${artwork.scene}`,
      {
        "momo-card-scene--featured aspect-[11/14]": isFeatured,
        "aspect-[9/16]": !isFeatured,
      }
    )}
  >
    <span className="momo-card-sun" aria-hidden="true" />

    <svg
      viewBox="0 0 400 220"
      className="momo-card-mountains absolute inset-x-0 bottom-[17%] z-0 h-[55%] w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M-20,220 L92,78 L142,132 L210,34 L288,124 L342,82 L430,184 L430,220 Z"
        fill="currentColor"
      />
    </svg>

    <svg
      viewBox="0 0 400 150"
      className="momo-card-wave absolute inset-x-0 bottom-0 z-10 h-[35%] w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,58 C74,22 132,82 202,51 C271,20 334,78 400,44 L400,150 L0,150 Z"
        fill="currentColor"
      />
      <path
        d="M0,58 C74,22 132,82 202,51 C271,20 334,78 400,44"
        fill="none"
        stroke="rgba(225, 244, 205, 0.76)"
        strokeWidth="3"
      />
    </svg>

    <Image
      src={artwork.image}
      alt={title}
      fill
      quality={72}
      sizes="(max-width: 576px) 46vw, (max-width: 992px) 30vw, 320px"
      className={clx("momo-card-art z-20 object-contain", {
        "momo-card-art--accessories": artwork.scene === "accessories",
        "momo-card-art--original": artwork.scene === "original",
      })}
    />

    <span className="momo-card-origin" aria-hidden="true">
      Japánból
    </span>
  </div>
)

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  const artwork = product.handle ? cardArtwork[product.handle] : undefined

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group flex h-full flex-col"
    >
      <article
        data-testid="product-wrapper"
        className="momo-store-card flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white/90 transition-[transform,box-shadow] duration-300 ease-out-quart group-hover:-translate-y-1.5"
      >
        {artwork ? (
          <ProductCardScene
            artwork={artwork}
            title={product.title}
            isFeatured={isFeatured}
          />
        ) : (
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            alt={product.title}
            isFeatured={isFeatured}
          />
        )}
        <div className="flex min-h-[8rem] flex-1 flex-col items-start justify-between gap-2 p-4 txt-compact-medium small:min-h-[6.75rem] small:p-5">
          <Text
            className="min-h-[4.05em] overflow-hidden font-body text-[13px] font-semibold leading-[1.35] text-matcha-text [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] small:min-h-[2.7em] small:text-sm small:[-webkit-line-clamp:2]"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="flex shrink-0 self-end items-center gap-x-2 whitespace-nowrap font-bold tabular-nums text-matcha">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
