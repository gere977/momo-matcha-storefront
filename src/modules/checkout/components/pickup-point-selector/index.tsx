"use client"

import { useEffect, useRef } from "react"
import React from "react"

export type PickupPoint = {
  carrier: "gls" | "foxpost"
  id: string
  name: string
  address: string
}

type PickupPointSelectorProps = {
  carrier: "gls" | "foxpost"
  onSelect: (point: PickupPoint) => void
}

const GLS_WIDGET_SRC = "https://map.gls-hungary.com/widget/gls-dpm.js"

// Official carrier map pickers:
// - FoxPost: iframe apt-finder, the selected locker arrives via postMessage
//   as a JSON string (https://cdn.foxpost.hu/apt-finder/v1/documentation/)
// - GLS: <gls-dpm> web component, fires a "change" CustomEvent with the
//   selected delivery point in event.detail (map.gls-hungary.com/widget)
const PickupPointSelector = ({ carrier, onSelect }: PickupPointSelectorProps) => {
  const glsRef = useRef<HTMLElement | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // FoxPost: listen for the locker the customer picks inside the iframe
  useEffect(() => {
    if (carrier !== "foxpost") {
      return
    }

    const handler = (event: MessageEvent) => {
      if (!String(event.origin).includes("foxpost.hu")) {
        return
      }
      try {
        const apt =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data
        if (apt?.place_id || apt?.operator_id) {
          onSelectRef.current({
            carrier: "foxpost",
            id: String(apt.place_id ?? apt.operator_id),
            name: apt.name ?? "FoxPost automata",
            address: [apt.zip, apt.city, apt.street ?? apt.address]
              .filter(Boolean)
              .join(" "),
          })
        }
      } catch {
        // not a locker-selection message
      }
    }

    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [carrier])

  // GLS: inject the widget script once and listen for selection changes
  useEffect(() => {
    if (carrier !== "gls") {
      return
    }

    if (!document.querySelector(`script[src="${GLS_WIDGET_SRC}"]`)) {
      const script = document.createElement("script")
      script.src = GLS_WIDGET_SRC
      script.async = true
      document.body.appendChild(script)
    }

    const el = glsRef.current
    if (!el) {
      return
    }

    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (!detail) {
        return
      }
      const contact = detail.contact ?? {}
      onSelectRef.current({
        carrier: "gls",
        id: String(detail.id ?? detail.pclshopid ?? ""),
        name: detail.name ?? "GLS csomagpont",
        address: [
          contact.postalCode ?? detail.zipcode,
          contact.city ?? detail.city,
          contact.address ?? detail.address,
        ]
          .filter(Boolean)
          .join(" "),
      })
    }

    el.addEventListener("change", handler)
    return () => el.removeEventListener("change", handler)
  }, [carrier])

  return (
    <div className="rounded-xl border border-matcha-kraft/60 overflow-hidden mb-4">
      <div className="bg-matcha-cream px-4 py-3 text-sm font-semibold text-matcha-dark">
        {carrier === "foxpost"
          ? "Válaszd ki a FoxPost automatát a térképen"
          : "Válaszd ki a GLS csomagpontot a térképen"}
      </div>
      {carrier === "foxpost" ? (
        <iframe
          src="https://cdn.foxpost.hu/apt-finder/v1/app/"
          title="FoxPost automata kereső"
          className="w-full border-0"
          style={{ height: 480 }}
          loading="lazy"
        />
      ) : (
        <div style={{ height: 480 }}>
          {React.createElement("gls-dpm", {
            ref: glsRef,
            country: "HU",
            style: { width: "100%", height: "100%", display: "block" },
          })}
        </div>
      )}
    </div>
  )
}

export default PickupPointSelector
