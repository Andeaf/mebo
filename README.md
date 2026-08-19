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
