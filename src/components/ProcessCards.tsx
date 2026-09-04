"use client";

import Image from "next/image";
import { useState } from "react";
import type { FocusEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { designer, productionPartner } from "@/lib/company";
import { PAINTED_COLORS, VENEER_COLORS } from "@/lib/materials";
import MaterialPanel from "./MaterialPanel";

const CARD_IMAGES = [
  "/images/projects/ontwerp-showroom.jpg",
  "/images/projects/productie-cnc.jpg",
  "/images/projects/montage-team.jpg",
] as const;

// Cards 0 (design) and 1 (production) open a panel over the cards beside them.
// Card 0 unrolls to the right, card 1 opens outwards from its own centre.
const PANEL_CARDS = [0, 1] as const;

const PANEL_POSITION: Record<number, string> = {
  0: "left-full ml-3 w-[calc(200%+0.75rem)]",
  1: "left-[calc(-100%-0.75rem)] w-[calc(300%+1.5rem)]",
};

const PANEL_CLOSED_CLIP: Record<number, string> = {
  0: "inset(0 100% 0 0)",
  1: "inset(0 50% 0 50%)",
};

// Same slow settling easing the hero zoom uses.
const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ProcessCards() {
  const t = useTranslations("process");
  const tm = useTranslations("materials");
  const reduceMotion = useReducedMotion();
  const [openCard, setOpenCard] = useState<number | null>(null);

  const services = t.raw("designer.services") as string[];

  // Contents fade in just behind the reveal, one block after the other.
  const group = reduceMotion
    ? undefined
    : {
        hidden: {},
        visible: { transition: { delayChildren: 0.16, staggerChildren: 0.07 } },
      };
  const item = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: REVEAL_EASE },
        },
      };

  const panelLabel = (index: number) =>
    index === 0 ? t("designer.openLabel") : tm("openLabel");

  const designerContent = (
    <>
      <motion.div variants={item}>
        <p className="text-xs font-medium tracking-[0.14em] text-white/55 uppercase">
          {t("designer.eyebrow")}
        </p>
        <p className="mt-3 text-2xl leading-tight font-medium tracking-tight-3 text-white lg:text-[2rem]">
          {designer.name}
        </p>
        <p className="mt-1.5 text-sm text-white/65">
          {t("designer.studio", {
            studio: designer.studio,
            city: designer.city,
          })}
        </p>
      </motion.div>

      <motion.div variants={item}>
        <p className="max-w-xl text-sm leading-relaxed text-white/85 lg:text-base">
          {t("designer.intro", { year: designer.foundedYear })}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {services.map((service) => (
            <li
              key={service}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80"
            >
              {service}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        variants={item}
        className="flex flex-wrap items-center gap-x-7 gap-y-3"
      >
        <a
          href={designer.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/50 underline-offset-4 transition-opacity hover:opacity-75"
        >
          {designer.instagramHandle}
          <span aria-hidden>→</span>
        </a>
        <a
          href={designer.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-white/70 transition-opacity hover:opacity-100"
        >
          {designer.websiteLabel}
        </a>
      </motion.div>
    </>
  );

  const colorsContent = (
    <>
      <motion.div variants={item}>
        <p className="text-xs font-medium tracking-[0.14em] text-white/55 uppercase">
          {tm("eyebrow")}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="text-2xl leading-tight font-medium tracking-tight-3 text-white lg:text-[1.75rem]">
            {productionPartner.name}
          </p>
          <a
            href={productionPartner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 underline decoration-white/40 underline-offset-4 transition-opacity hover:opacity-75"
          >
            {productionPartner.websiteLabel}
            <span aria-hidden>→</span>
          </a>
        </div>
        <p className="mt-1.5 text-sm text-white/65">
          {tm("partnerMeta", { city: productionPartner.city })}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
          {tm("intro")}
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-6 sm:grid-cols-2">
        <MaterialPanel
          tone="dark"
          swatchAspect="aspect-16/9 md:aspect-5/2"
          label={tm("paintedLabel")}
          colors={PAINTED_COLORS.map((c) => c.hex)}
          colorName={(i) => tm(`paintedColors.${i}`)}
          colorMeta={(i) => `RAL ${PAINTED_COLORS[i].ral}`}
        />
        <MaterialPanel
          tone="dark"
          swatchAspect="aspect-16/9 md:aspect-5/2"
          grain
          label={tm("veneerLabel")}
          colors={VENEER_COLORS}
          colorName={(i) => tm(`veneerColors.${i}`)}
        />
      </motion.div>

      <motion.p variants={item} className="text-xs text-white/55">
        {tm("note")}
      </motion.p>
    </>
  );

  const panelContent = (index: number) =>
    index === 0 ? designerContent : colorsContent;

  // Keyboard users get the same panel: it opens on focus and closes once focus
  // has left both the card and the links inside the panel.
  const handleBlur = (event: FocusEvent<HTMLDivElement>, index: number) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenCard((current) => (current === index ? null : current));
    }
  };

  const contentWrapper = (children: ReactNode, className: string) => (
    <motion.div
      variants={group}
      initial={group ? "hidden" : false}
      animate={group ? "visible" : false}
      className={className}
    >
      {children}
    </motion.div>
  );

  return (
    <section
      id="werkwijze"
      className="scroll-mt-16 bg-cream px-2 pb-2 md:px-3 md:pb-3"
    >
      <h2 className="sr-only">{t("heading")}</h2>
      <div className="grid gap-2 md:grid-cols-3 md:gap-3">
        {CARD_IMAGES.map((src, i) => {
          const hasPanel = (PANEL_CARDS as readonly number[]).includes(i);
          const isOpen = openCard === i;

          return (
            <div
              key={src}
              className={hasPanel ? "relative" : undefined}
              onMouseEnter={hasPanel ? () => setOpenCard(i) : undefined}
              onMouseLeave={
                hasPanel
                  ? () => setOpenCard((c) => (c === i ? null : c))
                  : undefined
              }
              onFocus={hasPanel ? () => setOpenCard(i) : undefined}
              onBlur={hasPanel ? (e) => handleBlur(e, i) : undefined}
            >
              <motion.article
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.12 }}
                className="group relative aspect-4/5 overflow-hidden rounded-sm md:aspect-3/4"
              >
                <Image
                  src={src}
                  alt={t(`cards.${i}.imageAlt`)}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <p className="text-sm font-medium text-white/60">
                    {t(`cards.${i}.label`)}
                  </p>
                  <h3 className="mt-1 max-w-60 text-xl leading-snug font-medium tracking-tight-3 text-white md:text-[1.375rem]">
                    {t(`cards.${i}.title`)}
                  </h3>
                </div>

                {/* Tap target on touch devices; a quiet hover hint on desktop,
                    where the panel opens by itself. */}
                {hasPanel && (
                  <button
                    type="button"
                    onClick={() => setOpenCard(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-label={panelLabel(i)}
                    className={`absolute top-5 right-5 z-10 grid size-9 place-items-center rounded-full border border-white/35 text-white transition-all duration-500 ease-out md:pointer-events-none ${
                      isOpen ? "rotate-45 border-white/70 bg-white/15" : "bg-white/10"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                )}
              </motion.article>

              {hasPanel && (
                <AnimatePresence>
                  {isOpen && (
                    <>
                      {/* Desktop: unrolls over the neighbouring cards. */}
                      <motion.aside
                        key={`panel-${i}`}
                        initial={
                          reduceMotion
                            ? { opacity: 0 }
                            : { clipPath: PANEL_CLOSED_CLIP[i], opacity: 0.5 }
                        }
                        animate={
                          reduceMotion
                            ? { opacity: 1 }
                            : { clipPath: "inset(0 0% 0 0%)", opacity: 1 }
                        }
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { clipPath: PANEL_CLOSED_CLIP[i], opacity: 0 }
                        }
                        transition={
                          reduceMotion
                            ? { duration: 0.2 }
                            : { duration: 0.55, ease: REVEAL_EASE }
                        }
                        className={`absolute top-0 z-20 hidden h-full overflow-hidden rounded-sm bg-ink/70 ring-1 ring-white/15 backdrop-blur-xl md:block ${PANEL_POSITION[i]}`}
                      >
                        {contentWrapper(
                          panelContent(i),
                          "flex h-full flex-col justify-between gap-5 overflow-y-auto p-7 lg:p-9",
                        )}
                      </motion.aside>

                      {/* Touch: a sheet that rises from the bottom. */}
                      <motion.div
                        key={`scrim-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setOpenCard(null)}
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                      />
                      <motion.aside
                        key={`sheet-${i}`}
                        initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
                        animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
                        transition={
                          reduceMotion
                            ? { duration: 0.2 }
                            : { duration: 0.45, ease: REVEAL_EASE }
                        }
                        className="fixed inset-x-0 bottom-0 z-50 max-h-[85svh] overflow-y-auto rounded-t-xl bg-ink/95 ring-1 ring-white/15 backdrop-blur-xl md:hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenCard(null)}
                          aria-label={tm("closeLabel")}
                          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full border border-white/30 text-white"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="size-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            aria-hidden
                          >
                            <path d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        </button>
                        {contentWrapper(
                          panelContent(i),
                          "flex flex-col gap-7 px-6 pt-14 pb-10",
                        )}
                      </motion.aside>
                    </>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
