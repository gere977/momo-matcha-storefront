import { publicOrderNumber } from "@lib/util/order-number"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const FULFILLMENT_STATUS_HU: Record<string, string> = {
  not_fulfilled: "Feldolgozás alatt",
  partially_fulfilled: "Részben feldolgozva",
  fulfilled: "Feldolgozva",
  partially_shipped: "Részben átadva a futárnak",
  shipped: "Átadva a futárnak",
  partially_delivered: "Részben kézbesítve",
  delivered: "Kézbesítve",
  canceled: "Törölve",
}

const PAYMENT_STATUS_HU: Record<string, string> = {
  not_paid: "Fizetésre vár",
  awaiting: "Fizetésre vár",
  authorized: "Engedélyezve",
  partially_authorized: "Részben engedélyezve",
  captured: "Fizetve",
  partially_captured: "Részben fizetve",
  partially_refunded: "Részben visszatérítve",
  refunded: "Visszatérítve",
  canceled: "Törölve",
  requires_action: "Beavatkozásra vár",
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string, map: Record<string, string>) => {
    if (map[str]) {
      return map[str]
    }
    const formatted = str.split("_").join(" ")
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <Text className="text-matcha-text">
        A rendelés visszaigazolását elküldtük a következő e-mail címre:{" "}
        <span
          className="font-semibold text-matcha-dark"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2 text-matcha-text">
        Rendelés dátuma:{" "}
        <span data-testid="order-date" className="font-semibold text-matcha-dark">
          {new Date(order.created_at).toLocaleDateString("hu-HU")}
        </span>
      </Text>
      <Text className="mt-2 text-matcha-text">
        Rendelésszám:{" "}
        <span data-testid="order-id" className="font-semibold text-matcha-accent">
          #{publicOrderNumber(order.display_id)}
        </span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text className="text-matcha-text">
              Rendelés állapota:{" "}
              <span className="text-matcha-text/60" data-testid="order-status">
                {formatStatus(order.fulfillment_status, FULFILLMENT_STATUS_HU)}
              </span>
            </Text>
            <Text className="text-matcha-text">
              Fizetés állapota:{" "}
              <span
                className="text-matcha-text/60"
                data-testid="order-payment-status"
              >
                {formatStatus(order.payment_status, PAYMENT_STATUS_HU)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
