import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import OrderAnalytics from "@modules/order/components/order-analytics"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <OrderAnalytics
        orderId={order.id}
        value={Number(order.item_total ?? order.total ?? 0) - Number(order.discount_total ?? 0)}
        currency={order.currency_code || "huf"}
        items={(order.items ?? []).map((item) => ({
          id: item.variant_sku || item.variant_id || item.product_id || item.id,
          name: item.product_title || item.title,
          price: Number(item.unit_price ?? 0),
          quantity: Number(item.quantity ?? 1),
        }))}
      />
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full rounded-2xl border border-matcha-kraft/60 shadow-sm p-6 small:p-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-2 mb-4"
          >
            <span className="font-heading font-bold text-4xl text-matcha-accent">
              Köszönjük! 🍵
            </span>
            <span className="font-heading text-2xl text-matcha-dark">
              A rendelésed sikeresen leadva.
            </span>
          </Heading>
          <OrderDetails order={order} />
          <Heading
            level="h2"
            className="flex flex-row font-heading text-2xl text-matcha-dark mt-4"
          >
            Összesítő
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
