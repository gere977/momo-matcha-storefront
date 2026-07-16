"use client"

import { OPEN_CONSENT_EVENT } from "@modules/common/components/consent-manager"

export default function ConsentSettingsButton() {
  return (
    <button
      type="button"
      className="hover:text-matcha"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    >
      Süti beállítások
    </button>
  )
}

