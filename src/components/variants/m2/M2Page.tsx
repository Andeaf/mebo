"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { company } from "@/lib/company";
import LiveClock from "@/components/variants/LiveClock";

/**
 * Variant M2 — after bureaurouge.com: full-bleed photography, typewriter
 * (monospace) typography, a work list whose rows swap the centre image on
 * hover, a live city clock and a dismissible red news toast.
 */

const WORK_IMAGES = [
  "/images/projects/hero-keuken-eiken.jpg",
  "/images/projects/project-keuken-zwart-01.jpg",
  "/images/projects/ontwerp-showroom.jpg",
  "/images/projects/productie-cnc.jpg",
  "/images/projects/montage-team.jpg",
  "/images/projects/materialen-eiken-fronten.jpg",
  "/images/projects/proces-tekening-montage.jpg",
  "/images/projects/maatwerk-werkplaats.jpg",
];

function MonoLangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  return (
    <span aria-label={t("langAria")} className="flex items-center gap-3">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() =>
            l !== locale && router.replace(pathname, { locale: l, scroll: false })
          }
          aria-current={l === locale ? "true" : undefined}
          className={`cursor-pointer uppercase transition-opacity ${
            l === locale ? "" : "opacity-45 hover:opacity-100"
          }`}
        >
          {l}
        </button>
      ))}
    </span>
  );
}

export default function M2Page() {
  const t = useTranslations();
  const [active, setActive] = useState(0);
  const [toastOpen, setToastOpen] = useState(true);
  const year = new Date().getFullYear();

  const works = ([0, 1, 2, 3, 4, 5, 6, 7] as const).map((i) => ({
    year: t(`v.m2.works.${i}.year`),
    tag: t(`v.m2.works.${i}.tag`),
    title: t(`v.m2.works.${i}.title`),
    image: WORK_IMAGES[i],
  }));

  return (
    <div className="bg-m2-paper font-m2-mono text-m2-ink">
      {/* ─── Hero: full-bleed photo, mono overlay nav + statement ─── */}
      <section className="relative min-h-svh">
        <Image
          src="/images/projects/project-keuken-zwart-01.jpg"
          alt={t("showcase.imageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-black/35" />

        {/* header row */}
        <div className="absolute inset-x-0 top-0 flex items-baseline justify-between px-5 py-6 text-[13px] tracking-[0.12em] text-white md:px-8">
          <p className="text-base font-bold tracking-[0.22em] uppercase">Mebo</p>
          <nav className="hidden gap-24 uppercase md:flex" aria-label="Mebo">
            <a href="#m2-werk" className="hover:opacity-70">
              {t("nav.projects")},
            </a>
            <a href="#m2-werk" className="hover:opacity-70">
              {t("nav.process")},
            </a>
          </nav>
          <a href="#m2-contact" className="uppercase text-m2-red brightness-150 hover:opacity-80">
            {t("nav.contact")}
          </a>
        </div>

        {/* statement, offset right of centre like the reference */}
        <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 md:left-[48%] md:right-8">
          <p className="max-w-2xl text-sm leading-relaxed text-white md:text-base">
            {t.rich("v.m2.about", {
              i: (chunks) => <i className="italic">{chunks}</i>,
            })}
          </p>
        </div>

        {/* bottom row: language + clock */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 text-[12px] tracking-[0.12em] text-white md:px-8">
          <span aria-hidden />
          <MonoLangSwitcher />
          <LiveClock suffix={`[${t("v.m2.clockCity")}]`} />
        </div>
      </section>

      {/* ─── Work list with hover-swapped centre image ─── */}
      <section id="m2-werk" className="relative px-5 py-24 md:px-0 md:py-32">
        <p className="mb-10 text-center text-[12px] tracking-[0.12em] uppercase text-m2-soft">
          {t("v.m2.worksNote")}
        </p>

        <div className="relative mx-auto max-w-[96rem]">
          {/* centre image, stacked crossfade */}
          <div className="pointer-events-none relative mx-auto mb-10 aspect-3/4 w-64 md:absolute md:left-1/2 md:top-1/2 md:z-10 md:mb-0 md:w-[24rem] md:-translate-x-1/2 md:-translate-y-1/2">
            {works.map((w, i) => (
              <Image
                key={w.image}
                src={w.image}
                alt=""
                fill
                sizes="(min-width: 768px) 24rem, 16rem"
                className={`object-cover transition-opacity duration-500 ${
                  active === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* rows */}
          <ul>
            {works.map((w, i) => (
              <li key={w.title} className="border-t border-m2-ink/10 last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`grid w-full cursor-pointer grid-cols-2 items-baseline gap-4 px-1 py-5 text-left text-[13px] tracking-[0.08em] transition-colors duration-300 md:px-8 ${
                    active === i ? "text-m2-ink" : "text-m2-dim"
                  }`}
                >
                  <span>{w.year}</span>
                  <span className="text-right">
                    <span className="block text-[11px] uppercase opacity-70">{w.tag}</span>
                    <span className="mt-1 block text-base md:text-lg">{w.title}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section id="m2-contact" className="border-t border-m2-ink/10 px-5 py-24 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[13px] tracking-[0.22em] uppercase">
            {t("nav.contact")},
          </h2>
          <p className="mt-8 text-sm leading-relaxed text-m2-soft">{t("contact.intro")}</p>
          <ul className="mx-auto mt-12 flex max-w-md flex-col gap-4 text-sm">
            {(
              [
                [t("contact.phoneLabel"), company.phoneDisplay, `tel:${company.phone}`],
                [t("contact.whatsappLabel"), t("contact.whatsappValue"), company.whatsappUrl],
                [t("contact.emailLabel"), company.email, `mailto:${company.email}`],
                ["Instagram", company.instagramHandle, company.instagramUrl],
              ] as const
            ).map(([label, value, href]) => (
              <li key={label} className="flex items-baseline justify-between gap-6">
                <span className="text-[11px] tracking-[0.18em] uppercase text-m2-soft">
                  [{label}]
                </span>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="underline decoration-m2-ink/30 underline-offset-4 hover:decoration-m2-ink"
                >
                  {value}
                </a>
              </li>
            ))}
            <li className="flex items-baseline justify-between gap-6">
              <span className="text-[11px] tracking-[0.18em] uppercase text-m2-soft">
                [{t("contact.visitLabel")}]
              </span>
              <span>
                {company.address.street}, {company.address.postalCode} {company.address.city}
              </span>
            </li>
            <li className="flex items-baseline justify-between gap-6">
              <span className="text-[11px] tracking-[0.18em] uppercase text-m2-soft">
                [{t("contact.hoursLabel")}]
              </span>
              <span>{t("contact.hoursValue")}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="flex items-center justify-between px-5 py-4 text-[12px] tracking-[0.12em] text-m2-soft md:px-8">
        <p>
          © {year} {company.legalName}
        </p>
        <MonoLangSwitcher />
        <LiveClock suffix={`[${t("v.m2.clockCity")}]`} />
      </footer>

      {/* ─── Red news toast (Instagram) ─── */}
      {toastOpen && (
        <div className="fixed bottom-4 left-4 z-100 flex items-stretch bg-m2-red text-[12px] tracking-[0.1em] text-white shadow-lg">
          <a
            href={company.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 hover:bg-white/10"
          >
            {t("v.m2.toast")}
          </a>
          <button
            type="button"
            onClick={() => setToastOpen(false)}
            aria-label="Sluiten"
            className="cursor-pointer px-3 py-2.5 hover:bg-white/10"
          >
            [X]
          </button>
        </div>
      )}
    </div>
  );
}
