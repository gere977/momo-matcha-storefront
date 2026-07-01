import { Metadata } from "next"
import PaymentReturnContent from "@modules/checkout/components/payment-return-content"

export const metadata: Metadata = {
  title: "Fizetés megerősítése",
}

export default function PaymentReturnPage() {
  return <PaymentReturnContent />
}
