import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Bankkártya",
    icon: <CreditCard />,
  },
  "pp_medusa-payments_default": {
    title: "Bankkártya",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Banki átutalás",
    icon: <CreditCard />,
  },
  pp_cod_cod: {
    title: "Utánvét – fizetés átvételkor (+590 Ft)",
    icon: <CreditCard />,
  },
  pp_barion_barion: {
    title: "Barion (bankkártya)",
    icon: <CreditCard />,
  },
  // Add more payment providers here
}

// This only checks if it is native stripe or medusa payments for card payments, it ignores the other stripe-based providers
export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  // System default (bank transfer) and COD both complete the order without an
  // external gateway step.
  return (
    providerId?.startsWith("pp_system_default") ||
    providerId?.startsWith("pp_cod")
  )
}

// Barion is redirect-based: the customer is sent to the gateway's hosted page,
// then redirected back to /checkout/payment-return to finalize the order.
export const isRedirectGateway = (providerId?: string) => {
  return providerId?.startsWith("pp_barion_")
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]
