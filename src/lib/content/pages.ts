// Static content pages (ÁSZF, shipping, refunds, about) rendered by
// src/app/[countryCode]/(main)/pages/[slug]/page.tsx.
//
// Kept as structured data (not JSX) so the copy is easy to edit in one place
// and can later be swapped for a CMS / Medusa data source without touching the
// route. Paragraph `html` is authored by us and therefore trusted — it is
// rendered via dangerouslySetInnerHTML to allow simple inline <strong>/<a>/<br>.
//
// Public operator details. The tax/registration/phone values intentionally
// have no made-up fallback: add them in Vercel before legal sign-off and they
// will appear automatically on the legal pages.
const OPERATOR_NAME =
  process.env.NEXT_PUBLIC_LEGAL_NAME ||
  "Gere Viktor Sándor egyéni vállalkozó"
const OPERATOR_ADDRESS =
  process.env.NEXT_PUBLIC_LEGAL_ADDRESS ||
  "2321 Szigetbecse, Erdősor utca 9."
const OPERATOR_EMAIL =
  process.env.NEXT_PUBLIC_LEGAL_EMAIL || "info@momomatcha.hu"
const OPERATOR_TAX_NUMBER = process.env.NEXT_PUBLIC_LEGAL_TAX_NUMBER
const OPERATOR_REGISTRATION_NUMBER =
  process.env.NEXT_PUBLIC_LEGAL_REGISTRATION_NUMBER
const OPERATOR_PHONE = process.env.NEXT_PUBLIC_LEGAL_PHONE

const operatorDetails = [
  `Név: <strong>${OPERATOR_NAME}</strong>`,
  `Székhely: <strong>${OPERATOR_ADDRESS}</strong>`,
  OPERATOR_TAX_NUMBER
    ? `Adószám: <strong>${OPERATOR_TAX_NUMBER}</strong>`
    : "",
  OPERATOR_REGISTRATION_NUMBER
    ? `Egyéni vállalkozói nyilvántartási szám: <strong>${OPERATOR_REGISTRATION_NUMBER}</strong>`
    : "",
  `E-mail: <strong><a href="mailto:${OPERATOR_EMAIL}">${OPERATOR_EMAIL}</a></strong>`,
  OPERATOR_PHONE ? `Telefonszám: <strong>${OPERATOR_PHONE}</strong>` : "",
]
  .filter(Boolean)
  .join("<br>")

export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; html: string }
  | { type: "list"; items: string[] }

export type ContentPage = {
  title: string
  subtitle?: string
  updated?: string
  blocks: ContentBlock[]
}

const aszf: ContentPage = {
  title: "Általános Szerződési Feltételek",
  updated: "Utolsó frissítés: 2026. július 16.",
  blocks: [
    { type: "heading", text: "1. Az Üzemeltető adatai" },
    {
      type: "paragraph",
      html: operatorDetails,
    },

    { type: "heading", text: "2. Az ÁSZF hatálya és elfogadása" },
    {
      type: "paragraph",
      html:
        `Jelen Általános Szerződési Feltételek (továbbiakban: ÁSZF) a <strong>${OPERATOR_NAME}</strong> (továbbiakban: Szolgáltató) által üzemeltetett <strong>momomatcha.hu</strong> weboldalon (továbbiakban: Webáruház) elérhető szolgáltatások igénybevételének feltételeit tartalmazza.`,
    },
    {
      type: "paragraph",
      html:
        "A Webáruházban leadott megrendeléssel a Vásárló elfogadja jelen ÁSZF rendelkezéseit. Az ÁSZF visszavonásig érvényes. A Szolgáltató fenntartja a jogot az ÁSZF egyoldalú módosítására; a módosításokat a weboldalon közzéteszi.",
    },

    { type: "heading", text: "3. A megrendelés folyamata" },
    {
      type: "paragraph",
      html:
        "3.1. A Vásárló a kívánt terméket a kosárba helyezi, majd a „Fizetés” gombra kattintva megadja a szállítási és számlázási adatait, kiválasztja a fizetési módot, és a megrendelést véglegesíti.",
    },
    {
      type: "paragraph",
      html:
        "3.2. A megrendelés leadásával a Vásárló ajánlatot tesz a Szolgáltatónak. A szerződés akkor jön létre, amikor a Szolgáltató a megrendelést visszaigazoló e-mailt küld a Vásárló által megadott e-mail-címre.",
    },
    {
      type: "paragraph",
      html:
        "3.3. A visszaigazoló e-mail tartalmazza a megrendelt termékek megnevezését, mennyiségét, egységárát, a szállítási díjat és a fizetendő végösszeget.",
    },
    {
      type: "paragraph",
      html:
        `3.4. A Szolgáltató nem vállal felelősséget a hibásan megadott adatokból eredő következményekért. Elgépelés esetén a Vásárló a visszaigazolás kézhezvételét követően haladéktalanul értesítheti a Szolgáltatót az <a href="mailto:${OPERATOR_EMAIL}">${OPERATOR_EMAIL}</a> e-mail-címen.`,
    },

    { type: "heading", text: "4. Árak és fizetés" },
    {
      type: "paragraph",
      html:
        "4.1. Az oldalon feltüntetett árak bruttó árak, tartalmazzák az általános forgalmi adót (ÁFA). A szállítási díj összege a pénztárban kerül feltüntetésre.",
    },
    {
      type: "paragraph",
      html:
        "4.2. Elfogadott fizetési módok: bankkártyás online fizetés (Visa, Mastercard), utánvét (készpénz a futárnak), valamint banki átutalás.",
    },
    {
      type: "paragraph",
      html:
        "4.3. A Szolgáltató fenntartja a jogot az árak megváltoztatására. A módosítás a már visszaigazolt megrendeléseket nem érinti.",
    },

    { type: "heading", text: "5. Szállítás" },
    {
      type: "paragraph",
      html:
        "5.1. A Szolgáltató Magyarország területére vállal szállítást. A szállítási idő általában 1–3 munkanap a megrendelés visszaigazolásától számítva.",
    },
    {
      type: "paragraph",
      html:
        "5.2. A szállítási díj összege az aktuálisan érvényes szállítási díjszabás szerint alakul, amelyet a pénztár oldalon tüntetünk fel. Meghatározott összeg feletti rendelés esetén a szállítás ingyenes (a mindenkori küszöbértéket a Webáruház bejelentési sávja tartalmazza).",
    },
    {
      type: "paragraph",
      html:
        "5.3. A csomag átvételekor a Vásárló köteles ellenőrizni annak épségét. Sérült csomagolás esetén a Vásárló kérheti a csomag felbontásának dokumentálását a futár jelenlétében.",
    },

    { type: "heading", text: "6. Elállási jog" },
    {
      type: "paragraph",
      html:
        "6.1. A fogyasztónak minősülő Vásárló a 45/2014. (II. 26.) Korm. rendelet alapján a termék átvételétől számított <strong>14 naptári napon belül</strong> indokolás nélkül elállhat a szerződéstől.",
    },
    {
      type: "paragraph",
      html:
        `6.2. Az elállási szándékát a Vásárló az <a href="mailto:${OPERATOR_EMAIL}">${OPERATOR_EMAIL}</a> e-mail-címen vagy postai úton jelezheti a Szolgáltató felé. Az elállás határidőben érvényesítettnek minősül, ha a Vásárló az értesítést a 14 napos határidő lejárta előtt elküldi.`,
    },
    {
      type: "paragraph",
      html:
        "6.3. Elállás esetén a Vásárló köteles a terméket haladéktalanul, de legkésőbb az elállás közlésétől számított 14 napon belül visszaküldeni. A visszaküldés közvetlen költsége a Vásárlót terheli.",
    },
    {
      type: "paragraph",
      html:
        "6.4. A Szolgáltató a visszaérkező termék megérkezésétől vagy a visszaküldés igazolásától számított 14 napon belül visszatéríti a vételárat és az eredeti szállítási díjat, az eredeti fizetési módon.",
    },
    {
      type: "paragraph",
      html:
        "6.5. Az elállási jog nem illeti meg a Vásárlót olyan zárt csomagolású termék esetén, amelyet egészségvédelmi vagy higiéniai okokból a Vásárló felbontott.",
    },

    { type: "heading", text: "7. Szavatosság és jótállás" },
    {
      type: "paragraph",
      html:
        "7.1. A Szolgáltató hibás teljesítés esetén kellékszavatossággal tartozik a Polgári Törvénykönyv és a vonatkozó jogszabályok szerint.",
    },
    {
      type: "paragraph",
      html:
        "7.2. Kellékszavatossági igény esetén a Vásárló – választása szerint – kijavítást, kicserélést kérhet, illetve árcsökkentést igényelhet, végső soron elállhat a szerződéstől.",
    },
    {
      type: "paragraph",
      html:
        "7.3. A szavatossági igény érvényesítésének határideje a teljesítés napjától számított két év.",
    },

    { type: "heading", text: "8. Adatkezelés" },
    {
      type: "paragraph",
      html:
        'A személyes adatok kezelésének céljait, jogalapját, időtartamát és az érintetti jogokat az <a href="/hu/pages/adatkezeles">Adatkezelési és süti tájékoztató</a> tartalmazza.',
    },

    { type: "heading", text: "9. Panaszkezelés és jogvita" },
    {
      type: "paragraph",
      html:
        `9.1. Panasz vagy reklamáció esetén a Vásárló az <a href="mailto:${OPERATOR_EMAIL}">${OPERATOR_EMAIL}</a> e-mail-címen${
          OPERATOR_PHONE ? `, illetve a ${OPERATOR_PHONE} telefonszámon` : ""
        } keresheti a Szolgáltatót. A Szolgáltató a panaszt 30 napon belül megvizsgálja és írásban válaszol.`,
    },
    {
      type: "paragraph",
      html:
        '9.2. A Vásárló panasza esetén igénybe veheti a területileg illetékes békéltető testület eljárását. Bővebb információ: <a href="https://bekeltetes.hu" target="_blank" rel="noopener">bekeltetes.hu</a>.',
    },
    {
      type: "paragraph",
      html:
        '9.3. Az Európai Unió online vitarendezési platformja: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">ec.europa.eu/consumers/odr</a>.',
    },
    {
      type: "paragraph",
      html:
        "9.4. Jelen ÁSZF-re a magyar jog az irányadó. A felek közötti jogvitát — amennyiben egyezség nem jön létre — a hatáskörrel és illetékességgel rendelkező magyar bíróság dönti el.",
    },

    { type: "heading", text: "10. Vegyes rendelkezések" },
    {
      type: "paragraph",
      html:
        "10.1. A Webáruházon megjelenő képek illusztrációk lehetnek; a tényleges termék megjelenése kis mértékben eltérhet.",
    },
    {
      type: "paragraph",
      html:
        "10.2. A Szolgáltató nem felel az internet-hozzáférési problémákból, vírusfertőzésből vagy más, a Vásárló eszközéből eredő hibákból fakadó károkért.",
    },
    {
      type: "paragraph",
      html:
        "10.3. Jelen ÁSZF-ben nem szabályozott kérdésekben a Polgári Törvénykönyvről szóló 2013. évi V. törvény, a 45/2014. (II. 26.) Korm. rendelet, az elektronikus kereskedelmi szolgáltatásokról szóló 2001. évi CVIII. törvény, valamint az egyéb vonatkozó magyar és EU jogszabályok rendelkezései az irányadók.",
    },
  ],
}

const shipping: ContentPage = {
  title: "Szállítás és átvétel",
  subtitle: "Hogyan jut el hozzád a matchád",
  blocks: [
    { type: "heading", text: "Szállítási terület és idő" },
    {
      type: "paragraph",
      html:
        "Magyarország egész területére szállítunk. A csomagokat a megrendelés visszaigazolását követő <strong>1–3 munkanapon</strong> belül adjuk fel; az átfutási idő futárszolgálattól függően jellemzően további 1–2 munkanap.",
    },

    { type: "heading", text: "Szállítási módok és díjak" },
    {
      type: "paragraph",
      html: "Rendelésedet az alábbi módokon kézbesítjük:",
    },
    {
      type: "list",
      items: [
        "Futárszolgálat (házhozszállítás) — a díj a pénztárban, a szállítási cím megadása után jelenik meg.",
        "Csomagautomata — kényelmes átvétel a hozzád legközelebbi ponton.",
        "Egy meghatározott rendelési összeg felett a szállítás ingyenes; a mindenkori küszöbértéket az oldal tetején lévő sáv mutatja.",
      ],
    },

    { type: "heading", text: "A csomag átvétele" },
    {
      type: "paragraph",
      html:
        `Átvételkor kérjük, ellenőrizd a csomag épségét. Sérült csomagolás esetén kérheted a felbontás dokumentálását a futár jelenlétében, és jelezd felénk az <a href="mailto:${OPERATOR_EMAIL}">${OPERATOR_EMAIL}</a> címen, hogy mielőbb megoldást találjunk.`,
    },

    { type: "heading", text: "Kérdésed van?" },
    {
      type: "paragraph",
      html:
        `Írj nekünk az <a href="mailto:${OPERATOR_EMAIL}">${OPERATOR_EMAIL}</a> címre — igyekszünk minden megkeresésre egy munkanapon belül válaszolni.`,
    },
  ],
}

const refunds: ContentPage = {
  title: "Elállás és visszaküldés",
  subtitle: "14 napos, indokolás nélküli elállási jog",
  blocks: [
    { type: "heading", text: "Elállási jog" },
    {
      type: "paragraph",
      html:
        "Fogyasztóként a 45/2014. (II. 26.) Korm. rendelet alapján a termék átvételétől számított <strong>14 naptári napon belül</strong> indokolás nélkül elállhatsz a vásárlástól.",
    },

    { type: "heading", text: "Hogyan jelezd az elállást?" },
    {
      type: "paragraph",
      html:
        `Elállási szándékodat az <a href="mailto:${OPERATOR_EMAIL}">${OPERATOR_EMAIL}</a> e-mail-címen vagy postai úton jelezheted. Az elállás határidőben érvényesítettnek minősül, ha az értesítést a 14 napos határidő lejárta előtt elküldöd.`,
    },

    { type: "heading", text: "A termék visszaküldése" },
    {
      type: "paragraph",
      html:
        "Elállás esetén a terméket haladéktalanul, de legkésőbb az elállás közlésétől számított 14 napon belül küldd vissza. A visszaküldés közvetlen költsége téged terhel.",
    },

    { type: "heading", text: "A vételár visszatérítése" },
    {
      type: "paragraph",
      html:
        "A visszaérkező termék megérkezésétől — vagy a visszaküldés igazolásától — számított 14 napon belül visszatérítjük a vételárat és az eredeti szállítási díjat, az eredeti fizetési móddal megegyező módon.",
    },

    { type: "heading", text: "Kivételek" },
    {
      type: "paragraph",
      html:
        "Az elállási jog nem gyakorolható olyan zárt csomagolású termék esetén, amelyet egészségvédelmi vagy higiéniai okból a felbontás után nem lehet visszaküldeni.",
    },
  ],
}

const privacy: ContentPage = {
  title: "Adatkezelési és süti tájékoztató",
  subtitle: "Érthetően arról, milyen adatot miért kezelünk",
  updated: "Utolsó frissítés: 2026. július 16.",
  blocks: [
    { type: "heading", text: "1. Ki kezeli az adataidat?" },
    {
      type: "paragraph",
      html: `${operatorDetails}<br><br>Adatvédelmi kérdés vagy érintetti kérelem esetén írj az <a href="mailto:${OPERATOR_EMAIL}">${OPERATOR_EMAIL}</a> címre.`,
    },
    { type: "heading", text: "2. Milyen adatokat és miért kezelünk?" },
    {
      type: "list",
      items: [
        "Rendelés teljesítése: név, e-mail, telefonszám, szállítási és számlázási adatok, rendelési és fizetési státusz. Jogalapja a szerződés teljesítése és a kapcsolódó jogi kötelezettségek teljesítése.",
        "Vásárlói fiók: a regisztráció és a rendelési előzmények megjelenítéséhez szükséges adatok. Jogalapja a szerződés teljesítése, illetve a fiók létrehozására irányuló kérésed.",
        "Ügyfélszolgálat és panaszkezelés: a megkeresésed tartalma és elérhetőséged. Jogalapja a szerződés teljesítése, jogi kötelezettség vagy jogos érdek.",
        "Hírlevél és várólista: az e-mail-címed, a feliratkozás forrása, időpontja és hozzájárulási státusza. Jogalapja a hozzájárulásod, amelyet bármikor visszavonhatsz.",
        "Termékértékelés: név vagy megjelenített név, csillagérték, szöveges vélemény és a kapcsolódó termék/rendelés azonosítója. A publikálás moderálás után történik.",
        "Webshop működése és biztonsága: munkamenet-, kosár- és régióazonosítók, valamint korlátozott technikai naplók. Jogalapja a szolgáltatás működtetéséhez fűződő jogos érdek, illetve a szerződés teljesítése.",
        "Hozzájárulásos analitika és hirdetési mérés: csak az elfogadásod után aktivált mérési azonosítók és események. Ezeket a süti beállításaidnál bármikor kikapcsolhatod.",
      ],
    },
    { type: "heading", text: "3. Mennyi ideig őrizzük meg?" },
    {
      type: "paragraph",
      html:
        "A rendelési és számlázási adatokat a vonatkozó számviteli és adójogi megőrzési idő végéig; a fiókadataidat a fiók törléséig; a hozzájáruláson alapuló marketingadatokat a leiratkozásig; a saját, személyazonosításra nem törekvő forgalmi eseményeket legfeljebb 90 napig kezeljük. Panasz esetén az adatokat a jogi igények érvényesíthetőségéhez szükséges ideig őrizzük meg.",
    },
    { type: "heading", text: "4. Kik segítenek a szolgáltatásban?" },
    {
      type: "paragraph",
      html:
        "A webshop működéséhez adatfeldolgozókat veszünk igénybe, különösen a tárhely és alkalmazásfuttatás (Vercel, Railway), adatbázis (Neon), e-mail-küldés (Resend), online fizetés (Barion), valamint kézbesítés (a pénztárban kiválasztott futárszolgálat) területén. Hozzájárulásod esetén a forgalmi és hirdetési események mérésében a Google Analytics és a Meta Platforms eszközei is részt vehetnek. Csak a feladat elvégzéséhez szükséges adatokat adjuk át. Harmadik országba történő adattovábbításnál a szolgáltató által biztosított, GDPR szerinti megfelelő garanciákra támaszkodunk.",
    },
    { type: "heading", text: "5. Sütik és hasonló technológiák" },
    {
      type: "paragraph",
      html:
        "A feltétlenül szükséges sütik tartják meg a kosarat, a munkamenetet, a kiválasztott régiót és a biztonsági beállításokat; ezek nélkül a webshop nem működik megfelelően. Analitikai és hirdetési sütit csak előzetes hozzájárulás után használunk. A választásodat a süti beállításoknál később is módosíthatod.",
    },
    { type: "heading", text: "6. Milyen jogaid vannak?" },
    {
      type: "list",
      items: [
        "Tájékoztatást és másolatot kérhetsz a rólad kezelt adatokról.",
        "Kérheted a pontatlan adatok helyesbítését, valamint – a jogszabályi korlátok között – a törlést vagy a kezelés korlátozását.",
        "Tiltakozhatsz a jogos érdeken alapuló adatkezelés ellen, és kérheted az adathordozhatóságot.",
        "A hozzájárulásodat bármikor visszavonhatod; ez nem érinti a visszavonás előtti adatkezelés jogszerűségét.",
        "Panaszt tehetsz a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH), vagy bírósághoz fordulhatsz.",
      ],
    },
    {
      type: "paragraph",
      html:
        'NAIH: <a href="https://www.naih.hu" target="_blank" rel="noopener">naih.hu</a>. Kérelmedre indokolatlan késedelem nélkül, legkésőbb a jogszabályban meghatározott határidőn belül válaszolunk.',
    },
  ],
}

const about: ContentPage = {
  title: "A mi történetünk",
  subtitle: "Rituálék a lassú élethez",
  blocks: [
    {
      type: "paragraph",
      html:
        "A Momo Matcha egy egyszerű meggyőződésből született: a reggel akkor a legszebb, ha nem rohanunk át rajta. Egy csésze jól elkészített matcha lelassít, jelenlétre hív — apró rituálé, ami az egész napodnak irányt ad.",
    },

    { type: "heading", text: "Japánból a mindennapokba" },
    {
      type: "paragraph",
      html:
        "A Momo célja, hogy a japán matcha ne egy bonyolult, távoli szertartás legyen, hanem egy könnyen elkészíthető, szerethető napi pillanat. A pontos származási és minősítési adatokat minden termék saját oldalán tüntetjük fel.",
    },

    { type: "heading", text: "Amit fontosnak tartunk" },
    {
      type: "list",
      items: [
        "Őszinte termékinformáció — az összetevőket és elkészítési módot könnyen megtalálod.",
        "Frissesség — jól záródó fémdobozban, fénytől és nedvességtől védve.",
        "Kísérletezés — klasszikus és játékos ízek, forrón vagy jéggel.",
      ],
    },

    { type: "heading", text: "Találd meg a rituálédat" },
    {
      type: "paragraph",
      html:
        "Akár most ismerkedsz a matchával, akár régi kedvenced — segítünk megtalálni a hozzád illő szertartást. Fedezd fel válogatásunkat, és lassíts le velünk egy csésze mellett.",
    },
  ],
}

export const contentPages: Record<string, ContentPage> = {
  aszf,
  adatkezeles: privacy,
  shipping,
  refunds,
  about,
}

export const contentPageSlugs = Object.keys(contentPages)
