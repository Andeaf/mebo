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
  address: {
    street: "Plein 1945 50",
    postalCode: "1971 GC",
    city: "IJmuiden",
    countryCode: "NL",
  },
  // TODO: confirm with owner
  kvk: "00000000",
} as const;
