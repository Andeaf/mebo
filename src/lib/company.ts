// Central place for real-world business data used across the site.
// Source: public Mebo Keukens profile (Instagram) — verify with the owner
// before go-live, especially the KvK number and opening hours.
export const company = {
  name: "Mebo",
  legalName: "Mebo Keukens",
  siteUrl: "https://www.mebokeukens.nl",
  phone: "+31616932233",
  phoneDisplay: "+31 6 16 93 22 33",
  whatsappUrl: "https://wa.me/31616932233",
  email: "info@mebokeukens.nl",
  instagramUrl: "https://www.instagram.com/mebo.keukens/",
  instagramHandle: "@mebo.keukens",
  pinterestUrl: "https://www.pinterest.com/mebokeukens/",
  address: {
    street: "Plein 1945 50",
    postalCode: "1971 GC",
    city: "IJmuiden",
    countryCode: "NL",
  },
  kvk: "91028248",
} as const;

// The independent design studio Mebo works with on kitchen and interior design.
// Source: klaasontwerpen.com (studio page) + instagram.com/klaasontwerpen.
export const designer = {
  name: "Klaas Hilverda",
  studio: "klaasontwerpen",
  city: "Santpoort-Noord",
  foundedYear: 2000,
  websiteUrl: "https://klaasontwerpen.com/",
  websiteLabel: "klaasontwerpen.com",
  instagramUrl: "https://www.instagram.com/klaasontwerpen/",
  instagramHandle: "@klaasontwerpen",
} as const;

// The factory Mebo has its fronts and furniture components made at.
// Confirmed by the owner on 2026-09-03. Sources: global-design.ro, frontmdf.ro.
export const productionPartner = {
  name: "Global Design",
  city: "Suceava",
  // English version — the Romanian homepage is the default, /en/ is the one to link.
  websiteUrl: "https://www.global-design.ro/en/",
  websiteLabel: "global-design.ro",
  instagramUrl: "https://www.instagram.com/globaldesignsuceava/",
  instagramHandle: "@globaldesignsuceava",
} as const;
