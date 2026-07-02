import React from "react"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div className="grid grid-cols-1  small:grid-cols-[240px_1fr] py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-matcha-kraft/50 py-12 gap-8">
          <div>
            <h3 className="font-heading font-bold text-2xl text-matcha-dark mb-3">
              Kérdésed van?
            </h3>
            <span className="txt-medium text-matcha-text/70">
              Gyakori kérdéseidre a GYIK szekcióban találsz választ, vagy írj
              nekünk bármikor.
            </span>
          </div>
          <div>
            <a
              href="mailto:info@momomatcha.hu"
              className="text-matcha-accent font-semibold hover:underline"
            >
              Ügyfélszolgálat →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
