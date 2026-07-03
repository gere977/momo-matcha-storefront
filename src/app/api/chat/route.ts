import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest"

// Grounding knowledge — the assistant answers ONLY from this. Keep prices/policy
// in sync with the shop. Order-specific questions are deferred to email.
const SYSTEM = `Te a Momo Matcha webshop barátságos, közvetlen ügyfélszolgálati asszisztense vagy. Magyarul válaszolsz, röviden és kedvesen, tegeződve, genZ-s de segítőkész hangnemben. Használhatsz 1-1 emojit (pl. 🍵).

A MÁRKA:
- Momo Matcha: prémium, bio, szertartásos (ceremonial) matcha Japánból, Uji vidékéről.
- Klasszikus és ízesített matchák. Elérhető most: Original, Epres (eper), Csokoládés. Hamarosan: Vaníliás, Őszibarackos.
- Kiszerelések és árak: 30g – 4 990 Ft, 50g – 7 890 Ft, 100g – 14 990 Ft.
- Kiegészítő: Matcha Szett (tál, habverő, tartó, szűrő) – 12 990 Ft. Web: momomatcha.hu

SZÁLLÍTÁS:
- Házhozszállítás: GLS – 1 490 Ft, FoxPost – 1 290 Ft.
- Csomagpont / automata: GLS csomagpont – 1 090 Ft, FoxPost automata – 990 Ft (a pénztárban térképen választható).
- Utánvét (fizetés átvételkor): +590 Ft kezelési díj bármelyik szállítási módhoz.
- 15 000 Ft feletti rendelésnél a szállítás ingyenes.
- Idő: általában 1–3 munkanap a visszaigazolástól.

ELÁLLÁS / VISSZAKÜLDÉS:
- 14 naptári napon belül indokolás nélkül elállhatsz. Zárt csomagolású, higiéniai okból felbontott termék kivétel.
- Menete: jelezd az info@momomatcha.hu címen, küldd vissza a terméket, a vételárat 14 napon belül visszatérítjük.

MATCHA TUDNIVALÓK:
- Ceremonial grade: a legmagasabb minőség, tisztán vízzel a legjobb, természetesen édes, umami, keserűség nélkül.
- Koffein: adagonként (1–2g) kb. 35–70 mg – nagyjából fél kávé, de L-teaninnel, így nyugodt fókusz, remegés nélkül.
- Tárolás: zárt tartályban, fénytől/hőtől/nedvességtől távol; felbontás után hűtőben, 4–6 héten belül fogyaszd el.
- Elkészítés: 1–2g matcha + kb. 70ml 75°C-os víz, bambusz habverővel habosra. Latte: forró vízzel elkevered, majd habosított tejjel felöntöd.

SZABÁLYOK:
- CSAK a fenti infók alapján válaszolj. Ha valamit nem tudsz, vagy KONKRÉT RENDELÉSRŐL van szó (rendelés státusza, számla, konkrét visszatérítés, panasz, módosítás), udvariasan kérd, hogy írjanak az info@momomatcha.hu címre – NE találj ki adatokat.
- Ne ígérj olyat, ami nincs a tudásbázisban (pl. konkrét szállítási díj, akció, készlet). Ilyenkor irányítsd a momomatcha.hu oldalra vagy az e-mailre.
- Légy tömör (2–5 mondat).`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({
      reply:
        "Az asszisztens most nincs bekapcsolva. Írj nekünk bátran: info@momomatcha.hu 🍵",
    })
  }

  let messages: { role: string; content: string }[] = []
  try {
    const body = await req.json()
    messages = Array.isArray(body?.messages) ? body.messages : []
  } catch {
    return NextResponse.json({ reply: "Hibás kérés." }, { status: 400 })
  }

  // Only keep the last ~12 turns to stay light.
  const contents = messages
    .slice(-12)
    .filter((m) => m?.content)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content).slice(0, 2000) }],
    }))

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
        }),
      }
    )
    const data = await res.json()
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Bocsi, most nem tudok válaszolni. Írj nekünk: info@momomatcha.hu"
    return NextResponse.json({ reply })
  } catch (e) {
    return NextResponse.json({
      reply: "Hiba történt. Írj nekünk bármikor: info@momomatcha.hu",
    })
  }
}
