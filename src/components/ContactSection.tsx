"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { company } from "@/lib/company";
import { booking, bookingTimes, isoWeekday } from "@/lib/booking";
import { trackLead } from "@/lib/marketing";
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
  pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
} as const;

function toISO(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export default function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const fmtLocale = locale === "nl" ? "nl-NL" : "en-GB";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [showOptional, setShowOptional] = useState(false);
  // The server drops submissions that arrive within 2s of page load (bots).
  const startedAt = useRef(Date.now());

  // --- Booking state ---------------------------------------------------
  // The page is statically prerendered, so "today" is only known on the
  // client: null until mount keeps server HTML and first client render
  // identical (no hydration mismatch — React does not patch mismatched
  // `disabled` attributes, which would leave stale past days clickable).
  const [today, setToday] = useState<Date | null>(null);
  const [nowHour, setNowHour] = useState<number | null>(null);
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  useEffect(() => {
    const d = new Date();
    setNowHour(d.getHours());
    d.setHours(0, 0, 0, 0);
    setToday(d);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dateError, setDateError] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);

  const times = useMemo(() => bookingTimes(), []);
  const openDays = booking.openWeekdays as readonly number[];

  // Booked slots per date ("YYYY-MM-DD" → ["13:00", …]), fetched per viewed
  // month from the server so taken slots grey out for everyone.
  const [booked, setBooked] = useState<Record<string, string[]>>({});
  const loadAvailability = useCallback((year: number, month0: number) => {
    fetch(`/api/availability?year=${year}&month=${month0 + 1}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { booked?: Record<string, string[]> } | null) => {
        if (data?.booked) setBooked((prev) => ({ ...prev, ...data.booked }));
      })
      .catch(() => {
        // Availability is progressive enhancement — on failure the calendar
        // simply shows every slot, like before.
      });
  }, []);
  useEffect(() => {
    loadAvailability(viewYear, viewMonth);
  }, [viewYear, viewMonth, loadAvailability]);

  // Times still bookable on a date: not taken, and not already past on the
  // current day. (The server re-validates all of this.)
  const availableTimesFor = useCallback(
    (date: Date): string[] => {
      const iso = toISO(date);
      const taken = booked[iso] ?? [];
      const isToday = today !== null && toISO(today) === iso;
      return times.filter(
        (time) =>
          !taken.includes(time) &&
          !(isToday && nowHour !== null && Number(time.slice(0, 2)) <= nowHour),
      );
    },
    [booked, times, today, nowHour],
  );

  // A slot that got booked from under the visitor's selection drops out.
  useEffect(() => {
    if (
      selectedDate &&
      selectedTime &&
      !availableTimesFor(selectedDate).includes(selectedTime)
    ) {
      setSelectedTime(null);
    }
  }, [selectedDate, selectedTime, availableTimesFor]);

  const monthLabel = new Intl.DateTimeFormat(fmtLocale, {
    month: "long",
    year: "numeric",
  }).format(new Date(viewYear, viewMonth, 1));

  // Weekday headers, Monday-first (2024-01-01 was a Monday).
  const weekdayLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(fmtLocale, { weekday: "short" });
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2024, 0, 1 + i)).slice(0, 2).toUpperCase(),
    );
  }, [fmtLocale]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const leadingBlanks = isoWeekday(new Date(viewYear, viewMonth, 1)) - 1;
  const atCurrentMonth =
    today === null ||
    (viewYear === today.getFullYear() && viewMonth === today.getMonth());

  function isSelectable(day: number): boolean {
    const date = new Date(viewYear, viewMonth, day);
    if (!openDays.includes(isoWeekday(date))) return false;
    if (today !== null && date < today) return false;
    // Fully booked (or, for today, out of remaining hours) → grey out.
    return availableTimesFor(date).length > 0;
  }

  function moveMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  const summaryDate = selectedDate
    ? new Intl.DateTimeFormat(fmtLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(selectedDate)
    : null;

  // --- Submit -----------------------------------------------------------
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedDate || !selectedTime) {
      setDateError(true);
      return;
    }
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
      appointmentDate: toISO(selectedDate),
      appointmentTime: selectedTime,
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
      if (res.status === 409) {
        // Someone booked this slot a moment earlier — refresh availability
        // and let the visitor pick again, keeping the rest of the form.
        setStatus("idle");
        setSlotTaken(true);
        setSelectedTime(null);
        loadAvailability(selectedDate.getFullYear(), selectedDate.getMonth());
        return;
      }
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("success");
      // No-op unless the visitor accepted marketing cookies and the ad
      // pixels are loaded (see src/lib/marketing.ts).
      trackLead();
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
        `${t("booking.yourAppointment")}: ${summaryDate}, ${selectedTime}`,
        "",
        payload.message,
      ].join("\n");
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
        t("form.subject"),
      )}&body=${encodeURIComponent(body)}`;
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[#E0D9C7] bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-muted/60 focus:outline-none focus:border-[#17150F]";
  const labelClass = "text-sm text-muted";

  return (
    <section id="contact" className="scroll-mt-16 bg-cream-dark px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-350">
        {status === "success" ? (
          <FadeUp>
            <div className="mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-[#E6DFCE] bg-white p-8">
              <h2 className="text-2xl font-medium tracking-tight-3">{t("form.title")}</h2>
              <p className="text-base leading-relaxed text-pretty text-ink-soft">
                {t("form.success")}
              </p>
            </div>
          </FadeUp>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid items-start gap-8 lg:grid-cols-[1fr_440px] lg:gap-x-16 lg:gap-y-0"
          >
            {/* --- Left column: the form ----------------------------------- */}
            <FadeUp className="lg:col-start-1 lg:row-start-1">
              <h2 className="text-3xl font-medium tracking-tight-3 text-balance md:text-[2.75rem] md:leading-[1.16]">
                {t("form.title")}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-ink-soft">
                {t("intro")}
              </p>

              <div className="mt-10 flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>{t("form.name")}</span>
                    <input
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className={inputClass}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={labelClass}>{t("form.phone")}</span>
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
                  <span className={labelClass}>{t("form.email")}</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>{t("form.message")}</span>
                  <textarea
                    name="message"
                    required
                    placeholder={t("form.messagePlaceholder")}
                    className={`${inputClass} min-h-[120px]`}
                  />
                </label>

                {/* Divider interrupted by the optional-details toggle */}
                <div className="mt-2 flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#DED6C4]" aria-hidden />
                  <button
                    type="button"
                    onClick={() => setShowOptional((v) => !v)}
                    aria-expanded={showOptional}
                    className="cursor-pointer text-[13px] text-[#8B8370] transition-colors hover:text-[#17150F]"
                  >
                    {showOptional
                      ? `− ${t("form.hideOptional")}`
                      : `+ ${t("form.moreOptional")}`}
                  </button>
                  <span className="h-px flex-1 bg-[#DED6C4]" aria-hidden />
                </div>

                {showOptional && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className={labelClass}>{t("form.projectType")}</span>
                      <select name="projectType" defaultValue="" className={inputClass}>
                        <option value="">{t("form.selectPlaceholder")}</option>
                        <option value="keuken">{t("form.projectTypeOptions.keuken")}</option>
                        <option value="meubel">{t("form.projectTypeOptions.meubel")}</option>
                        <option value="beide">{t("form.projectTypeOptions.beide")}</option>
                        <option value="anders">{t("form.projectTypeOptions.anders")}</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className={labelClass}>{t("form.budget")}</span>
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
                )}

                {/* Honeypot — invisible to visitors, tempting for bots */}
                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

              </div>
            </FadeUp>

            {/* --- Booking card (mobile: after the form, desktop: right column) --- */}
            <FadeUp
              delay={0.1}
              className="self-start lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:row-span-2"
            >
              <div className="rounded-2xl border border-[#E6DFCE] bg-white p-[30px] shadow-[0_18px_40px_-24px_rgba(33,33,33,0.18)]">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-medium tracking-tight-3">{t("booking.title")}</h3>
                  <span className="text-sm whitespace-nowrap text-muted">{t("booking.duration")}</span>
                </div>

                {/* Month navigation */}
                <div className="mt-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => moveMonth(-1)}
                    disabled={atCurrentMonth}
                    aria-label={t("booking.prevMonth")}
                    className="grid size-9 cursor-pointer place-items-center rounded-full border border-[#E6DFCE] text-ink transition-colors hover:bg-[#E7DFCC] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"
                  >
                    &#8249;
                  </button>
                  <p className="text-base font-medium">{monthLabel}</p>
                  <button
                    type="button"
                    onClick={() => moveMonth(1)}
                    aria-label={t("booking.nextMonth")}
                    className="grid size-9 cursor-pointer place-items-center rounded-full border border-[#E6DFCE] text-ink transition-colors hover:bg-[#E7DFCC]"
                  >
                    &#8250;
                  </button>
                </div>

                {/* Calendar */}
                <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                  {weekdayLabels.map((label) => (
                    <span key={label} className="py-1 text-[11px] font-medium uppercase text-muted">
                      {label}
                    </span>
                  ))}
                  {Array.from({ length: leadingBlanks }, (_, i) => (
                    <span key={`blank-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const enabled = isSelectable(day);
                    const iso = toISO(new Date(viewYear, viewMonth, day));
                    const selected = selectedDate !== null && toISO(selectedDate) === iso;
                    return (
                      <button
                        key={iso}
                        type="button"
                        disabled={!enabled}
                        onClick={() => {
                          setSelectedDate(new Date(viewYear, viewMonth, day));
                          setDateError(false);
                          setSlotTaken(false);
                        }}
                        className={`h-11 cursor-pointer rounded-lg text-sm transition-colors lg:h-10 ${
                          selected
                            ? "bg-[#1D1A16] font-medium text-[#F7F3EC]"
                            : enabled
                              ? "text-ink hover:bg-[#E7DFCC]"
                              : "cursor-default text-[#C6BDA9]"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <hr className="mt-5 border-[#DED6C4]" />

                {/* Time slots */}
                <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-muted">
                  {t("booking.availableTimes")}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 lg:flex lg:flex-wrap">
                  {times.map((time) => {
                    const selected = selectedTime === time;
                    const available =
                      selectedDate === null ||
                      availableTimesFor(selectedDate).includes(time);
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={!available}
                        onClick={() => {
                          setSelectedTime(time);
                          setDateError(false);
                          setSlotTaken(false);
                        }}
                        className={`rounded-lg border px-2 py-3 text-center text-sm transition-colors lg:rounded-full lg:px-4 lg:py-2 ${
                          selected
                            ? "cursor-pointer border-[#1D1A16] bg-[#1D1A16] font-medium text-[#F7F3EC]"
                            : available
                              ? "cursor-pointer border-[#E0D9C7] text-ink hover:bg-[#E7DFCC]"
                              : "cursor-default border-[#EAE4D6] text-[#C6BDA9] line-through"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>

                <hr className="mt-5 border-[#DED6C4]" />

                {/* Summary */}
                <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-muted">
                  {t("booking.yourAppointment")}
                </p>
                <p
                  className={`mt-2 text-base ${
                    summaryDate && selectedTime ? "font-medium text-ink" : "text-muted"
                  }`}
                  aria-live="polite"
                >
                  {summaryDate
                    ? selectedTime
                      ? `${summaryDate}, ${selectedTime}`
                      : t("booking.pickTimeFor", { date: summaryDate })
                    : t("booking.pickDate")}
                </p>
                {dateError && (
                  <p className="mt-2 text-sm text-pretty text-[#9a3324]">
                    {t("booking.missingDateTime")}
                  </p>
                )}
                {slotTaken && (
                  <p className="mt-2 text-sm text-pretty text-[#9a3324]" role="alert">
                    {t("booking.slotTaken")}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-5 w-full cursor-pointer rounded-lg bg-ink px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-[#332C24] disabled:cursor-default disabled:opacity-60"
                >
                  {status === "sending" ? t("form.sending") : t("form.submit")}
                </button>
                {status === "error" && (
                  <p className="mt-3 text-sm text-pretty text-[#9a3324]">
                    {t("form.errorMailto")}
                  </p>
                )}
                <p className="mt-3 text-center text-sm text-muted">
                  {t("booking.microcopy")} · {company.address.street}, {company.address.city}
                </p>
              </div>
            </FadeUp>

            {/* Direct channels — the form is never a blocker */}
            <FadeUp className="lg:col-start-1 lg:row-start-2 lg:mt-6">
              <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                <div className="flex gap-3">
                  <Icon path={ICONS.phone} />
                  <a
                    href={`tel:${company.phone}`}
                    className="font-medium text-ink hover:underline"
                  >
                    {company.phoneDisplay}
                  </a>
                </div>
                <div className="flex gap-3">
                  <Icon path={ICONS.whatsapp} />
                  <a
                    href={company.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink hover:underline"
                  >
                    {t("whatsappLabel")} — {t("whatsappValue")}
                  </a>
                </div>
                <div className="flex gap-3">
                  <Icon path={ICONS.pin} />
                  <p className="font-medium text-ink">
                    {company.address.street}, {company.address.postalCode}{" "}
                    {company.address.city}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Icon path={ICONS.clock} />
                  <p className="font-medium text-ink">{t("hoursValue")}</p>
                </div>
              </div>
            </FadeUp>
          </form>
        )}
      </div>
    </section>
  );
}
