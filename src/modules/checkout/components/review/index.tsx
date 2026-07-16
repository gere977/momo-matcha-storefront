"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-white rounded-2xl border border-matcha-kraft/60 shadow-sm p-6 small:p-8">
      <div
        className={clx("flex flex-row items-center justify-between", {
          "mb-6": isOpen && previousStepsCompleted,
        })}
      >
        <Heading
          level="h2"
          className={clx(
            "flex flex-row font-heading text-3xl text-matcha-accent gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Összesítés
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-matcha-text/70 mb-1">
                A „Fizetési kötelezettséggel megrendelem” gombra kattintva
                elfogadod az{" "}
                <LocalizedClientLink
                  href="/pages/aszf"
                  className="font-semibold text-matcha-accent underline decoration-matcha-accent/30 underline-offset-4 hover:decoration-matcha-accent"
                >
                  Általános Szerződési Feltételeket
                </LocalizedClientLink>
                , a{" "}
                <LocalizedClientLink
                  href="/pages/refunds"
                  className="font-semibold text-matcha-accent underline decoration-matcha-accent/30 underline-offset-4 hover:decoration-matcha-accent"
                >
                  visszaküldési szabályzatot
                </LocalizedClientLink>
                , és megerősíted, hogy elolvastad az{" "}
                <LocalizedClientLink
                  href="/pages/adatkezeles"
                  className="font-semibold text-matcha-accent underline decoration-matcha-accent/30 underline-offset-4 hover:decoration-matcha-accent"
                >
                  adatkezelési tájékoztatót
                </LocalizedClientLink>
                .
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
