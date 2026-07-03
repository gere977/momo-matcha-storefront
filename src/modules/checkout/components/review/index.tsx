"use client"

import { Heading, Text, clx } from "@medusajs/ui"

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
                A Rendelés leadása gombra kattintva elfogadod az Általános
                Szerződési Feltételeinket és a Visszaküldési szabályzatunkat,
                valamint megerősíted, hogy elolvastad az Adatvédelmi
                szabályzatunkat.
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
