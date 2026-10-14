import { dbReady, hasDb, sql } from "@/lib/db";
import {
  buildIcs,
  visitorConfirmedEmail,
  type AppointmentInfo,
} from "@/lib/appointment-emails";
import { sendEmail } from "@/lib/resend";
import { company } from "@/lib/company";

// Owner-only action links from the notification email:
//   /api/beheer?token=…&action=confirm  → confirm + email the visitor
//   /api/beheer?token=…&action=release  → free the slot on the site
// The token is a per-appointment 64-char secret; guessing one is not
// feasible, so no login is needed. Responses are small Dutch HTML pages —
// the owner opens these from their mail app.

type Row = {
  id: number;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  locale: string;
  status: string;
};

// Everything interpolated into the HTML below comes from the database, and
// the visitor typed some of it (their name), so escape it on the way out.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function page(rawTitle: string, rawBody: string): Response {
  const title = escapeHtml(rawTitle);
  const body = escapeHtml(rawBody);
  return new Response(
    `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title} — Mebo</title></head>
<body style="margin:0;background:#f7f6f3;color:#212121;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
<div style="max-width:480px;margin:15vh auto 0;padding:32px;background:#fff;border:1px solid #e3e0da;border-radius:16px">
<h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
<p style="font-size:15px;line-height:1.6;margin:0;color:#4a4a48">${body}</p>
</div>
</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

function describe(row: Row): string {
  const when = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${row.date}T12:00:00`));
  return `${row.name} — ${when} om ${row.time}`;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const token = params.get("token") ?? "";
  const action = params.get("action") ?? "";

  if (!hasDb) {
    return page("Niet beschikbaar", "Er is geen afsprakendatabase gekoppeld.");
  }
  if (!/^[0-9a-f]{64}$/.test(token) || !["confirm", "release"].includes(action)) {
    return page("Link ongeldig", "Deze link klopt niet of is verlopen.");
  }

  await dbReady();
  const db = sql();
  const rows = (await db`
    SELECT id, date, time, name, phone, email, locale, status
    FROM appointments WHERE admin_token = ${token}
  `) as Row[];
  const row = rows[0];
  if (!row) {
    return page("Link ongeldig", "Deze link klopt niet of is verlopen.");
  }

  if (action === "release") {
    if (row.status === "released") {
      return page(
        "Al vrijgegeven",
        `Het tijdslot van ${describe(row)} was al vrijgegeven en is beschikbaar op de website.`,
      );
    }
    await db`UPDATE appointments SET status = 'released' WHERE id = ${row.id}`;
    return page(
      "Tijdslot vrijgegeven",
      `Het tijdslot van ${describe(row)} is weer beschikbaar op de website. De klant heeft hierover géén automatische e-mail ontvangen — neem zelf even contact op (${row.phone}).`,
    );
  }

  // action === "confirm"
  if (row.status === "released") {
    return page(
      "Niet mogelijk",
      `Dit tijdslot is eerder vrijgegeven. Vraag de klant (${row.phone}) om een nieuwe afspraak te maken via de website.`,
    );
  }
  if (row.status === "confirmed") {
    return page(
      "Al bevestigd",
      `De afspraak van ${describe(row)} was al bevestigd; de klant heeft de bevestigingsmail eerder ontvangen.`,
    );
  }

  await db`UPDATE appointments SET status = 'confirmed' WHERE id = ${row.id}`;

  const info: AppointmentInfo = {
    name: row.name,
    phone: row.phone,
    email: row.email,
    date: row.date,
    time: row.time,
    locale: row.locale,
  };
  const confirmation = visitorConfirmedEmail(info);
  const ics = Buffer.from(buildIcs(info, token.slice(0, 32))).toString("base64");
  const sent = row.email
    ? await sendEmail({
        to: [row.email],
        replyTo: company.email,
        subject: confirmation.subject,
        text: confirmation.text,
        attachments: [{ filename: "afspraak.ics", content: ics }],
      })
    : false;

  return page(
    "Afspraak bevestigd",
    sent
      ? `De afspraak van ${describe(row)} is bevestigd. De klant heeft automatisch een bevestigingsmail met agendabestand ontvangen.`
      : `De afspraak van ${describe(row)} is bevestigd, maar de bevestigingsmail kon niet worden verzonden — neem zelf even contact op (${row.phone}).`,
  );
}
