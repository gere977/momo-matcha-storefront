import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Kosár",
  description: "Kosarad tartalma",
}

export default async function Cart({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ recovery?: string }>
}) {
  const { countryCode } = await params
  const { recovery } = await searchParams
  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  const customer = await retrieveCustomer()

  return (
    <CartTemplate
      cart={cart}
      customer={customer}
      countryCode={countryCode}
      recovery={
        recovery === "restored" ||
        recovery === "merged" ||
        recovery === "partial" ||
        recovery === "invalid"
          ? recovery
          : undefined
      }
    />
  )
}
