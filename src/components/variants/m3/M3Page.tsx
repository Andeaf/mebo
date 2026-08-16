"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { company } from "@/lib/company";
import LiveClock from "@/components/variants/LiveClock";

/**
 * Variant M3 — after caverzasio.ch: pitch-black canvas with film grain, a
 * fixed "Selected works" headline on the left, numbered project cards
 * scrolling on the right, orange accents and a radial plus-menu.
 */

// Film-grain overlay as an inline SVG tile — no external asset needed.
const NOISE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const PROJECT_IMAGES = [
  { src: "/images/projects/hero-keuken-eiken.jpg", altKey: "hero.imageAlt" },
  { src: "/images/projects/project-keuken-zwart-01.jpg", altKey: "showcase.imageAlt" },
  { src: "/images/projects/productie-cnc.jpg", altKey: "process.cards.1.imageAlt" },
  { src: "/images/projects/montage-team.jpg", altKey: "process.cards.2.imageAlt" },
] as const;

function RadialMenu() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const items = [
    { label: t("nav.projects"), href: "#m3-werk", angle: -90 },
    { label: "Instagram", href: company.instagramUrl, angle: 0, external: true },
    { label: t("nav.contact"), href: "#m3-contact", angle: 90 },
    { label: "E-mail", href: `mailto:${company.email}`, angle: 180 },
  ];

  return (
    <div className="fixed top-1/2 left-1/2 z-50 hidden -translate-x-1/2 -translate-y-1/2 md:block">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduce ? undefined : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-1/2 left-1/2 h-95 w-95 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-2xl"
          >
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[13px] font-medium text-black hover:text-m3-orange"
                style={{ transform: `rotate(${item.angle + 90}deg) translateY(-9.5rem)` }}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t("v.m3.menuAria")}
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105"
      >
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="1.5" />
        </motion.svg>
      </button>
    </div>
  );
}

export default function M3Page() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <div className="relative bg-black font-m3-sans text-white">
      {/* film grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 opacity-8"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* fixed chrome */}
      <p className="fixed top-5 left-5 z-50 text-[13px] font-bold tracking-[0.02em] uppercase md:left-8">
        Mebo — IJmuiden
      </p>
      <LiveClock className="fixed bottom-5 left-5 z-50 hidden text-[13px] font-bold md:left-8 md:block" />
      <RadialMenu />

      {/* ─── Works: fixed-feel left headline, scrolling right column ─── */}
      <section id="m3-werk" className="relative md:grid md:grid-cols-2">
        <div className="px-5 pt-24 pb-4 md:sticky md:top-0 md:flex md:h-screen md:items-center md:px-8 md:py-0">
          <h1 className="text-4xl font-medium tracking-tight-3 md:text-5xl">
            {t("v.m3.headline")}
          </h1>
        </div>

        <div className="flex flex-col px-5 md:px-0 md:pr-8">
          {PROJECT_IMAGES.map((img, i) => (
            <article key={img.src} className="border-b border-white/15 py-6 md:py-4">
              <p className="mb-2 text-[13px] font-bold text-m3-gray">0{i + 1}</p>
              <div className="relative aspect-4/3 overflow-hidden bg-m3-orange">
                <Image
                  src={img.src}
                  alt={t(img.altKey)}
                  fill
                  sizes="(min-width: 768px) 48vw, 92vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 grid gap-3 pb-6 md:grid-cols-[1fr_1.6fr] md:gap-6">
                <h2 className="text-[13px] font-bold tracking-[0.02em] uppercase">
                  {t(`v.m3.projects.${i}.title`)}
                </h2>
                <div>
                  <p className="text-[11px] font-medium tracking-[0.08em] whitespace-pre uppercase text-m3-gray">
                    {t(`v.m3.projects.${i}.tags`)}
                  </p>
                  <p className="mt-3 text-[12px] leading-relaxed font-medium tracking-[0.04em] uppercase">
                    {t(`v.m3.projects.${i}.text`)}
                  </p>
                  <a
                    href={company.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-[12px] font-bold tracking-[0.06em] uppercase text-m3-orange hover:underline"
                  >
                    {t("v.m3.discover")}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section id="m3-contact" className="relative border-t border-white/15">
        <div className="mx-auto max-w-350 px-5 py-24 md:px-8 md:py-32">
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight-3 text-balance md:text-6xl">
            {t("contact.heading")}
          </h2>
          <p className="mt-6 max-w-md text-[13px] leading-relaxed text-white/60">
            {t("contact.intro")}
          </p>
          <ul className="mt-14 flex flex-col border-t border-white/15">
            {(
              [
                [t("contact.phoneLabel"), company.phoneDisplay, `tel:${company.phone}`],
                [t("contact.whatsappLabel"), t("contact.whatsappValue"), company.whatsappUrl],
                [t("contact.emailLabel"), company.email, `mailto:${company.email}`],
                ["Instagram", company.instagramHandle, company.instagramUrl],
              ] as const
            ).map(([label, value, href]) => (
              <li key={label} className="border-b border-white/15">
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-baseline justify-between gap-4 py-6"
                >
                  <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-m3-gray">
                    {label}
                  </span>
                  <span className="text-lg font-medium uppercase transition-colors group-hover:text-m3-orange md:text-2xl">
                    {value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-2 text-[11px] font-medium tracking-[0.08em] uppercase text-m3-gray md:flex-row md:justify-between">
            <p>
              {company.address.street}, {company.address.postalCode} {company.address.city}
            </p>
            <p>{t("contact.hoursValue")}</p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="flex items-center justify-between border-t border-white/15 px-5 py-5 text-[11px] font-medium tracking-[0.08em] uppercase text-m3-gray md:px-8">
        <p>
          © {year} {company.legalName}
        </p>
        <p>{t("footer.tagline")}</p>
      </footer>
    </div>
  );
}
