import {
  getFlavorProfile,
  getProductOrigin,
  getVariantLabel,
  isMatchaFlavor,
} from "@lib/util/product-merchandising"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const titleParts = product.title.split(/(prémium)/gi)
  const profile = getFlavorProfile(product.handle)
  const variantLabels = Array.from(
    new Set((product.variants ?? []).map(getVariantLabel).filter(Boolean))
  )
  const specs = isMatchaFlavor(product.handle)
    ? [
        variantLabels.join(", "),
        profile?.bestUse,
        getProductOrigin(product)
          ? `${getProductOrigin(product)} matcha`
          : null,
        "Jól záródó fémdoboz",
      ].filter((spec): spec is string => Boolean(spec))
    : product.handle === "matcha-szett"
    ? ["4 részes szett", "Kerámia tál", "Bambusz habverő", "Szűrővel"]
    : variantLabels

  return (
    <div id="product-info">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-y-5 text-center small:mx-0 small:items-start small:text-left">
        <div className="inline-flex items-center rounded-full bg-matcha-accent/15 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-matcha-accent xsmall:text-xs">
          {isMatchaFlavor(product.handle)
            ? "Japán matcha"
            : product.handle === "matcha-szett"
            ? "Matcha készítő szett"
            : "Momo Matcha"}
        </div>

        <h1
          className="pb-1 font-editorial text-[2.4rem] font-bold leading-[1.08] tracking-[-0.025em] text-matcha-deep xsmall:text-5xl small:text-6xl"
          data-testid="product-title"
        >
          {titleParts.map((part, index) =>
            /^prémium$/i.test(part) ? (
              <span
                key={index}
                className="inline-block italic text-matcha-dark"
              >
                {part}
              </span>
            ) : (
              part
            )
          )}
        </h1>

        <Text
          className="max-w-xl whitespace-pre-line text-base leading-relaxed text-matcha-sage xsmall:text-lg"
          data-testid="product-description"
        >
          {product.description}
        </Text>

        {specs.length > 0 && (
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
        )}
      </div>
    </div>
  )
}

export default ProductInfo
