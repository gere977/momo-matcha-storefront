import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "hu-HU",
}: ConvertToLocaleParams) => {
  const normalizedCurrency = currency_code?.toUpperCase()

  // Hungarian shops display forint as a whole amount with a non-breaking
  // thousands separator. Intl implementations differ on grouping four-digit
  // numbers and some still render HUF with decimals, so keep this deterministic.
  if (
    normalizedCurrency === "HUF" &&
    minimumFractionDigits === undefined &&
    maximumFractionDigits === undefined
  ) {
    const rounded = Math.round(amount)
    const sign = rounded < 0 ? "-" : ""
    const grouped = Math.abs(rounded)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")

    return `${sign}${grouped}\u00a0Ft`
  }

  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: normalizedCurrency,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}
