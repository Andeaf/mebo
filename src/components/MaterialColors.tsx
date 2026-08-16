"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import FadeUp from "./FadeUp";

// Placeholder palettes — swap for the real supplier colours later.
// Order must match materials.palColors / materials.veneerColors in messages.
const PAL_COLORS = [
  "#F2F1EC",
  "#D9CDBB",
  "#B7AC9E",
  "#C6C6C2",
  "#8F8E8A",
  "#8B9484",
  "#3B3C3E",
  "#1E1E1E",
] as const;

const VENEER_COLORS = [
  "#DCCBAA",
  "#C6A272",
  "#8A6A47",
  "#86503A",
  "#5C4531",
  "#43322B",
  "#2B241F",
] as const;

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function MaterialPanel({
  label,
  colors,
  colorName,
  grain = false,
}: {
  label: string;
  colors: readonly string[];
  colorName: (index: number) => string;
  grain?: boolean;
}) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const hex = colors[active];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-medium tracking-tight-3">{label}</h3>
        <span className="text-sm text-muted">{colorName(active)}</span>
      </div>
      <motion.div
        className="relative mt-4 aspect-4/3 overflow-hidden rounded-sm"
        initial={false}
        animate={{ backgroundColor: hex }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      >
        {grain && (
          <div
            aria-hidden
            className="absolute inset-0 opacity-25 mix-blend-multiply"
            style={{
              backgroundImage:
                "repeating-linear-gradient(97deg, rgba(0,0,0,0.28) 0 1px, transparent 1px 9px, rgba(0,0,0,0.1) 9px 10px, transparent 10px 26px), repeating-linear-gradient(94deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 41px)",
            }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent"
        />
        <span
          className={`absolute bottom-0 left-0 p-5 text-sm font-medium ${
            isLight(hex) ? "text-ink" : "text-white"
          }`}
        >
          {colorName(active)} · {hex.toUpperCase()}
        </span>
      </motion.div>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {colors.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            aria-label={colorName(i)}
            title={colorName(i)}
            style={{ backgroundColor: c }}
            className={`h-9 w-9 rounded-full border border-black/10 transition-transform duration-200 hover:scale-110 ${
              i === active ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function MaterialColors() {
  const t = useTranslations("materials");

  return (
    <section id="kleuren" className="scroll-mt-16 bg-cream px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-350">
        <FadeUp className="max-w-2xl">
          <p className="text-sm font-medium text-muted">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight-3 text-balance md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-pretty text-ink-soft">
            {t("intro")}
          </p>
        </FadeUp>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-8">
          <FadeUp>
            <MaterialPanel
              label={t("palLabel")}
              colors={PAL_COLORS}
              colorName={(i) => t(`palColors.${i}`)}
            />
          </FadeUp>
          <FadeUp delay={0.12}>
            <MaterialPanel
              label={t("veneerLabel")}
              colors={VENEER_COLORS}
              colorName={(i) => t(`veneerColors.${i}`)}
              grain
            />
          </FadeUp>
        </div>
        <FadeUp>
          <p className="mt-8 text-sm text-muted">{t("note")}</p>
        </FadeUp>
      </div>
    </section>
  );
}
