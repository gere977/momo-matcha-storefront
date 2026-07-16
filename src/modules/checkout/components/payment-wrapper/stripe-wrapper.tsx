"use client"

import { Stripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { HttpTypes } from "@medusajs/types"
import { createContext } from "react"

type StripeWrapperProps = {
  paymentSession: HttpTypes.StorePaymentSession
  stripeKey?: string
  stripePromise: Promise<Stripe | null> | null
  children: React.ReactNode
}

export const StripeContext = createContext(false)

const StripeWrapper: React.FC<StripeWrapperProps> = ({
  paymentSession,
  stripeKey,
  stripePromise,
  children,
}) => {
  const options: StripeElementsOptions = {
    clientSecret: paymentSession!.data?.client_secret as string | undefined,
  }

  if (!stripeKey) {
    throw new Error(
      "Hiányzik a Stripe kulcs. Állítsd be a NEXT_PUBLIC_STRIPE_KEY környezeti változót."
    )
  }

  if (!stripePromise) {
    throw new Error(
      "A Stripe nem tölthető be. Ellenőrizd, hogy érvényes Stripe kulcsot adtál-e meg."
    )
  }

  if (!paymentSession?.data?.client_secret) {
    throw new Error(
      "Hiányzik a Stripe klienskulcs, ezért a fizetés nem indítható el."
    )
  }

  return (
    <StripeContext.Provider value={true}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  )
}

export default StripeWrapper
