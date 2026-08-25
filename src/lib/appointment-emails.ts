import { company } from "@/lib/company";

// Email content for the appointment flow. The owner reads Dutch, so the
// notification is always Dutch; the visitor gets their own language (the
// form passes the locale). These strings live here rather than in
// messages/*.json because they render server-side in emails, not in the UI.

export type AppointmentInfo = {
  name: string;
  phone: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  locale: string; // "nl" | "en"
};

const APPOINTMENT_MINUTES = 45; // matches "±45 min" on the booking card

function formatDate(date: string, time: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T${time}:00`));
}

const showroomAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}`;

// Minimal iCalendar file so the appointment lands in a calendar app with
// one tap. Times are wall-clock Amsterdam time via TZID (no VTIMEZONE
// block — Google/Apple/Outlook resolve the IANA name themselves).
export function buildIcs(info: AppointmentInfo, uid: string): string {
  const start = new Date(`${info.date}T${info.time}:00Z`);
  const end = new Date(start.getTime() + APPOINTMENT_MINUTES * 60 * 1000);
  const local = (d: Date) =>
    d.toISOString().slice(0, 19).replace(/[-:]/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const summary =
    info.locale === "en" ? "Showroom appointment — Mebo" : "Showroomafspraak — Mebo";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mebo//Afspraak//NL",
    "BEGIN:VEVENT",
    `UID:${uid}@mebokeukens.nl`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Amsterdam:${local(start)}`,
    `DTEND;TZID=Europe/Amsterdam:${local(end)}`,
    `SUMMARY:${summary}`,
    `LOCATION:${showroomAddress}`,
    `DESCRIPTION:${info.name} — ${info.phone}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// "Request received, awaiting confirmation" — sent to the visitor right
// after booking.
export function visitorReceivedEmail(info: AppointmentInfo): {
  subject: string;
  text: string;
} {
  const when = `${formatDate(info.date, info.time, info.locale)}, ${info.time}`;
  if (info.locale === "en") {
    return {
      subject: "We received your appointment request — Mebo",
      text: [
        `Dear ${info.name},`,
        "",
        `Thank you for your request. We have received your preferred appointment:`,
        "",
        `    ${when} (±45 min)`,
        `    Showroom: ${showroomAddress}`,
        "",
        "Your time slot is reserved and awaiting our confirmation. You will receive a confirmation email within 1–2 working days.",
        "",
        `Questions in the meantime? Call or message us at ${company.phoneDisplay}, or reply to this email.`,
        "",
        "Kind regards,",
        `${company.legalName}`,
        company.siteUrl,
      ].join("\n"),
    };
  }
  return {
    subject: "We hebben je afspraakaanvraag ontvangen — Mebo",
    text: [
      `Beste ${info.name},`,
      "",
      "Bedankt voor je aanvraag. We hebben je gewenste afspraak ontvangen:",
      "",
      `    ${when} (±45 min)`,
      `    Showroom: ${showroomAddress}`,
      "",
      "Je tijdslot is gereserveerd en wacht op onze bevestiging. Binnen 1–2 werkdagen ontvang je een bevestiging per e-mail.",
      "",
      `Vragen in de tussentijd? Bel of app ons via ${company.phoneDisplay}, of beantwoord deze e-mail.`,
      "",
      "Met vriendelijke groet,",
      `${company.legalName}`,
      company.siteUrl,
    ].join("\n"),
  };
}

// "Appointment confirmed" — sent to the visitor when the owner clicks
// Bevestigen in the notification email.
export function visitorConfirmedEmail(info: AppointmentInfo): {
  subject: string;
  text: string;
} {
  const when = `${formatDate(info.date, info.time, info.locale)}, ${info.time}`;
  if (info.locale === "en") {
    return {
      subject: "Your appointment is confirmed — Mebo",
      text: [
        `Dear ${info.name},`,
        "",
        "Good news: your appointment is confirmed!",
        "",
        `    ${when} (±45 min)`,
        `    Showroom: ${showroomAddress}`,
        "",
        "The attached calendar file adds the appointment to your agenda with one tap.",
        "",
        `Need to reschedule? Call or message us at ${company.phoneDisplay}, or reply to this email.`,
        "",
        "See you soon!",
        `${company.legalName}`,
        company.siteUrl,
      ].join("\n"),
    };
  }
  return {
    subject: "Je afspraak is bevestigd — Mebo",
    text: [
      `Beste ${info.name},`,
      "",
      "Goed nieuws: je afspraak is bevestigd!",
      "",
      `    ${when} (±45 min)`,
      `    Showroom: ${showroomAddress}`,
      "",
      "Met het bijgevoegde agendabestand zet je de afspraak met één tik in je agenda.",
      "",
      `Verhinderd of liever een ander moment? Bel of app ons via ${company.phoneDisplay}, of beantwoord deze e-mail.`,
      "",
      "Tot snel!",
      `${company.legalName}`,
      company.siteUrl,
    ].join("\n"),
  };
}

// Owner notification. Plain-text lines plus a small HTML version with two
// action buttons (confirm / release) when the booking is stored in the
// database.
export function ownerEmail(
  info: AppointmentInfo,
  details: { projectType: string; budget: string; message: string },
  adminToken: string | null,
): { subject: string; text: string; html?: string } {
  const when = `${formatDate(info.date, info.time, "nl")} om ${info.time}`;
  const lines = [
    `Naam: ${info.name}`,
    `Telefoon: ${info.phone}`,
    `E-mail: ${info.email || "-"}`,
    `Gewenste afspraak: ${when}`,
    `Type project: ${details.projectType || "-"}`,
    `Indicatief budget: ${details.budget || "-"}`,
    "",
    details.message,
    "",
    `— Verzonden via het afsprakenformulier op ${company.siteUrl} (${info.locale})`,
  ];

  if (!adminToken) {
    return {
      subject: `Afspraakaanvraag van ${info.name} — ${info.date} ${info.time}`,
      text: lines.join("\n"),
    };
  }

  const confirmUrl = `${company.siteUrl}/api/beheer?token=${adminToken}&action=confirm`;
  const releaseUrl = `${company.siteUrl}/api/beheer?token=${adminToken}&action=release`;
  const text = [
    ...lines,
    "",
    "Het tijdslot is voorlopig geblokkeerd op de website.",
    `✓ Afspraak bevestigen (klant krijgt een bevestigingsmail): ${confirmUrl}`,
    `✗ Tijdslot vrijgeven (komt weer beschikbaar op de site): ${releaseUrl}`,
  ].join("\n");

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#6f6b64;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:4px 0">${esc(value)}</td></tr>`;
  const html = `
<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#212121;max-width:560px">
  <h2 style="font-size:18px;margin:0 0 12px">Nieuwe afspraakaanvraag</h2>
  <table style="border-collapse:collapse;font-size:14px">
    ${row("Naam", info.name)}
    ${row("Telefoon", info.phone)}
    ${row("E-mail", info.email || "-")}
    ${row("Afspraak", when)}
    ${row("Type project", details.projectType || "-")}
    ${row("Budget", details.budget || "-")}
  </table>
  ${details.message ? `<p style="font-size:14px;white-space:pre-wrap;border-left:3px solid #e3e0da;padding-left:12px;margin:16px 0">${esc(details.message)}</p>` : ""}
  <p style="font-size:13px;color:#6f6b64;margin:16px 0 8px">Het tijdslot is voorlopig geblokkeerd op de website.</p>
  <p style="margin:0 0 24px">
    <a href="${confirmUrl}" style="display:inline-block;background:#212121;color:#f7f6f3;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:14px;margin-right:8px">✓&nbsp;Afspraak bevestigen</a>
    <a href="${releaseUrl}" style="display:inline-block;border:1px solid #212121;color:#212121;text-decoration:none;padding:9px 18px;border-radius:8px;font-size:14px">✗&nbsp;Tijdslot vrijgeven</a>
  </p>
  <p style="font-size:12px;color:#6f6b64">Bij "bevestigen" ontvangt de klant automatisch een bevestigingsmail met agendabestand. Verzonden via het afsprakenformulier op ${company.siteUrl}.</p>
</div>`;

  return {
    subject: `Afspraakaanvraag van ${info.name} — ${info.date} ${info.time}`,
    text,
    html,
  };
}
