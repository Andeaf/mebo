"use client";

import { CONSENT_REOPEN_EVENT } from "@/lib/consent";

// Small client island (the footer is a server component) that reopens the
// cookie banner so a visitor can change or withdraw an earlier choice.
export default function CookieSettingsLink({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))}
      className={className ?? "cursor-pointer hover:text-ink"}
    >
      {label}
    </button>
  );
}
