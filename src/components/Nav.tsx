"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import MeboLogo from "./MeboLogo";

// Hash links carry the "/" prefix so they also work from subpages like /about.
const LINKS = [
  { key: "projects", href: "/#projecten" },
  { key: "process", href: "/#werkwijze" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/#contact" },
] as const;

export default function Nav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(35,32,27,0.07)] bg-[rgba(242,232,214,0.68)] backdrop-blur-[10px]">
      <nav
        className="relative flex h-16 items-center justify-between px-5 md:px-8"
        aria-label="Mebo"
      >
        <Link
          href="/"
          aria-label={t("homeAria")}
          onClick={() => setOpen(false)}
          className="text-[#23201B]"
        >
          <MeboLogo className="h-4.5 w-auto" />
        </Link>

        {/* Desktop links — absolutely centered so uneven logo/CTA widths can't skew them */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="group relative text-sm font-medium text-[#23201B]"
            >
              {t(link.key)}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-0 bg-[#23201B] transition-all duration-300 group-hover:w-full"
              />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <LanguageSwitcher />
          <Link
            href="/#contact"
            className="rounded-sm bg-[#1D1A16] px-4 py-2 text-sm font-medium text-[#F7F3EC] transition-colors hover:bg-[#332C24]"
          >
            {t("cta")}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t("menuClose") : t("menuOpen")}
          className="flex h-10 w-10 items-center justify-center text-[#23201B] md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <path d="M2 6h16M2 14h16" stroke="currentColor" strokeWidth="1.5" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile panel — shares the header's translucent, blurred background */}
      {open && (
        <div className="border-t border-[rgba(35,32,27,0.07)] px-5 pt-2 pb-6 md:hidden">
          <div className="flex flex-col">
            {LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-[rgba(35,32,27,0.07)] py-4 text-base font-medium text-[#23201B]"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="rounded-sm bg-[#1D1A16] px-4 py-2.5 text-sm font-medium text-[#F7F3EC] transition-colors hover:bg-[#332C24]"
            >
              {t("cta")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
