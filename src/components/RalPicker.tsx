"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { isLight } from "@/lib/materials";
import {
  RAL_COLORS,
  RAL_GROUPS,
  ralByCode,
  ralGroup,
  ralName,
  type RalGroup,
} from "@/lib/ral";

// Enough to compare a few fronts, short enough for a readable message.
const MAX_SELECTED = 8;

// The shade that stands for each family in the filter chips.
const GROUP_SWATCH: Record<RalGroup, string> = {
  "1": "1021",
  "2": "2004",
  "3": "3020",
  "4": "4006",
  "5": "5015",
  "6": "6024",
  "7": "7016",
  "8": "8011",
  "9": "9010",
};

const GROUP_COUNTS = RAL_COLORS.reduce<Record<string, number>>((acc, c) => {
  const g = ralGroup(c.code);
  acc[g] = (acc[g] ?? 0) + 1;
  return acc;
}, {});

export default function RalPicker() {
  const t = useTranslations("colours");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const [group, setGroup] = useState<RalGroup | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      RAL_COLORS.filter(
        (c) =>
          (group === "all" || ralGroup(c.code) === group) &&
          (q === "" ||
            c.code.includes(q) ||
            c.nl.toLowerCase().includes(q) ||
            c.en.toLowerCase().includes(q)),
      ),
    [group, q],
  );

  const full = selected.length >= MAX_SELECTED;
  const selectedColors = selected.map(ralByCode);

  function toggle(code: string) {
    setSelected((current) =>
      current.includes(code)
        ? current.filter((c) => c !== code)
        : current.length >= MAX_SELECTED
          ? current
          : [...current, code],
    );
  }

  const chipClass = (active: boolean) =>
    `inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
      active
        ? "border-ink bg-ink text-cream"
        : "border-line bg-white/60 text-ink-soft hover:border-ink hover:text-ink"
    }`;

  return (
    <div>
      {/* Filters + search stay in view while the grid scrolls underneath. */}
      <div className="sticky top-16 z-30 -mx-5 border-b border-line bg-cream/92 px-5 py-4 backdrop-blur-md md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-350 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label={t("filterLabel")}
            className="flex flex-wrap gap-2"
          >
            <button
              type="button"
              onClick={() => setGroup("all")}
              aria-pressed={group === "all"}
              className={chipClass(group === "all")}
            >
              {t("filterAll")}
              <span className="text-xs opacity-60">{RAL_COLORS.length}</span>
            </button>
            {RAL_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                aria-pressed={group === g}
                className={chipClass(group === g)}
              >
                <span
                  aria-hidden
                  style={{ backgroundColor: ralByCode(GROUP_SWATCH[g]).hex }}
                  className="size-3 rounded-full border border-black/10"
                />
                {t(`groups.${g}`)}
                <span className="text-xs opacity-60">{GROUP_COUNTS[g]}</span>
              </button>
            ))}
          </div>
          <label className="relative block lg:w-72 lg:shrink-0">
            <span className="sr-only">{t("searchLabel")}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none"
            />
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {t("results", { count: visible.length })} · {t("selectHint")}
      </p>

      {visible.length === 0 ? (
        <p className="mt-10 text-base text-ink-soft">
          {t("noResults", { query: query.trim() })}
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {visible.map((c) => {
            const on = selected.includes(c.code);
            const name = ralName(c, locale);
            return (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => toggle(c.code)}
                  aria-pressed={on}
                  aria-label={`RAL ${c.code} ${name}`}
                  disabled={!on && full}
                  className="group w-full cursor-pointer rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span
                    style={{ backgroundColor: c.hex }}
                    className={`relative block aspect-4/3 w-full overflow-hidden rounded-sm border transition-transform duration-300 ease-out group-hover:scale-[1.02] ${
                      on
                        ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-cream"
                        : "border-black/10"
                    }`}
                  >
                    {on && (
                      <span
                        aria-hidden
                        className={`absolute top-2 right-2 grid size-6 place-items-center rounded-full ${
                          isLight(c.hex) ? "bg-ink text-cream" : "bg-white text-ink"
                        }`}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                    )}
                  </span>
                  <span className="mt-2 block text-sm font-medium tracking-tight-3 text-ink">
                    RAL {c.code}
                  </span>
                  <span className="block text-xs text-muted">{name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Room for the floating bar so it never hides the last row. */}
      {selected.length > 0 && <div aria-hidden className="h-44 md:h-32" />}

      <AnimatePresence>
        {selected.length > 0 && (
          <div className="pointer-events-none fixed inset-x-3 bottom-3 z-40 md:inset-x-8">
            <motion.div
              initial={reduceMotion ? false : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-white/10 bg-ink/85 p-4 text-white shadow-2xl backdrop-blur-xl md:flex md:items-center md:gap-6 md:p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-medium">
                    {t("selectedCount", { count: selected.length })}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelected([])}
                    className="cursor-pointer text-xs text-white/60 transition-colors hover:text-white"
                  >
                    {t("clear")}
                  </button>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {selectedColors.map((c) => (
                    <li key={c.code}>
                      <button
                        type="button"
                        onClick={() => toggle(c.code)}
                        aria-label={t("remove", { code: `RAL ${c.code}` })}
                        title={ralName(c, locale)}
                        className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 py-1 pr-2.5 pl-1 text-xs transition-colors hover:border-white/70"
                      >
                        <span
                          aria-hidden
                          style={{ backgroundColor: c.hex }}
                          className="size-5 rounded-full border border-white/25"
                        />
                        {c.code}
                        <span aria-hidden className="text-white/60">
                          ×
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                {full && (
                  <p className="mt-2 text-xs text-white/55">
                    {t("maxHint", { max: MAX_SELECTED })}
                  </p>
                )}
              </div>
              <Link
                href={{
                  pathname: "/",
                  query: { kleuren: selected.join(",") },
                  hash: "contact",
                }}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-cream md:mt-0 md:w-auto md:shrink-0"
              >
                {t("cta")}
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
