export const FAQ_CATEGORIES = [
  { id: "matcha", label: "A matcháról" },
  { id: "rituale", label: "Elkészítés és tárolás" },
  { id: "rendeles", label: "Rendelés és szállítás" },
] as const

export type FaqCategory = (typeof FAQ_CATEGORIES)[number]["id"]

export type FaqItem = {
  id: string
  category: FaqCategory
  q: string
  a: string
  featured?: boolean
}

// One source of truth for the homepage preview, the full help page and
// FAQPage structured data. Only featured items are shown on the homepage.
export const FAQS: FaqItem[] = [
  {
    id: "ceremonial-grade",
    category: "matcha",
    featured: true,
    q: "Mi az a ceremonial grade matcha?",
    a: "A ceremonial grade matcha a legmagasabb minőségű matcha, amelyet az árnyékban nevelt teabokor legfiatalabb leveleiből készítenek. Kőmalommal őrlik finom porrá, természetesen édesebb, umamiban gazdag és tisztán, vízzel elkészítve is harmonikus ízű.",
  },
  {
    id: "ceremonial-vs-latte",
    category: "matcha",
    featured: true,
    q: "Mi a különbség a ceremonial és a latte grade között?",
    a: "A ceremonial grade finomabb, összetettebb ízű, ezért tisztán, vízzel is élvezetes. A latte grade karakteresebb és tejjel vagy édesítéssel is jól érvényesül. A választás elsősorban attól függ, hogyan szereted inni a matchát.",
  },
  {
    id: "koffein",
    category: "matcha",
    featured: true,
    q: "Mennyi koffeint tartalmaz a matcha?",
    a: "Egy 1–2 grammos adag jellemzően körülbelül 35–70 mg koffeint tartalmaz. A pontos mennyiség függ az adagolástól és a teától. A matchában természetesen jelen lévő L-teanin miatt sokan egyenletesebbnek érzik a hatását, mint a kávéét.",
  },
  {
    id: "szarmazas",
    category: "matcha",
    featured: true,
    q: "Honnan származik a Momo Matcha?",
    a: "Matcháink Japánból, Uji régiójából érkeznek. Uji évszázadok óta a japán teakultúra egyik legismertebb központja; klímája és árnyékolási hagyományai különösen alkalmasak prémium matcha készítésére.",
  },
  {
    id: "izesitett-matcha",
    category: "matcha",
    q: "Miben más az epres, vaníliás és csokoládés matcha?",
    a: "Mindhárom változat matcha alapú, de eltérő ízvilágot ad: az epres gyümölcsösebb, a vaníliás lágyabb, a csokoládés pedig testesebb. Vízzel is elkészíthetők, de hideg vagy meleg lattéban mutatják meg legjobban a karakterüket.",
  },
  {
    id: "elkeszites",
    category: "rituale",
    q: "Hogyan készítsem el csomómentesen?",
    a: "Szitálj 1–2 gramm matchát a tálba, adj hozzá körülbelül 50 ml, 80 °C-os vizet, majd bambusz habverővel gyors, W alakú mozdulatokkal habosítsd fel. Ezután öntsd fel további vízzel vagy tejjel.",
  },
  {
    id: "vizhomerseklet",
    category: "rituale",
    q: "Miért ne használjak forrásban lévő vizet?",
    a: "A túl forró víz keserűbbé teheti a matchát és elnyomhatja a finomabb aromákat. Körülbelül 75–80 °C-os vízzel lágyabb, kiegyensúlyozottabb ízt kapsz.",
  },
  {
    id: "tarolas",
    category: "rituale",
    featured: true,
    q: "Hogyan tároljam a matchát?",
    a: "Tartsd jól lezárva, fénytől, hőtől, nedvességtől és erős illatoktól távol. Felbontás után érdemes hűtőben tárolni, majd használat előtt néhány percig zárt dobozban szobahőmérsékletre hagyni, hogy ne csapódjon le benne pára.",
  },
  {
    id: "adagok",
    category: "rituale",
    q: "Hány adag van egy 30 grammos dobozban?",
    a: "Kétgrammos adagolással körülbelül 15, egygrammos adagolással körülbelül 30 csésze készíthető belőle. Lattéhoz általában 1,5–2 grammot, könnyebb usuchához 1–1,5 grammot érdemes használni.",
  },
  {
    id: "szallitas",
    category: "rendeles",
    q: "Mennyi idő alatt érkezik meg a rendelésem?",
    a: "A magyarországi rendelések kézbesítése jellemzően 1–3 munkanapot vesz igénybe. A pontos lehetőségeket és díjakat a pénztárban látod a szállítási cím megadása után.",
  },
  {
    id: "ingyenes-szallitas",
    category: "rendeles",
    q: "Mikortól ingyenes a szállítás?",
    a: "A szállítás 15 000 Ft feletti rendelési értéknél ingyenes. A kosárban egy folyamatjelző mutatja, mennyi hiányzik még az ingyenes szállításhoz.",
  },
  {
    id: "fizetes",
    category: "rendeles",
    q: "Milyen fizetési módok közül választhatok?",
    a: "Az aktuálisan elérhető fizetési módokat a pénztárban látod. A fizetés véglegesítése előtt minden költséget, köztük a szállítási díjat is egyértelműen feltüntetünk.",
  },
  {
    id: "visszakuldes",
    category: "rendeles",
    q: "Visszaküldhetem a terméket?",
    a: "Fogyasztóként az átvételtől számított 14 napon belül jelezheted az elállási szándékodat. Felbontott, zárt csomagolású élelmiszert higiéniai okból nem tudunk visszavenni. Részleteket a Visszaküldés oldalon találsz.",
  },
  {
    id: "serult-csomag",
    category: "rendeles",
    q: "Mit tegyek, ha sérülten érkezik a csomag?",
    a: "Fotózd le a külső csomagolást és a sérült terméket, majd írj az info@momomatcha.hu címre a rendelési számoddal. Segítünk mielőbb megoldani a problémát.",
  },
]

export const HOME_FAQS = FAQS.filter((item) => item.featured)
