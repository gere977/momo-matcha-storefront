"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { CSSProperties, KeyboardEvent, useState } from "react"

type ProductSplashProps = {
  product: HttpTypes.StoreProduct
  images: HttpTypes.StoreProductImage[]
}

const droplets = [
  { dx: -110, dy: -140, size: 13 },
  { dx: -70, dy: -180, size: 9 },
  { dx: -30, dy: -200, size: 16 },
  { dx: 30, dy: -190, size: 11 },
  { dx: 75, dy: -170, size: 15 },
  { dx: 120, dy: -130, size: 10 },
  { dx: -150, dy: -90, size: 12 },
  { dx: 150, dy: -95, size: 17 },
]

const productImageOverrides: Record<string, string> = {
  "original-premium-momo-matcha": "/images/products/momo-original-tin.png",
  "epres-premium-momo-matcha": "/images/products/momo-strawberry-tin.png",
  "vanilias-premium-momo-matcha": "/images/products/momo-vanilla-tin.png",
  "csokoladas-premium-momo-matcha": "/images/products/momo-chocolate-tin.png",
  "matcha-szett": "/images/products/momo-accessories-set.png",
}

const ProductSplash = ({ product, images }: ProductSplashProps) => {
  const [splashKey, setSplashKey] = useState(0)
  const productImage = product.handle
    ? productImageOverrides[product.handle] ?? images[0]?.url
    : images[0]?.url

  const replay = () => setSplashKey((key) => key + 1)
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      replay()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Termékanimáció újrajátszása"
      title="Kattints az újrajátszáshoz"
      onClick={replay}
      onKeyDown={handleKeyDown}
      className="relative min-h-[360px] cursor-pointer select-none overflow-hidden outline-none active:!scale-100 xsmall:min-h-[460px] small:min-h-[560px]"
    >
      <div
        key={splashKey}
        className="absolute inset-0 flex items-end justify-center overflow-hidden"
      >
        <div className="momo-product-sun absolute left-2 top-2 z-0 h-24 w-24 rounded-full opacity-90 xsmall:left-6 xsmall:top-6 xsmall:h-32 xsmall:w-32 small:h-40 small:w-40" />

        <svg
          viewBox="0 0 400 200"
          className="absolute inset-x-0 bottom-0 z-0 h-[62%] w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,200 L120,80 L160,120 L220,40 L290,110 L340,90 L400,150 L400,200 Z"
            fill="var(--momo-product-primary)"
            opacity="0.35"
          />
        </svg>

        <svg
          className="momo-product-liquid absolute inset-x-0 bottom-0 z-10 h-[36%] w-full"
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={`matcha-liquid-${splashKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="oklch(0.72 0.16 145)" />
              <stop offset="60%" stopColor="oklch(0.5 0.14 150)" />
              <stop offset="100%" stopColor="oklch(0.35 0.11 152)" />
            </linearGradient>
          </defs>
          <path
            d="M0,60 C60,30 140,90 200,55 C260,20 340,80 400,50 L400,120 L0,120 Z"
            fill={`url(#matcha-liquid-${splashKey})`}
          />
          <path
            d="M0,60 C60,30 140,90 200,55 C260,20 340,80 400,50"
            fill="none"
            stroke="oklch(0.92 0.08 145)"
            strokeWidth="2"
            opacity="0.7"
          />
        </svg>

        <span className="momo-product-ripple z-20" />
        <span className="momo-product-ripple momo-product-ripple-2 z-20" />
        <span className="momo-product-ripple momo-product-ripple-3 z-20" />

        {droplets.map((droplet, index) => (
          <span
            key={index}
            className="momo-product-droplet z-20"
            style={
              {
                "--dx": `${droplet.dx}px`,
                "--dy": `${droplet.dy}px`,
                width: `${droplet.size}px`,
                height: `${droplet.size}px`,
              } as CSSProperties
            }
          />
        ))}

        {productImage && (
          <Image
            src={productImage}
            alt={`${product.title} fémdoboz`}
            width={576}
            height={464}
            priority
            sizes="(max-width: 512px) 224px, (max-width: 1024px) 288px, 440px"
            className="momo-product-tin relative z-30 mb-4 h-auto w-56 object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.3)] xsmall:mb-6 xsmall:w-72 small:w-full small:max-w-[440px]"
          />
        )}

        <div className="absolute right-2 top-2 z-40 flex h-16 w-16 rotate-12 flex-col items-center justify-center rounded-full bg-matcha-accent text-center font-editorial font-bold text-white shadow-lg xsmall:right-6 xsmall:top-4 xsmall:h-20 xsmall:w-20 small:h-24 small:w-24">
          <span className="text-sm leading-none xsmall:text-base small:text-lg">
            100%
          </span>
          <span className="mt-1 text-[8px] tracking-wider xsmall:text-[9px] small:text-[10px]">
            JAPÁN
            <br />
            MATCHA
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductSplash
