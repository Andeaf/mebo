import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en"],
  defaultLocale: "nl",
  // Dutch lives at "/", English at "/en"
  localePrefix: "as-needed",
  // Always serve Dutch on "/" — no Accept-Language redirects. English is an
  // explicit choice via the switcher or the /en URL.
  localeDetection: false,
});
