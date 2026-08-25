# Mebo — website

Landingspagina voor Mebo (maatwerk meubels & keukens, IJmuiden).
Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · next-intl.

## Ontwikkelen

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # productie-build (statisch)
npm run placeholders  # grijze placeholder-foto's opnieuw genereren
```

- Nederlands staat op `/`, Engels op `/en`.
- Alle teksten staan in `messages/nl.json` en `messages/en.json`.
- Echte projectfoto's: zie `public/images/projects/README.md` — bestand met
  dezelfde naam neerzetten is genoeg.
- De homepage opent met een typemachine-intro
  (`src/components/IntroTypewriter.tsx`): speelt één keer per browsersessie en
  is overslaanbaar met een klik of toets.

## Voor livegang nog invullen/controleren

- [x] **KvK-nummer** — 91028248 (Mebo CNS, vof, IJmuiden; geverifieerd in het
      KvK-register 2026-08-18) in `src/lib/company.ts` en de message-bestanden
      (`footer.kvk`).
- [x] **Openingstijden** — di–vr 11.00–16.30 (conform het Google
      Business-profiel, bevestigd 2026-08-18). Verwerkt in `messages/*.json`
      en de JSON-LD.
- [x] **Domein** — `https://www.mebokeukens.nl` is live: domein bij TransIP,
      DNS wijst naar Vercel (2026-08-17).
- [x] **Offerteformulier** — live sinds 2026-08-19: verstuurt via
      `/api/offerte` (Resend, domein geverifieerd, afzender
      `offerte@mebokeukens.nl`, aflevering in Inbox getest). Env vars in
      Vercel: `RESEND_API_KEY` en `QUOTE_FROM_EMAIL`; optioneel
      `QUOTE_TO_EMAIL` (standaard info@mebokeukens.nl). Zonder
      `RESEND_API_KEY` valt het formulier automatisch terug op mailto.
- [ ] Echte foto's plaatsen (zie hierboven).

Contactgegevens (telefoon, e-mail, adres, Instagram) komen van het openbare
Instagram-profiel `@mebo.keukens` en staan centraal in `src/lib/company.ts`.

## Bezoekersstatistieken

Vercel Web Analytics (cookieloos, geen toestemming nodig) via `<Analytics />`
in `src/app/[locale]/layout.tsx`. Cijfers bekijken: Vercel-dashboard →
project **mebo** → tabblad **Analytics** (daar eenmalig "Enable" aanklikken
als dat nog niet is gebeurd).

## Advertentiepixels & cookiebanner

De site is voorbereid op betaalde advertenties (Meta, TikTok, Google/YouTube,
Pinterest) met een AVG-conforme opt-in cookiebanner:

- **Zonder pixel-ID's gebeurt er niets**: geen advertentiescripts, geen
  cookiebanner, geen advertentiecookies. De juridische pagina's (`/privacy`
  en `/cookies`) staan er wel alvast.
- Zodra minstens één van onderstaande env vars is gezet (Vercel → Settings →
  Environment Variables, daarna redeployen), verschijnt de banner
  automatisch en laden de pixels pas **ná** een klik op "Accepteren"
  (`src/components/MarketingPixels.tsx`).
- Env vars en waar je het ID vindt:
  - `NEXT_PUBLIC_META_PIXEL_ID` — Meta Events Manager (één pixel voor
    Facebook + Instagram).
  - `NEXT_PUBLIC_TIKTOK_PIXEL_ID` — TikTok Ads Manager → Assets → Events.
  - `NEXT_PUBLIC_GOOGLE_ADS_ID` — Google Ads → Tools → Google tag
    (vorm `AW-…`); dekt ook YouTube-campagnes.
  - `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` — conversielabel voor de
    afspraakaanvraag (vorm `AW-…/…`), optioneel.
  - `NEXT_PUBLIC_PINTEREST_TAG_ID` — Pinterest Ads → Conversions.
- Bij een succesvol verstuurde afspraakaanvraag vuurt de site een
  lead-event naar elk geladen platform (`trackLead()` in
  `src/lib/marketing.ts`), zodat de algoritmes leren wie echt converteert.
- Nieuwe pixel toevoegen? Werk dan ook de cookietabel in `messages/*.json`
  (`cookiesPage`) en `PIXEL_COOKIES` in `src/lib/consent.ts` bij.
- Juridische teksten: namespaces `privacy` en `cookiesPage` in
  `messages/nl.json` / `messages/en.json`; datum "Laatst bijgewerkt"
  aanpassen bij wijzigingen.
