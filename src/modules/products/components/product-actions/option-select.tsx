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

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

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
