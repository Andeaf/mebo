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

## Voor livegang nog invullen/controleren

- [ ] **KvK-nummer** — staat nu als `00000000` in `src/lib/company.ts` en in de
      message-bestanden (`footer.kvk`).
- [ ] **Openingstijden** — nu "ma–vr 09.00–17.30, za op afspraak" (aanname);
      aanpassen in `messages/*.json` (`contact.hoursValue`) en in de JSON-LD in
      `src/app/[locale]/page.tsx`.
- [ ] **Domein** — overal is uitgegaan van `https://www.mebokeukens.nl`
      (`src/lib/company.ts`).
- [ ] **Contactformulier** — opent nu het e-mailprogramma van de bezoeker
      (mailto). Later aansluiten op Formspree/Resend: zie `TODO` in
      `src/components/ContactSection.tsx`.
- [ ] Echte foto's plaatsen (zie hierboven).

Contactgegevens (telefoon, e-mail, adres, Instagram) komen van het openbare
Instagram-profiel `@mebo.keukens` en staan centraal in `src/lib/company.ts`.
