import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import CheckoutAnalytics from "@modules/checkout/components/checkout-analytics"

export const metadata: Metadata = {
  title: "Pénztár",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-16 py-12">
      <CheckoutAnalytics
        cartId={cart.id}
        value={Number(cart.total ?? 0)}
        currency={cart.currency_code}
        items={(cart.items ?? []).map((item) => ({
          id: item.variant_id ?? item.id,
          name: item.product_title ?? item.title,
          price: Number(item.unit_price ?? 0),
          quantity: item.quantity,
        }))}
      />
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
