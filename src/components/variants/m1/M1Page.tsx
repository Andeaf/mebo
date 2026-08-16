"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { company } from "@/lib/company";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * Variant M1 — after godaylight.com: warm cream, vivid orange accents, serif
 * display type over grid lines, and pronounced scroll animations that play
 * both ways (elements animate in scrolling down and back out scrolling up).
 *
 * Visibility is observed on a static wrapper (not the animated node): a
 * y-translate on the observed element itself can push it across the
 * intersection boundary and oscillate show/hide forever.
 */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  return { ref, show: reduce || inView, reduce };
}

// Shared in/out scroll reveal: animates back out when scrolled away.
function Reveal({
  children,
  delay = 0,
  y = 36,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, show, reduce } = useReveal();
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y }}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: show ? delay : 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Image that unmasks with a clip-path wipe, in and out. clip-path does not
// change the bounding box, so observing the element itself is safe here.
function RevealImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const { ref, show, reduce } = useReveal();
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={show ? { clipPath: "inset(0 0 0% 0)" } : { clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src={src} alt={alt} fill sizes={sizes ?? "50vw"} className="object-cover" />
      </motion.div>
    </div>
  );
}

function SectionLabel({ num, text }: { num: string; text: string }) {
  return (
    <Reveal y={16}>
      <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] uppercase text-m1-orange">
        <span>{num}</span>
        <span className="h-px w-8 bg-m1-orange" aria-hidden />
        <span className="text-m1-ink/60">{text}</span>
      </p>
    </Reveal>
  );
}

export default function M1Page() {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  // Gentle parallax on the statement-band photo
  const bandRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ["start end", "end start"],
  });
  const bandY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const processImages = [
    "/images/projects/ontwerp-showroom.jpg",
    "/images/projects/productie-cnc.jpg",
    "/images/projects/montage-team.jpg",
  ];
  const featureImages = [
    "/images/projects/materialen-eiken-fronten.jpg",
    "/images/projects/proces-tekening-montage.jpg",
  ];

  return (
    <div className="bg-m1-cream font-sans text-m1-ink">
      {/* ─── Nav ─── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-m1-line bg-m1-cream/85 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-350 items-center justify-between px-5 md:px-8">
          <a href="#top" className="text-xl font-semibold lowercase tracking-tight-3">
            mebo
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#m1-werk" className="text-sm font-medium hover:text-m1-orange">
              {t("nav.projects")}
            </a>
            <a href="#m1-werkwijze" className="text-sm font-medium hover:text-m1-orange">
              {t("nav.process")}
            </a>
            <a href="#m1-contact" className="text-sm font-medium hover:text-m1-orange">
              {t("nav.contact")}
            </a>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <LanguageSwitcher />
            <a
              href="#m1-contact"
              className="rounded-full bg-m1-orange px-5 py-2 text-sm font-medium text-m1-cream transition-colors hover:bg-m1-ink"
            >
              {t("nav.cta")}
            </a>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("nav.menuClose") : t("nav.menuOpen")}
            className="flex h-10 w-10 items-center justify-center md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              {menuOpen ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M2 6h16M2 14h16" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </nav>
        {menuOpen && (
          <div className="border-t border-m1-line px-5 pb-6 pt-2 md:hidden">
            {(
              [
                ["#m1-werk", t("nav.projects")],
                ["#m1-werkwijze", t("nav.process")],
                ["#m1-contact", t("nav.contact")],
              ] as const
            ).map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-m1-line py-4 text-base font-medium"
              >
                {label}
              </a>
            ))}
            <div className="mt-5 flex items-center justify-between">
              <a
                href="#m1-contact"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-m1-orange px-5 py-2.5 text-sm font-medium text-m1-cream"
              >
                {t("nav.cta")}
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* ─── Hero: serif headline over a ruled grid with photo tiles ─── */}
        <section className="relative overflow-hidden border-b border-m1-line pt-16">
          {/* vertical grid lines across the section, Daylight-style */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mx-auto hidden max-w-350 grid-cols-4 md:grid"
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border-l border-m1-line last:border-r" />
            ))}
          </div>
          <div className="relative mx-auto max-w-350 px-5 md:px-8">
            <div className="grid gap-10 py-16 md:grid-cols-2 md:py-24">
              <div>
                <SectionLabel num="01" text={t("v.m1.labels.intro")} />
                <Reveal delay={0.08}>
                  <h1 className="mt-6 font-m1-display text-5xl leading-[1.04] tracking-tight-3 text-balance md:text-7xl">
                    {t("hero.title")}
                  </h1>
                </Reveal>
                <Reveal delay={0.16}>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-pretty text-m1-ink/70">
                    {t("hero.subtitle")}
                  </p>
                </Reveal>
                <Reveal delay={0.24}>
                  <a
                    href="#m1-contact"
                    className="mt-8 inline-block rounded-full bg-m1-orange px-7 py-3.5 text-sm font-medium text-m1-cream transition-colors hover:bg-m1-ink"
                  >
                    {t("hero.cta")}
                  </a>
                </Reveal>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-5" id="m1-werk">
                <RevealImage
                  src="/images/projects/hero-keuken-eiken.jpg"
                  alt={t("hero.imageAlt")}
                  className="aspect-4/5 rounded-sm"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
                <div className="mt-10">
                  <RevealImage
                    src="/images/projects/project-keuken-zwart-01.jpg"
                    alt={t("showcase.imageAlt")}
                    className="aspect-4/5 rounded-sm"
                    sizes="(min-width: 768px) 25vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Statement band with parallax photo ─── */}
        <section ref={bandRef} className="relative overflow-hidden bg-m1-dark">
          <motion.div
            aria-hidden
            style={reduce ? undefined : { y: bandY }}
            className="absolute inset-[-14%_0]"
          >
            <Image
              src="/images/projects/maatwerk-werkplaats.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-45"
            />
          </motion.div>
          <div className="relative mx-auto flex min-h-[60svh] max-w-350 items-center px-5 py-24 md:px-8">
            <Reveal>
              <p className="max-w-3xl font-m1-display text-3xl leading-[1.2] text-m1-cream md:text-5xl">
                {t("statement.text")}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── Process: numbered rows, image beside text ─── */}
        <section id="m1-werkwijze" className="border-b border-m1-line">
          <div className="mx-auto max-w-350 px-5 py-20 md:px-8 md:py-28">
            <SectionLabel num="02" text={t("v.m1.labels.process")} />
            <Reveal delay={0.08}>
              <h2 className="mt-6 max-w-xl font-m1-display text-4xl tracking-tight-3 md:text-5xl">
                {t("process.heading")}
              </h2>
            </Reveal>
            <div className="mt-14 flex flex-col">
              {([0, 1, 2] as const).map((i) => (
                <div
                  key={i}
                  className="grid items-center gap-8 border-t border-m1-line py-10 md:grid-cols-2 md:gap-16 md:py-14"
                >
                  <Reveal className={i % 2 === 1 ? "md:order-2" : undefined}>
                    <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-m1-orange">
                      {`Stap 0${i + 1} — ${t(`process.cards.${i}.label`)}`}
                    </p>
                    <h3 className="mt-4 max-w-md text-2xl font-medium tracking-tight-3 text-balance md:text-3xl">
                      {t(`process.cards.${i}.title`)}
                    </h3>
                  </Reveal>
                  <RevealImage
                    src={processImages[i]}
                    alt={t(`process.cards.${i}.imageAlt`)}
                    className={`aspect-3/2 rounded-sm ${i % 2 === 1 ? "md:order-1" : ""}`}
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features in ruled grid cells ─── */}
        <section className="border-b border-m1-line">
          <div className="mx-auto max-w-350 px-5 py-20 md:px-8 md:py-28">
            <SectionLabel num="03" text={t("v.m1.labels.materials")} />
            <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-m1-line bg-m1-line md:grid-cols-2">
              {([0, 1] as const).map((i) => (
                <div key={i} className="flex flex-col bg-m1-cream">
                  <RevealImage
                    src={featureImages[i]}
                    alt={t(`features.${i}.imageAlt`)}
                    className="aspect-16/10"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="flex flex-1 flex-col p-7 md:p-9">
                    <Reveal y={20}>
                      <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-m1-orange">
                        {t(`features.${i}.eyebrow`)}
                      </p>
                      <h3 className="mt-3 font-m1-display text-2xl tracking-tight-3 md:text-3xl">
                        {t(`features.${i}.title`)}
                      </h3>
                      <p className="mt-4 max-w-lg text-base leading-relaxed text-pretty text-m1-ink/70">
                        {t(`features.${i}.body`)}
                      </p>
                    </Reveal>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Big word moment ─── */}
        <section className="relative overflow-hidden bg-m1-dark">
          <Image
            src="/images/projects/project-keuken-zwart-01.jpg"
            alt={t("moment.imageAlt")}
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="relative mx-auto flex min-h-[55svh] max-w-350 flex-col items-center justify-center px-5 py-24 text-center md:px-8">
            <Reveal>
              <p className="font-m1-display text-6xl tracking-tight-3 text-m1-cream md:text-8xl">
                {t("moment.word")}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-4 text-base text-m1-cream/70 md:text-lg">{t("moment.sub")}</p>
            </Reveal>
          </div>
        </section>

        {/* ─── Contact: orange CTA panel ─── */}
        <section id="m1-contact" className="bg-m1-orange text-m1-cream">
          <div className="mx-auto max-w-350 px-5 py-20 md:px-8 md:py-28">
            <SectionLabel num="04" text={t("v.m1.labels.contact")} />
            <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <Reveal>
                  <h2 className="font-m1-display text-4xl tracking-tight-3 text-balance md:text-6xl">
                    {t("contact.heading")}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-pretty text-m1-cream/85">
                    {t("contact.intro")}
                  </p>
                  <p className="mt-4 text-sm text-m1-cream/70">{t("v.m1.ctaNote")}</p>
                  <p className="mt-1 text-sm text-m1-cream/70">{t("contact.hoursValue")}</p>
                </Reveal>
              </div>
              <Reveal delay={0.15}>
                <ul className="flex flex-col divide-y divide-m1-cream/25">
                  {(
                    [
                      [t("contact.phoneLabel"), company.phoneDisplay, `tel:${company.phone}`],
                      [t("contact.whatsappLabel"), t("contact.whatsappValue"), company.whatsappUrl],
                      [t("contact.emailLabel"), company.email, `mailto:${company.email}`],
                      ["Instagram", company.instagramHandle, company.instagramUrl],
                    ] as const
                  ).map(([label, value, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group flex items-baseline justify-between gap-4 py-5"
                      >
                        <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-m1-cream/70">
                          {label}
                        </span>
                        <span className="text-lg font-medium group-hover:underline md:text-xl">
                          {value}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-m1-dark px-5 py-12 text-m1-cream/70 md:px-8">
        <div className="mx-auto flex max-w-350 flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-xl font-semibold lowercase tracking-tight-3 text-m1-cream">mebo</p>
          <p>{t("footer.tagline")}</p>
          <p>
            © {new Date().getFullYear()} {company.legalName} · {t("footer.kvk")}
          </p>
        </div>
      </footer>
    </div>
  );
}
