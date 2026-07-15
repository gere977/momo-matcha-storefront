import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { CSSProperties } from "react"

const FLAVORS = [
  {
    handle: "original-premium-momo-matcha",
    label: "Original",
    note: "tiszta, umami",
    tin: "/images/products/momo-original-tin.png",
    color: "#327a4d",
    soft: "#dcebb9",
  },
  {
    handle: "epres-premium-momo-matcha",
    label: "Epres",
    note: "friss, gyümölcsös",
    tin: "/images/products/momo-strawberry-tin.png",
    color: "#ec6f91",
    soft: "#ffd5df",
  },
  {
    handle: "vanilias-premium-momo-matcha",
    label: "Vaníliás",
    note: "lágy, selymes",
    tin: "/images/products/momo-vanilla-tin.png",
    color: "#c99f62",
    soft: "#f8e5c5",
  },
  {
    handle: "csokoladas-premium-momo-matcha",
    label: "Csokoládés",
    note: "mély, krémes",
    tin: "/images/products/momo-chocolate-tin.png",
    color: "#7a442c",
    soft: "#e5b99e",
  },
] as const

export default function HeroFamilyVisual() {
  return (
    <div
      id="matcha-csalad"
      className="momo-hero-family"
      aria-label="A Momo Matcha négy íze"
    >
      <span className="momo-hero-family-sun" aria-hidden="true" />
      <span className="momo-hero-family-mountain" aria-hidden="true" />
      <span className="momo-hero-family-wave" aria-hidden="true" />

      <div className="momo-hero-family-cans">
        {FLAVORS.map((flavor, index) => (
          <LocalizedClientLink
            key={flavor.handle}
            href={`/products/${flavor.handle}`}
            className={`momo-hero-family-can momo-hero-family-can--${
              index + 1
            }`}
            style={
              {
                "--hero-flavor": flavor.color,
                "--hero-flavor-soft": flavor.soft,
              } as CSSProperties
            }
            aria-label={`${flavor.label} Momo Matcha megnyitása`}
          >
            <span className="momo-hero-family-halo" aria-hidden="true" />
            <Image
              src={flavor.tin}
              alt={`${flavor.label} Momo Matcha fémdoboz`}
              width={520}
              height={520}
              priority={index === 1 || index === 2}
              quality={80}
              sizes="(max-width: 767px) 42vw, (max-width: 1280px) 17vw, 220px"
              className="momo-hero-family-image"
            />
            <span className="momo-hero-family-label">
              <strong>{flavor.label}</strong>
              <small>{flavor.note}</small>
            </span>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}
