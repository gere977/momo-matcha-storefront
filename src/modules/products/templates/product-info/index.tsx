import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const titleParts = product.title.split(/(prémium)/gi)
  const isOriginal = /original/i.test(
    `${product.handle ?? ""} ${product.title}`
  )
  const specs =
    product.handle === "matcha-szett"
      ? [
          "4 részes szett",
          "Kerámia és bambusz",
          "Matcha rituáléhoz",
          "Momo Matcha",
        ]
      : isOriginal
      ? ["30 g fémdoboz", "Ceremóniás minőség", "100% bio", "Uji, Japán"]
      : ["30 g fémdoboz", "Prémium minőség", "Japán matcha", "Momo Matcha"]

  return (
    <div id="product-info">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-y-5 text-center small:mx-0 small:items-start small:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-matcha-accent/15 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-matcha-accent xsmall:text-xs">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-matcha-accent" />
          Új szállítmány · Japánból
        </div>

        <h1
          className="font-editorial text-[2.4rem] font-bold leading-[1.02] tracking-[-0.025em] text-[#234c38] xsmall:text-5xl small:text-6xl"
          data-testid="product-title"
        >
          {titleParts.map((part, index) =>
            /^prémium$/i.test(part) ? (
              <span key={index} className="italic text-matcha-dark">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </h1>

        <Text
          className="max-w-xl whitespace-pre-line text-base leading-relaxed text-[#51665a] xsmall:text-lg"
          data-testid="product-description"
        >
          {product.description}
        </Text>

        <div className="flex flex-wrap justify-center gap-2 xsmall:gap-3 small:justify-start">
          {specs.map((spec) => (
            <span
              key={spec}
              className="rounded-full border border-[#6f8e7c] bg-white/60 px-3 py-1.5 text-xs text-[#355945] backdrop-blur-sm xsmall:text-sm"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
