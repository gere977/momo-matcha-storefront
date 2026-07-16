import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import CartCrossSell from "../components/cart-cross-sell"
import { HttpTypes } from "@medusajs/types"
import { Suspense } from "react"

const CartTemplate = ({
  cart,
  customer,
  countryCode,
  recovery,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  countryCode: string
  recovery?: "restored" | "merged" | "partial" | "invalid"
}) => {
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {recovery && (
          <div
            role="status"
            className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-semibold ${
              recovery === "restored" || recovery === "merged"
                ? "border-matcha/25 bg-matcha-mist text-matcha-dark"
                : "border-matcha-kraft bg-white text-matcha-text"
            }`}
          >
            {recovery === "restored"
              ? "Visszatettük a mentett kosarad — ott folytathatod, ahol abbahagytad."
              : recovery === "merged"
              ? "A mentett termékeket hozzáadtuk a jelenlegi kosaradhoz — semmi nem veszett el."
              : recovery === "partial"
              ? "A mentett kosár egy részét visszatettük, de valamelyik tétel már nem elérhető."
              : "Ez a kosár-visszaállító link lejárt vagy már nem használható. A jelenlegi kosarad mutatjuk."}
          </div>
        )}
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-12 gap-y-8">
            <div className="flex flex-col bg-white rounded-2xl border border-matcha-kraft/60 shadow-sm p-6 small:p-8 gap-y-6 h-fit">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
              <Divider />
              <Suspense fallback={null}>
                <CartCrossSell cart={cart} countryCode={countryCode} />
              </Suspense>
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && <Summary cart={cart as any} />}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
