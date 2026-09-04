"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { isLight } from "@/lib/materials";

type Props = {
  label: string;
  colors: readonly string[];
  colorName: (index: number) => string;
  /** Extra line under the swatch, e.g. the RAL reference. */
  colorMeta?: (index: number) => string;
  grain?: boolean;
  /** "dark" is for the tinted process panel, "light" for a cream background. */
  tone?: "light" | "dark";
  /** Swatch proportions; flatter inside the process panel, where height is tight. */
  swatchAspect?: string;
};

export default function MaterialPanel({
  label,
  colors,
  colorName,
  colorMeta,
  grain = false,
  tone = "light",
  swatchAspect = "aspect-4/3",
}: Props) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const hex = colors[active];
  const dark = tone === "dark";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3
          className={`text-base font-medium tracking-tight-3 lg:text-lg ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {label}
        </h3>
        <span className={`text-sm ${dark ? "text-white/60" : "text-muted"}`}>
          {colorMeta ? colorMeta(active) : colorName(active)}
        </span>
      </div>
      <motion.div
        className={`relative mt-3 overflow-hidden rounded-sm ${swatchAspect}`}
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
          className={`absolute bottom-0 left-0 p-4 text-sm font-medium lg:p-5 ${
            isLight(hex) ? "text-ink" : "text-white"
          }`}
        >
          {colorName(active)}
        </span>
      </motion.div>
      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            aria-label={colorName(i)}
            title={colorName(i)}
            style={{ backgroundColor: c }}
            className={`size-8 rounded-full transition-transform duration-200 hover:scale-110 ${
              dark ? "border border-white/25" : "border border-black/10"
            } ${
              i === active
                ? dark
                  ? "ring-2 ring-white ring-offset-2 ring-offset-ink"
                  : "ring-2 ring-ink ring-offset-2 ring-offset-cream"
                : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
