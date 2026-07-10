import { ArrowUpRightMini } from "@medusajs/icons"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
}

// Brand-styled "more" link (used for "Összes termék", empty states, 404s) —
// replaces the Medusa UI default blue with the matcha accent.
const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className="inline-flex gap-x-1 items-center group font-heading font-bold text-sm uppercase tracking-wider text-matcha-accent hover:text-matcha transition-colors"
      href={href}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      <ArrowUpRightMini className="group-hover:rotate-45 ease-in-out duration-150" />
    </LocalizedClientLink>
  )
}

export default InteractiveLink
