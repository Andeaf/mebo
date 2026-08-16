"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const VARIANTS = [
  { id: 0, href: "/" },
  { id: 1, href: "/m1" },
  { id: 2, href: "/m2" },
  { id: 3, href: "/m3" },
  { id: 4, href: "/m4" },
] as const;

// Floating design-variant picker, shown on the m1–m4 preview routes so the
// client can flip between proposals. "0" is the current live design.
export default function VariantSwitcher() {
  const pathname = usePathname();
  const t = useTranslations("v");

  return (
    <div className="fixed bottom-4 left-1/2 z-100 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-black/70 p-1 text-white shadow-lg backdrop-blur-sm">
      <span className="px-2.5 text-[11px] font-medium tracking-wide uppercase opacity-60">
        {t("designLabel")}
      </span>
      {VARIANTS.map((v) => {
        const active =
          v.href === "/" ? pathname === "/" : pathname.startsWith(v.href);
        return (
          <Link
            key={v.id}
            href={v.href}
            aria-current={active ? "page" : undefined}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              active ? "bg-white text-black" : "hover:bg-white/20"
            }`}
          >
            {v.id}
          </Link>
        );
      })}
    </div>
  );
}
