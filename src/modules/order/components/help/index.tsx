import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="font-heading text-xl text-matcha-dark">
        Segítségre van szükséged?
      </Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <a
              href="mailto:info@momomatcha.hu"
              className="text-matcha hover:text-matcha-accent font-semibold"
            >
              Írj nekünk: info@momomatcha.hu
            </a>
          </li>
          <li>
            <LocalizedClientLink
              href="/pages/refunds"
              className="text-matcha hover:text-matcha-accent font-semibold"
            >
              Visszaküldés és csere
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
