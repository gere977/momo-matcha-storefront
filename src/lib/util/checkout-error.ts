export function toHungarianCheckoutError(error: unknown): string {
  const message = String(
    typeof error === "object" && error && "message" in error
      ? (error as { message?: unknown }).message
      : error ?? ""
  ).toLowerCase()

  if (message.includes("declin") || message.includes("do not honor")) {
    return "A bank elutasította a fizetést. Próbálj másik kártyát vagy fizetési módot."
  }
  if (message.includes("insufficient") || message.includes("fund")) {
    return "Nincs elegendő fedezet a kártyán. Próbálj másik fizetési módot."
  }
  if (message.includes("expired")) {
    return "A kártya lejárt. Ellenőrizd az adatokat vagy használj másik kártyát."
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "Megszakadt a kapcsolat. Ellenőrizd az internetet, majd próbáld újra."
  }
  if (message.includes("cart") && message.includes("complete")) {
    return "Ezt a kosarat már lezártuk. Frissítsd az oldalt a rendelés ellenőrzéséhez."
  }

  return "A fizetést most nem sikerült elindítani. Próbáld újra, vagy írj az info@momomatcha.hu címre."
}
