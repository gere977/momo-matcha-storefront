import { Container, Heading, Text } from "@medusajs/ui"
import { CreditCard } from "@medusajs/icons"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div>
      <Heading
        level="h2"
        className="flex flex-row font-heading text-2xl text-matcha-dark my-6"
      >
        Fizetés
      </Heading>
      <div>
        {payment && (
          <div className="flex items-start gap-x-1 w-full">
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-matcha-text mb-1">
                Fizetési mód
              </Text>
              <Text
                className="txt-medium text-matcha-text/60"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id]?.title ||
                  payment.provider_id}
              </Text>
            </div>
            <div className="flex flex-col w-2/3">
              <Text className="txt-medium-plus text-matcha-text mb-1">
                Fizetési részletek
              </Text>
              <div className="flex gap-2 txt-medium text-matcha-text/60 items-center">
                <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                  {paymentInfoMap[payment.provider_id]?.icon || <CreditCard />}
                </Container>
                <Text data-testid="payment-amount">
                  {isStripeLike(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} - ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleDateString("hu-HU")}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
