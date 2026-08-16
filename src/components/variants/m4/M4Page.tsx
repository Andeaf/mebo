"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { company } from "@/lib/company";
import LiveClock from "@/components/variants/LiveClock";
import M4Intro from "./M4Intro";

/**
 * Variant M4 — after danielblue.com: white, ultra-minimal, serif wordmark,
 * a loose photo collage with tiny captions, a giant wordmark footer and the
 * typewriter intro (see M4Intro).
 */

// Collage layout on the 12-column grid; caption indexes refer to v.m4.captions.
const COLLAGE = [
  { src: "/images/projects/project-keuken-zwart-01.jpg", caption: 1, cls: "md:col-start-2 md:col-span-5", ratio: "aspect-4/3" },
  { src: "/images/projects/ontwerp-showroom.jpg", caption: 2, cls: "md:col-start-8 md:col-span-4 md:mt-40", ratio: "aspect-3/4" },
  { src: "/images/projects/productie-cnc.jpg", caption: 3, cls: "md:col-start-3 md:col-span-4 md:mt-44", ratio: "aspect-3/4" },
  { src: "/images/projects/materialen-eiken-fronten.jpg", caption: 5, cls: "md:col-start-8 md:col-span-4 md:mt-36", ratio: "aspect-4/3" },
  { src: "/images/projects/montage-team.jpg", caption: 4, cls: "md:col-start-4 md:col-span-6 md:mt-44", ratio: "aspect-16/10" },
  { src: "/images/projects/proces-tekening-montage.jpg", caption: 7, cls: "md:col-start-2 md:col-span-4 md:mt-40", ratio: "aspect-3/4" },
  { src: "/images/projects/maatwerk-werkplaats.jpg", caption: 6, cls: "md:col-start-7 md:col-span-5 md:mt-36", ratio: "aspect-4/3" },
] as const;

function CollageItem({
  src,
  caption,
  cls,
  ratio,
  index,
}: (typeof COLLAGE)[number] & { index: number }) {
  const t = useTranslations("v.m4");
  const reduce = useReducedMotion();

  return (
    <motion.figure
      className={`col-span-1 ${cls}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`relative ${ratio} overflow-hidden`}>
        <Image
          src={src}
          alt={t(`captions.${caption}`)}
          fill
          sizes="(min-width: 768px) 42vw, 100vw"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-2.5 flex items-baseline justify-between font-m4-serif text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
        <span>{t(`captions.${caption}`)}</span>
        <span aria-hidden>0{index + 1}</span>
      </figcaption>
    </motion.figure>
  );
}

export default function M4Page() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <div className="bg-white font-sans text-neutral-900">
      <M4Intro />

      {/* ─── Hero: full-bleed photo with overlaid minimal chrome ─── */}
      <section className="relative min-h-svh">
        <Image
          src="/images/projects/hero-keuken-eiken.jpg"
          alt={t("hero.imageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-black/20" />

        <header className="absolute inset-x-0 top-0 grid grid-cols-2 items-baseline gap-4 px-5 py-5 text-white md:grid-cols-3 md:px-8">
          <p className="hidden text-[10px] tracking-[0.18em] uppercase opacity-90 md:block">
            {t("v.m4.tagline")}
          </p>
          <a
            href="#top"
            className="font-m4-serif text-2xl font-medium tracking-[0.4em] md:text-center md:text-3xl"
          >
            MEBO
          </a>
          <nav
            aria-label="Mebo"
            className="flex justify-end gap-5 text-[10px] tracking-[0.18em] uppercase"
          >
            <a href="#m4-werk" className="opacity-90 hover:opacity-60">
              {t("nav.projects")}
            </a>
            <a href="#m4-contact" className="opacity-90 hover:opacity-60">
              {t("nav.contact")}
            </a>
            <a
              href={company.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 hover:opacity-60"
            >
              Instagram
            </a>
          </nav>
        </header>

        <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between px-5 py-4 text-[10px] tracking-[0.18em] text-white uppercase md:px-8">
          <span className="opacity-90">{t("v.m4.location")}</span>
          <span className="flex gap-5 opacity-90">
            <a href={`mailto:${company.email}`} className="hover:opacity-60">
              {company.email}
            </a>
            <LiveClock className="hidden md:inline" suffix="(CET)" />
          </span>
        </div>
      </section>

      {/* ─── Collage ─── */}
      <section
        id="m4-werk"
        className="mx-auto grid max-w-[100rem] grid-cols-1 gap-14 px-5 py-24 md:grid-cols-12 md:gap-x-6 md:gap-y-0 md:px-8 md:py-36"
      >
        {COLLAGE.map((item, i) => (
          <CollageItem key={item.src} {...item} index={i} />
        ))}
      </section>

      {/* ─── Giant wordmark footer ─── */}
      <footer id="m4-contact" className="px-5 pb-10 md:px-8">
        <p
          aria-hidden
          className="text-center font-m4-serif leading-none font-medium tracking-[0.08em] text-neutral-900 select-none"
          style={{ fontSize: "clamp(4rem, 21vw, 24rem)" }}
        >
          MEBO
        </p>
        <div className="mt-6 text-center">
          <a
            href={`mailto:${company.email}`}
            className="font-m4-serif text-sm tracking-[0.22em] text-neutral-600 uppercase hover:text-neutral-900"
          >
            {company.email}
          </a>
        </div>
        <div className="mt-14 flex flex-col items-center gap-3 border-t border-neutral-200 pt-6 text-center text-[10px] tracking-[0.16em] text-neutral-500 uppercase md:flex-row md:justify-between md:text-left">
          <p>
            © {year} {company.legalName} · {t("footer.kvk")}
          </p>
          <p className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <a href={`tel:${company.phone}`} className="hover:text-neutral-900">
              {company.phoneDisplay}
            </a>
            <a
              href={company.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900"
            >
              WhatsApp
            </a>
            <a
              href={company.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900"
            >
              {company.instagramHandle}
            </a>
          </p>
          <p>
            {company.address.street}, {company.address.postalCode} {company.address.city}
          </p>
        </div>
      </footer>
    </div>
  );
}
