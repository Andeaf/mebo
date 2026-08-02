"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const LINKS = [
  { key: "projects", href: "#projecten" },
  { key: "process", href: "#werkwijze" },
  { key: "contact", href: "#contact" },
] as const;

export default function Nav() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid style once scrolled or when the mobile menu is open
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-line bg-cream/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-350 items-center justify-between px-5 md:px-8"
        aria-label="Mebo"
      >
        <a
          href="#top"
          aria-label={t("homeAria")}
          onClick={() => setOpen(false)}
          className={`text-xl font-semibold lowercase tracking-tight-3 transition-colors ${
            solid ? "text-ink" : "text-white"
          }`}
        >
          mebo
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={`group relative text-sm font-medium transition-colors ${
                solid ? "text-ink-soft hover:text-ink" : "text-white/80 hover:text-white"
              }`}
            >
              {t(link.key)}
              <span
                aria-hidden
                className={`absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full ${
                  solid ? "bg-ink" : "bg-white"
                }`}
              />
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <LanguageSwitcher onDark={!solid} />
          <a
            href="#contact"
            className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
              solid
                ? "bg-ink text-cream hover:bg-ink-soft"
                : "bg-white text-ink hover:bg-cream"
            }`}
          >
            {t("cta")}
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t("menuClose") : t("menuOpen")}
          className={`flex h-10 w-10 items-center justify-center md:hidden ${
            solid ? "text-ink" : "text-white"
          }`}
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

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-line bg-cream px-5 pt-2 pb-6 md:hidden">
          <div className="flex flex-col">
            {LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-base font-medium text-ink"
              >
                {t(link.key)}
              </a>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-cream"
            >
              {t("cta")}
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
