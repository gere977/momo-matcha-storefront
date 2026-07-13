"use client"

import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type NavLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  [x: string]: any
}

// Header link that highlights itself when its target is the current page,
// so visitors always know where they are in the shop.
const NavLink = ({ href, children, className, ...props }: NavLinkProps) => {
  const { countryCode } = useParams()
  const pathname = usePathname()

  const currentPath = pathname.replace(`/${countryCode}`, "") || "/"
  const isActive =
    href === "/" ? currentPath === "/" : currentPath.startsWith(href)

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "transition-colors hover:text-matcha-accent",
        isActive ? "text-matcha-accent" : "text-matcha-text",
        className
      )}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default NavLink
