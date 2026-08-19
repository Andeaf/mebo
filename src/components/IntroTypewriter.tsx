"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Opening sequence after danielblue.com, compressed to ~2.5s: project
 * captions type in letter by letter at their collage positions, hold and
 * delete again, while the brand name types in the centre from the 1s mark;
 * once both are done the page fades in.
 *
 * Skippable with a click/keypress and plays once per browser session.
 */

const SEEN_KEY = "mebo-intro-seen";

// Scattered caption positions (viewport percentages), like the reference.
const SPOTS: React.CSSProperties[] = [
  { top: "15%", left: "9%" },
  { top: "15%", right: "12%" },
  { top: "48%", left: "4%" },
  { top: "48%", right: "9%" },
  { bottom: "16%", left: "12%" },
  { bottom: "16%", right: "13%" },
];

const TYPE_MS = 14; // per character while typing
const DELETE_MS = 8; // per character while deleting
const STAGGER = 4; // characters of head start between captions
const HOLD_TICKS = 8; // pause with everything typed
const BRAND_DELAY = 1000; // brand starts typing at the 1s mark
const BRAND_TYPE_MS = 110;
const BRAND_HOLD_TICKS = 5; // hold with the brand fully typed

export default function IntroTypewriter() {
  const t = useTranslations("intro");
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [counts, setCounts] = useState<number[]>(Array(SPOTS.length).fill(0));
  const [brandCount, setBrandCount] = useState(0);
  const timers = useRef<number[]>([]);

  const captions = SPOTS.map((_, i) => t(`captions.${i}`));
  const brand = "mebo";

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem(SEEN_KEY)) {
      setVisible(false);
      return;
    }

    const maxLen = Math.max(...captions.map((c) => c.length));
    const totalTicks = maxLen + STAGGER * (captions.length - 1);
    let captionsDone = false;
    let brandDone = false;

    const finish = () => {
      sessionStorage.setItem(SEEN_KEY, "1");
      setFading(true);
      timers.current.push(window.setTimeout(() => setVisible(false), 520));
    };

    const maybeFinish = () => {
      if (captionsDone && brandDone) finish();
    };

    // Captions: type in, hold, delete again.
    let tick = 0;
    let phase: "type" | "hold" | "delete" = "type";
    const step = () => {
      tick += 1;
      if (phase === "type") {
        setCounts(captions.map((c, i) => Math.max(0, Math.min(c.length, tick - i * STAGGER))));
        if (tick >= totalTicks) {
          phase = "hold";
          tick = 0;
        }
        timers.current.push(window.setTimeout(step, TYPE_MS));
      } else if (phase === "hold") {
        if (tick >= HOLD_TICKS) {
          phase = "delete";
          tick = 0;
        }
        timers.current.push(window.setTimeout(step, TYPE_MS));
      } else {
        setCounts(
          captions.map((c, i) =>
            Math.max(0, Math.min(c.length, totalTicks - i * STAGGER - tick)),
          ),
        );
        if (tick >= totalTicks) {
          captionsDone = true;
          maybeFinish();
          return;
        }
        timers.current.push(window.setTimeout(step, DELETE_MS));
      }
    };
    timers.current.push(window.setTimeout(step, 100));

    // Brand: runs in parallel, starting at the 1s mark.
    let brandTick = 0;
    const brandStep = () => {
      brandTick += 1;
      setBrandCount(Math.min(brand.length, brandTick));
      if (brandTick >= brand.length + BRAND_HOLD_TICKS) {
        brandDone = true;
        maybeFinish();
        return;
      }
      timers.current.push(window.setTimeout(brandStep, BRAND_TYPE_MS));
    };
    timers.current.push(window.setTimeout(brandStep, BRAND_DELAY));

    const skip = () => {
      timers.current.forEach(clearTimeout);
      finish();
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    const timersAtMount = timers.current;
    return () => {
      timersAtMount.forEach(clearTimeout);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-90 bg-white transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {SPOTS.map((style, i) => (
        <span
          key={i}
          style={style}
          className="absolute font-intro-serif text-[11px] font-medium tracking-[0.18em] text-neutral-800 uppercase md:text-[13px]"
        >
          {captions[i].slice(0, counts[i])}
        </span>
      ))}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-intro-serif text-3xl font-medium tracking-[0.42em] text-neutral-900 md:text-4xl">
        {brand.slice(0, brandCount)}
        {brandCount > 0 && brandCount < brand.length && (
          <span className="caret-blink" aria-hidden>
            |
          </span>
        )}
      </span>
      <span className="absolute right-5 bottom-5 text-[11px] tracking-[0.14em] text-neutral-400 uppercase">
        {t("skip")} — {""}
        <kbd className="not-italic">esc</kbd>
      </span>
    </div>
  );
}
