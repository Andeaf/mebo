"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  function switchTo(nextLocale: (typeof routing.locales)[number]) {
    if (nextLocale === locale) return;
    // Preserve the current scroll target (#contact etc.) across the switch
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname}${hash}`, { locale: nextLocale, scroll: false });
  }

  return (
    <div
      aria-label={t("langAria")}
      className="flex items-center gap-1 text-xs font-medium tracking-wide text-[#A79A82]"
    >
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden>·</span>}
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === locale ? "true" : undefined}
            className={`cursor-pointer rounded-xs px-1 py-0.5 uppercase transition-colors ${
              l === locale ? "text-[#23201B]" : "hover:text-[#23201B]"
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
