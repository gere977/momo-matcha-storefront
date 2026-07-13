import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

// Hungarian needs the accusative here ("Válassz kiszerelést", not "Válassz
// kiszerelés"). Option titles come from product data, so map the known ones
// and fall back to a colon form that stays grammatical for anything new.
const OPTION_TITLE_ACCUSATIVE: Record<string, string> = {
  kiszerelés: "kiszerelést",
  méret: "méretet",
  szín: "színt",
  íz: "ízt",
}

const selectLabel = (title: string) => {
  const accusative = OPTION_TITLE_ACCUSATIVE[title.trim().toLowerCase()]
  return accusative ? `Válassz ${accusative}` : `Válassz: ${title}`
}

const sortNumericOptions = (values: string[]) => {
  const parsed = values.map((value) => {
    const match = /^(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l)?$/i.exec(value.trim())
    if (!match) return null

    const amount = Number(match[1].replace(",", "."))
    const unit = match[2]?.toLowerCase()
    const multiplier = unit === "kg" || unit === "l" ? 1000 : 1
    return { value, amount: amount * multiplier }
  })

  // Preserve the catalog order for flavors, colors and other non-numeric
  // options. Only size-like values benefit from a smallest-to-largest sort.
  if (parsed.some((value) => value === null)) return values

  return parsed
    .filter((entry): entry is { value: string; amount: number } => entry !== null)
    .sort((a, b) => a.amount - b.amount)
    .map((entry) => entry.value)
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = sortNumericOptions(
    (option.values ?? []).map((v) => v.value)
  )

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm font-semibold text-matcha-text">
        {selectLabel(title)}
      </span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border-matcha-kraft bg-white border text-small-regular font-semibold h-10 rounded-full p-2 flex-1 transition-colors",
                {
                  "border-matcha-accent text-matcha-accent bg-matcha-accent/10":
                    v === current,
                  "hover:border-matcha-accent/50 text-matcha-text":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
