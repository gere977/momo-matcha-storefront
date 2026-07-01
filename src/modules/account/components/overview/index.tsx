import { Container } from "@medusajs/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const getMomoPoints = (orders: HttpTypes.StoreOrder[] | null) => {
  const totalSpentHuf = (orders ?? []).reduce((sum, order) => sum + (order.total ?? 0), 0)
  return Math.floor(totalSpentHuf / 1000) * 10
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const points = getMomoPoints(orders)

  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="flex justify-between items-center mb-4">
          <span
            className="font-heading text-4xl text-matcha-accent"
            data-testid="welcome-message"
            data-value={customer?.first_name}
          >
            Szia, {customer?.first_name}!
          </span>
          <span className="text-small-regular text-matcha-text/50">
            Bejelentkezve mint:{" "}
            <span
              className="font-semibold text-matcha-text"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </span>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl text-white p-8 mb-10"
          style={{
            background: "linear-gradient(135deg, #5a7d44 0%, #2D4A1E 100%)",
          }}
        >
          <p className="text-xs font-semibold tracking-[2px] uppercase text-white/75 mb-2">
            MoMo Pontjaim
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading text-6xl leading-none">{points}</span>
            <span className="text-lg text-white/70 font-semibold">pont</span>
          </div>
          <p className="text-sm text-white/60">
            10 pont minden elköltött 1.000 Ft után - beváltás hamarosan
          </p>
        </div>

        <div className="flex flex-col py-8 border-t border-matcha-kraft/40">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="flex items-start gap-x-16 mb-6">
              <div className="flex flex-col gap-y-4">
                <h3 className="font-heading text-2xl text-matcha-text">Profil</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none text-matcha"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="uppercase text-base-regular text-matcha-text/50">
                    Kitöltve
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <h3 className="font-heading text-2xl text-matcha-text">Címek</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none text-matcha"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="uppercase text-base-regular text-matcha-text/50">
                    Mentve
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="font-heading text-2xl text-matcha-text">
                  Legutóbbi rendelések
                </h3>
              </div>
              <ul
                className="flex flex-col gap-y-4"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <Container className="bg-white border border-matcha-kraft/40 flex justify-between items-center p-4 rounded-xl">
                            <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
                              <span className="font-semibold text-matcha-text/50">Dátum</span>
                              <span className="font-semibold text-matcha-text/50">
                                Rendelésszám
                              </span>
                              <span className="font-semibold text-matcha-text/50">
                                Összeg
                              </span>
                              <span data-testid="order-created-date">
                                {new Date(order.created_at).toDateString()}
                              </span>
                              <span
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                              <span data-testid="order-amount" className="font-semibold text-matcha-dark">
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <button
                              className="flex items-center justify-between"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">
                                Go to order #{order.display_id}
                              </span>
                              <ChevronDown className="-rotate-90" />
                            </button>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span className="text-matcha-text/50" data-testid="no-orders-message">
                    Még nincs rendelésed
                  </span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
