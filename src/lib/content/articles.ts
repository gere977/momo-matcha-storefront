import type { ContentBlock } from "./pages"

// Tudástár (knowledge hub) articles, rendered at /tudastar/[slug].
//
// AEO/GEO conventions used here (see the traffic plan):
// - H2 headings are phrased as questions where natural, and the first
//   paragraph under each heading answers it directly in 1–3 sentences —
//   AI answer engines extract the first direct answer they find.
// - Every article carries visible + schema.org dates and an Article (or
//   HowTo) JSON-LD block, emitted by the route.

export type Article = {
  title: string
  description: string
  category: "Készítés & receptek" | "Matcha tudástár" | "Ízesített matcha"
  datePublished: string // ISO date
  dateModified: string // ISO date
  schemaType: "Article" | "HowTo"
  // Only for HowTo: the steps extracted for schema
  howToSteps?: { name: string; text: string }[]
  blocks: ContentBlock[]
}

const matchaKeszites: Article = {
  title: "Hogyan készíts tökéletes matchát otthon",
  description:
    "Lépésről lépésre útmutató a hagyományos matchához és a habos matcha lattéhoz — vízhőfok, habverés, gyakori hibák. Kezdőknek is.",
  category: "Készítés & receptek",
  datePublished: "2026-07-10",
  dateModified: "2026-07-10",
  schemaType: "HowTo",
  howToSteps: [
    {
      name: "Szitáld a matchát",
      text: "Szitálj 1–2 g matchát a tálba, így garantáltan csomómentes lesz.",
    },
    {
      name: "Öntsd fel vízzel",
      text: "Önts rá 70–80 ml, kb. 75–80 °C-os vizet — forrásban lévő vizet soha.",
    },
    {
      name: "Habverd fel",
      text: "Bambusz habverővel (chasen) gyors, W alakú mozdulatokkal habosítsd 15–30 másodpercig, amíg selymes hab képződik.",
    },
    {
      name: "Fogyaszd frissen",
      text: "Idd azonnal, közvetlenül a tálból — ez a rituálé lényege.",
    },
  ],
  blocks: [
    { type: "heading", text: "Mire van szükség a matcha készítéséhez?" },
    {
      type: "paragraph",
      html:
        "A matcha elkészítéséhez mindössze négy dolog kell: <strong>1–2 g ceremonial grade matcha</strong>, <strong>70–80 ml kb. 75–80 °C-os víz</strong>, egy <strong>bambusz habverő</strong> (chasen) és egy tál. A titok nem a felszerelésben van, hanem két részletben: a vízhőfokban és a habverésben.",
    },
    {
      type: "list",
      items: [
        "1–2 g (kb. fél teáskanál) ceremonial grade matcha",
        "70–80 ml forró, de nem forrásban lévő víz (kb. 75–80 °C)",
        "Bambusz habverő (chasen) — vagy szükségmegoldásként kis kézi habosító",
        "Tál (chawan) vagy szélesebb bögre, apró szűrő a csomómentességhez",
      ],
    },

    { type: "heading", text: "Milyen hőmérsékletű vízzel készül a matcha?" },
    {
      type: "paragraph",
      html:
        "A matcha ideális vízhőmérséklete <strong>75–80 °C</strong>. A forrásban lévő (100 °C-os) víz megégeti a finom teaport és keserűvé teszi — ezért a felforralt vizet hagyd 2–3 percig hűlni, mielőtt a matchára öntenéd.",
    },

    { type: "heading", text: "Hogyan készül a klasszikus matcha (usucha)?" },
    {
      type: "paragraph",
      html:
        "A klasszikus matcha négy lépésben készül: szitálás, felöntés, habverés, azonnali fogyasztás. Az egész folyamat nagyjából két perc.",
    },
    {
      type: "list",
      items: [
        "1. Szitáld a tálba a matchát — így garantáltan csomómentes lesz.",
        "2. Öntsd fel 70–80 ml, kb. 75–80 °C-os vízzel.",
        "3. Habverd a chasennel gyors, W alakú mozdulatokkal 15–30 másodpercig, amíg selymes, apró buborékos hab képződik a tetején.",
        "4. Idd frissen, közvetlenül a tálból — ez a rituálé lényege. 🍵",
      ],
    },

    { type: "heading", text: "Hogyan készül a matcha latte?" },
    {
      type: "paragraph",
      html:
        "A matcha latte alapja egy tömény matcha-koncentrátum: készítsd el a fenti receptet fele annyi (kb. 30–40 ml) vízzel, majd öntsd fel 150–200 ml habosított tejjel vagy növényi itallal — a zabtej a közönségkedvenc. Jegesen is isteni: a koncentrátumot öntsd jégkockákra, majd jöhet rá a hideg tej. Az <strong>Epres</strong> és a <strong>Csokoládés</strong> ízesített matcháink kifejezetten lattéhoz készültek.",
    },

    { type: "heading", text: "Melyek a leggyakoribb hibák matcha készítésekor?" },
    {
      type: "paragraph",
      html:
        "A négy leggyakoribb hiba: túl forró víz, kihagyott szitálás, túladagolt por és rossz tárolás. Mindegyik könnyen elkerülhető.",
    },
    {
      type: "list",
      items: [
        "Forrásban lévő víz — keserű lesz tőle. 75–80 °C az ideális.",
        "Kihagyott szitálás — csomós, egyenetlen ital az eredmény.",
        "Túl sok por — 1–2 g bőven elég egy adaghoz.",
        "Rossz tárolás — a matcha fény- és hőérzékeny; zárt dobozban, felbontás után hűtőben tartsd, és 4–6 héten belül fogyaszd el.",
      ],
    },
    {
      type: "paragraph",
      html:
        'Készen állsz az első kortyra? Nézd meg <a href="/hu/store"><strong>matcha válogatásunkat</strong></a> — mindegyik Uji teakertjeiből érkezik, és a Matcha Szettben a bambusz habverőt is megtalálod.',
    },
  ],
}

const matchaVsKave: Article = {
  title: "Matcha vs. kávé — miben más az energia?",
  description:
    "Koffein, L-teanin, fókusz és a délutáni zuhanás — őszinte összehasonlítás számokkal: mennyi koffein van a matchában, és mikor jobb választás, mint a kávé.",
  category: "Matcha tudástár",
  datePublished: "2026-07-10",
  dateModified: "2026-07-10",
  schemaType: "Article",
  blocks: [
    { type: "heading", text: "Mennyi koffein van a matchában?" },
    {
      type: "paragraph",
      html:
        "Egy adag (1–2 g) matcha kb. <strong>35–70 mg koffeint</strong> tartalmaz, míg egy átlagos kávé 80–120 mg-ot — a matcha tehát nagyjából fél kávényi koffeint ad. A különbség mégsem elsősorban a mennyiségben van, hanem abban, ahogyan a szervezeted felszívja.",
    },

    { type: "heading", text: "Mi az az L-teanin, és mit csinál?" },
    {
      type: "paragraph",
      html:
        "Az <strong>L-teanin</strong> a zöld teában természetesen előforduló aminosav, amely lassítja a koffein felszívódását. A matcha ezért sokak tapasztalata szerint egyenletesebb, nyugodtabb éberséget ad: nincs hirtelen csúcs, és jellemzően elmarad a kávé után ismerős délutáni zuhanás is — az energia fokozatosan, 4–6 óra alatt cseng le.",
    },

    { type: "heading", text: "Mikor válassz matchát, és mikor kávét?" },
    {
      type: "paragraph",
      html:
        "Röviden: hosszú, nyugodt fókuszhoz matcha, azonnali lökethez kávé. Részletesebben:",
    },
    {
      type: "list",
      items: [
        "Reggeli rituáléhoz, hosszú fókuszt kívánó munkához: matcha.",
        "Gyors, azonnali lökethez: kávé.",
        "Érzékeny gyomor vagy koffeinérzékenység esetén: a legtöbben a matchát kíméletesebbnek érzik.",
        "Délután, amikor a kávé már az alvást kockáztatná: egy gyengébb matcha jó kompromisszum lehet.",
      ],
    },

    { type: "heading", text: "Milyen az íze a kávéhoz képest?" },
    {
      type: "paragraph",
      html:
        "A jó ceremonial grade matcha természetesen édeskés, umami-gazdag, keserűség nélkül — egészen más élmény, mint a pörkölt kávé. És van egy nem mérhető összetevője is: a habverés fél perce lelassít, jelenlétre hív. A kávéfőző gombnyomás; a matcha <strong>rituálé</strong>.",
    },
    {
      type: "paragraph",
      html:
        'Kipróbálnád? Kezdd az <a href="/hu/products/original-premium-momo-matcha"><strong>Original matchánkkal</strong></a>, vagy nézd meg a <a href="/hu/store"><strong>teljes válogatást</strong></a>.',
    },
  ],
}

export const articles: Record<string, Article> = {
  "matcha-keszites": matchaKeszites,
  "matcha-vs-kave": matchaVsKave,
}

export const articleSlugs = Object.keys(articles)
