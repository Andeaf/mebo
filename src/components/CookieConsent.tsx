"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  CONSENT_REOPEN_EVENT,
  readConsent,
  writeConsent,
} from "@/lib/consent";
import { hasAnyPixel } from "@/lib/marketing";

export default function CookieConsent() {
  const t = useTranslations("cookieBanner");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Without configured pixels the site sets no consent-requiring cookies,
    // so there is nothing to ask about.
    if (!hasAnyPixel) return;
    if (readConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  function choose(marketing: boolean) {
    writeConsent({ marketing });
    setOpen(false);
  }

  return (
    // z-80: above the sticky nav (z-50), below the intro overlay (z-90) and
    // the project lightbox (z-100).
    <div
      role="dialog"
      aria-label={t("aria")}
      className="fixed inset-x-4 bottom-4 z-80 md:inset-x-auto md:right-8 md:bottom-8 md:max-w-sm"
    >
      <div className="rounded-2xl border border-[#E6DFCE] bg-white p-6 shadow-[0_18px_40px_-24px_rgba(33,33,33,0.28)]">
        <h2 className="text-lg font-medium tracking-tight-3">{t("title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-soft">
          {t("body")}
        </p>
        <p className="mt-2 text-sm">
          <Link
            href="/cookies"
            className="text-muted underline underline-offset-2 hover:text-ink"
          >
            {t("link")}
          </Link>
        </p>
        {/* Refusing must be as easy as accepting (AP requirement): both
            choices sit side by side, same size, on the first layer. */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => choose(false)}
            className="cursor-pointer rounded-lg border border-ink px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream-dark"
          >
            {t("refuse")}
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="cursor-pointer rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-[#332C24]"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
