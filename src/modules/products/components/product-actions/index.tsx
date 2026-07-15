"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { trackEvent } from "@lib/util/analytics"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })

    trackEvent("add_to_cart", pathname.replace(/^\/[a-z]{2}(\/|$)/, "/") || "/")

    setIsAdding(false)
  }

  // "Value per serving" framing: a serving is ~2g of matcha, so the size
  // options can be compared honestly (100g is the best price per serving).
  const perServing = useMemo(() => {
    const amount = selectedVariant?.calculated_price?.calculated_amount
    const currency = selectedVariant?.calculated_price?.currency_code
    if (typeof amount !== "number" || !currency) return null

    const grams = Number(
      (selectedVariant?.options ?? [])
        .map((o: any) => /^(\d+)\s*g$/i.exec(String(o.value ?? "").trim())?.[1])
        .find(Boolean)
    )
    if (!grams || Number.isNaN(grams)) return null

    const servings = Math.max(1, Math.round(grams / 2))
    const perServingAmount = amount / servings
    const formatted = new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(perServingAmount)

    return { servings, formatted }
  }, [selectedVariant])

  return (
    <>
      <div className="flex flex-col gap-y-4" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-end justify-center gap-4 pt-2 small:justify-start small:gap-6">
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#607368] xsmall:text-xs">
              Ár
            </div>
            <ProductPrice product={product} variant={selectedVariant} />
          </div>

          <div
            className="flex h-11 items-center overflow-hidden rounded-full border border-[#557563] bg-white/70 text-[#234c38] backdrop-blur-sm"
            aria-label="Mennyiség"
          >
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="h-11 w-11 text-lg hover:bg-matcha-accent/10"
              aria-label="Mennyiség csökkentése"
              disabled={isAdding || quantity <= 1}
            >
              −
            </button>
            <span className="w-10 text-center font-semibold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((current) => current + 1)}
              className="h-11 w-11 text-lg hover:bg-matcha-accent/10"
              aria-label="Mennyiség növelése"
              disabled={isAdding}
            >
              +
            </button>
          </div>
        </div>

        {perServing && (
          <p className="text-xs text-matcha-text/60 -mt-1">
            ≈ {perServing.formatted} / adag ({perServing.servings} adag, 2 g
            adagonként)
          </p>
        )}

        <div className="flex flex-col justify-center gap-3 pt-2 xsmall:flex-row small:justify-start">
          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            variant="primary"
            className="group h-14 w-full rounded-full border-none bg-matcha-accent px-8 text-base font-bold normal-case tracking-normal text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#d95c78] hover:shadow-xl xsmall:w-auto"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {!selectedVariant && Object.keys(options).length === 0
              ? "Válassz kiszerelést"
              : !inStock || !isValidVariant
              ? "Elfogyott"
              : "Kosárba teszem"}
            <span
              aria-hidden
              className="ml-2 transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Button>

          <LocalizedClientLink
            href="/store"
            className="inline-flex h-14 w-full items-center justify-center rounded-full border border-[#557563] bg-white/80 px-8 text-base font-bold text-[#234c38] backdrop-blur-sm transition-colors hover:bg-white xsmall:w-auto"
          >
            Vissza a boltba
          </LocalizedClientLink>
        </div>

        <p className="pt-1 text-center text-xs leading-relaxed text-[#607368] small:text-left">
          ✓ Ingyenes szállítás 15 000 Ft felett · ✓ 1–3 munkanap alatt házhoz
        </p>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
