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

## Design-varianten (klantpresentatie)

Naast het huidige design (`/`) staan er vier alternatieve voorstellen op
`/m1` t/m `/m4` (zelfde teksten, foto's en talen; alleen het design verschilt):

| Route | Richting | Referentie |
| ----- | -------- | ---------- |
| `/m1` | Warm crème + oranje, serif, scroll-animaties (in én uit) | godaylight.com |
| `/m2` | Full-screen foto, typemachine-letter, hover-lijst met wisselende foto's | bureaurouge.com |
| `/m3` | Zwart portfolio, vaste kop links, genummerd werk, radiaal menu | caverzasio.ch |
| `/m4` | Wit minimalistisch, typemachine-intro, fotocollage, groot woordmerk | danielblue.com |

Onderaan elke variant zit een zwevende switcher (0 = huidig design) om snel te
vergelijken. De varianten staan op `noindex` en kunnen na de keuze verwijderd
worden: map `src/app/[locale]/m*` + `src/components/variants/` weggooien, het
`v`-blok uit beide message-bestanden halen en de m1–m4-tokens uit
`globals.css`/`variantFonts.ts` opruimen.

## Voor livegang nog invullen/controleren

- [ ] **KvK-nummer** — staat nu als `00000000` in `src/lib/company.ts` en in de
      message-bestanden (`footer.kvk`).
- [x] **Openingstijden** — bevestigd door eigenaar (2026-08-11): ma–vr
      11.00–16.30. Verwerkt in `messages/*.json` en de JSON-LD. Let op: het
      Google Business-profiel staat op di–vr — dag-bereik daar nog gelijktrekken.
- [ ] **Domein** — overal is uitgegaan van `https://www.mebokeukens.nl`
      (`src/lib/company.ts`).
- [ ] **Contactformulier** — opent nu het e-mailprogramma van de bezoeker
      (mailto). Later aansluiten op Formspree/Resend: zie `TODO` in
      `src/components/ContactSection.tsx`.
- [ ] Echte foto's plaatsen (zie hierboven).

Contactgegevens (telefoon, e-mail, adres, Instagram) komen van het openbare
Instagram-profiel `@mebo.keukens` en staan centraal in `src/lib/company.ts`.
