"use client";

import { useTranslations } from "next-intl";
import type { FormEvent } from "react";
import { company } from "@/lib/company";
import FadeUp from "./FadeUp";

function Icon({ path }: { path: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="mt-0.5 shrink-0 text-muted"
    >
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.8.7a2 2 0 0 1 1.7 2z",
  whatsapp:
    "M3 21l1.6-4.7A8.4 8.4 0 1 1 8 19.4L3 21zM8.5 9.5c1 2.5 3.5 5 6 6l1.5-1.5 2.5 1c.2 1.5-1 2.5-2.5 2.5-4.5 0-9.5-5-9.5-9.5C6 6.5 7 5.3 8.5 5.5l1 2.5-1 1.5z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  area: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
} as const;

export default function ContactSection() {
  const t = useTranslations("contact");

  // TODO: connect to Formspree/Resend later. Until then the form composes an
  // email in the visitor's own mail app, so no message can get lost silently.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `${t("form.name")}: ${data.get("name")}`,
      `${t("form.contact")}: ${data.get("contact")}`,
      "",
      `${data.get("message")}`,
    ].join("\n");
    const url = `mailto:${company.email}?subject=${encodeURIComponent(
      t("form.subject"),
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  const inputClass =
    "w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-muted/60 focus:outline-2 focus:outline-ink";

  return (
    <section id="contact" className="scroll-mt-16 bg-cream-dark px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-350">
        <FadeUp>
          <p className="text-sm font-medium text-muted">{t("eyebrow")}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight-3 text-balance md:text-[2.75rem] md:leading-[1.16]">
            {t("heading")}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-ink-soft">
            {t("intro")}
          </p>
        </FadeUp>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
          {/* Direct channels — always visible, the form is never a blocker */}
          <FadeUp>
            <ul className="flex flex-col divide-y divide-line">
              <li className="flex gap-4 py-4 first:pt-0">
                <Icon path={ICONS.phone} />
                <div>
                  <p className="text-sm text-muted">{t("phoneLabel")}</p>
                  <a
                    href={`tel:${company.phone}`}
                    className="font-medium text-ink hover:underline"
                  >
                    {company.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex gap-4 py-4">
                <Icon path={ICONS.whatsapp} />
                <div>
                  <p className="text-sm text-muted">{t("whatsappLabel")}</p>
                  <a
                    href={company.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink hover:underline"
                  >
                    {t("whatsappValue")}
                  </a>
                </div>
              </li>
              <li className="flex gap-4 py-4">
                <Icon path={ICONS.mail} />
                <div>
                  <p className="text-sm text-muted">{t("emailLabel")}</p>
                  <a
                    href={`mailto:${company.email}`}
                    className="font-medium text-ink hover:underline"
                  >
                    {company.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-4 py-4">
                <Icon path={ICONS.pin} />
                <div>
                  <p className="text-sm text-muted">{t("visitLabel")}</p>
                  <p className="font-medium text-ink">
                    {company.address.street}, {company.address.postalCode}{" "}
                    {company.address.city}
                  </p>
                </div>
              </li>
              <li className="flex gap-4 py-4">
                <Icon path={ICONS.area} />
                <div>
                  <p className="text-sm text-muted">{t("areaLabel")}</p>
                  <p className="font-medium text-ink">{t("areaValue")}</p>
                </div>
              </li>
              <li className="flex gap-4 py-4 last:pb-0">
                <Icon path={ICONS.clock} />
                <div>
                  <p className="text-sm text-muted">{t("hoursLabel")}</p>
                  <p className="font-medium text-ink">{t("hoursValue")}</p>
                </div>
              </li>
            </ul>
          </FadeUp>

          <FadeUp delay={0.1}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="text-lg font-medium tracking-tight-3">
                {t("form.title")}
              </h3>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-muted">{t("form.name")}</span>
                <input name="name" type="text" required className={inputClass} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-muted">{t("form.contact")}</span>
                <input name="contact" type="text" required className={inputClass} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-muted">{t("form.message")}</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder={t("form.messagePlaceholder")}
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                className="mt-1 cursor-pointer self-start rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink-soft"
              >
                {t("form.submit")}
              </button>
              <p className="text-sm text-pretty text-muted">{t("form.note")}</p>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
