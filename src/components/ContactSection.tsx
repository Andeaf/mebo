"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, type FormEvent } from "react";
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
  instagram:
    "M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM17.5 6.5v.01",
  pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  area: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
} as const;

export default function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  // The server drops submissions that arrive within 2s of page load (bots).
  const startedAt = useRef(Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const projectTypeKey = String(data.get("projectType") ?? "");
    const budgetKey = String(data.get("budget") ?? "");
    const payload = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      projectType: projectTypeKey ? t(`form.projectTypeOptions.${projectTypeKey}`) : "",
      budget: budgetKey ? t(`form.budgetOptions.${budgetKey}`) : "",
      message: String(data.get("message") ?? ""),
      locale,
      website: String(data.get("website") ?? ""),
      startedAt: startedAt.current,
    };

    setStatus("sending");
    try {
      const res = await fetch("/api/offerte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("success");
    } catch {
      // Server unavailable or not configured — compose the email in the
      // visitor's own mail app instead, so the request is never lost.
      setStatus("error");
      const body = [
        `${t("form.name")}: ${payload.name}`,
        `${t("form.phone")}: ${payload.phone}`,
        `${t("form.email")}: ${payload.email || "-"}`,
        `${t("form.projectType")}: ${payload.projectType || "-"}`,
        `${t("form.budget")}: ${payload.budget || "-"}`,
        "",
        payload.message,
      ].join("\n");
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
        t("form.subject"),
      )}&body=${encodeURIComponent(body)}`;
    }
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
                <Icon path={ICONS.instagram} />
                <div>
                  <p className="text-sm text-muted">{t("instagramLabel")}</p>
                  <a
                    href={company.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink hover:underline"
                  >
                    {company.instagramHandle}
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
            {status === "success" ? (
              <div className="flex flex-col gap-3 rounded-sm border border-line bg-white p-6">
                <h3 className="text-lg font-medium tracking-tight-3">
                  {t("form.title")}
                </h3>
                <p className="text-base leading-relaxed text-pretty text-ink-soft">
                  {t("form.success")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="text-lg font-medium tracking-tight-3">
                  {t("form.title")}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-muted">{t("form.name")}</span>
                    <input
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className={inputClass}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-muted">{t("form.phone")}</span>
                    <input
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-muted">{t("form.email")}</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-muted">{t("form.projectType")}</span>
                    <select
                      name="projectType"
                      required
                      defaultValue=""
                      className={inputClass}
                    >
                      <option value="" disabled>
                        {t("form.selectPlaceholder")}
                      </option>
                      <option value="keuken">{t("form.projectTypeOptions.keuken")}</option>
                      <option value="meubel">{t("form.projectTypeOptions.meubel")}</option>
                      <option value="beide">{t("form.projectTypeOptions.beide")}</option>
                      <option value="anders">{t("form.projectTypeOptions.anders")}</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-muted">{t("form.budget")}</span>
                    <select name="budget" defaultValue="" className={inputClass}>
                      <option value="">{t("form.selectPlaceholder")}</option>
                      <option value="b1">{t("form.budgetOptions.b1")}</option>
                      <option value="b2">{t("form.budgetOptions.b2")}</option>
                      <option value="b3">{t("form.budgetOptions.b3")}</option>
                      <option value="b4">{t("form.budgetOptions.b4")}</option>
                      <option value="b5">{t("form.budgetOptions.b5")}</option>
                    </select>
                  </label>
                </div>
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
                {/* Honeypot — invisible to visitors, tempting for bots */}
                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-1 cursor-pointer self-start rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink-soft disabled:cursor-default disabled:opacity-60"
                >
                  {status === "sending" ? t("form.sending") : t("form.submit")}
                </button>
                {status === "error" && (
                  <p className="text-sm text-pretty text-[#9a3324]">
                    {t("form.errorMailto")}
                  </p>
                )}
                <p className="text-sm text-pretty text-muted">{t("form.note")}</p>
              </form>
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
