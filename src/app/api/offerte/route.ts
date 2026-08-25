import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { company } from "@/lib/company";
import { booking, bookingTimes, isoWeekday } from "@/lib/booking";
import { dbReady, hasDb, hourAmsterdam, sql, todayAmsterdam } from "@/lib/db";
import {
  buildIcs,
  ownerEmail,
  visitorReceivedEmail,
  type AppointmentInfo,
} from "@/lib/appointment-emails";
import { resendConfigured, sendEmail } from "@/lib/resend";

// Appointment endpoint. With DATABASE_URL set, the requested slot is
// reserved atomically (a partial unique index makes double-booking
// impossible) and both the owner and the visitor get an email; the owner's
// email carries confirm/release action links. Without the database or
// without RESEND_API_KEY the route degrades to the old behaviour (503 →
// the client falls back to a mailto: compose), so no request is ever lost.

const MAX_BOOKINGS_PER_IP_PER_DAY = 3;

function field(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  // U+FFFD is the "�" replacement character left behind by a broken
  // encoding upstream — drop it rather than let it reach the emails.
  return value
    .replace(/�/g, "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, max);
}

function isBookableSlot(date: string, time: string): boolean {
  const day = new Date(`${date}T12:00:00`);
  if (Number.isNaN(day.getTime())) return false;
  if (!(booking.openWeekdays as readonly number[]).includes(isoWeekday(day))) {
    return false;
  }
  if (!bookingTimes().includes(time)) return false;
  const today = todayAmsterdam();
  if (date < today) return false;
  // Same-day requests: only slots that are still ahead of the clock.
  if (date === today && Number(time.slice(0, 2)) <= hourAmsterdam()) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const name = field(data.name, 100);
  const phone = field(data.phone, 40);
  const email = field(data.email, 120);
  const projectType = field(data.projectType, 60);
  const budget = field(data.budget, 60);
  const appointmentDate = field(data.appointmentDate, 10);
  const appointmentTime = field(data.appointmentTime, 5);
  const locale = field(data.locale, 5) === "en" ? "en" : "nl";
  const website = field(data.website, 200); // honeypot
  const startedAt = typeof data.startedAt === "number" ? data.startedAt : 0;
  const message =
    typeof data.message === "string"
      ? data.message.replace(/�/g, "").trim().slice(0, 4000)
      : "";

  // Honeypot filled or submitted within 2s of page load: almost certainly a
  // bot — pretend success so it learns nothing.
  if (website || (startedAt > 0 && Date.now() - startedAt < 2000)) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !phone || !message || !email) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate) ||
    !/^\d{2}:\d{2}$/.test(appointmentTime)
  ) {
    return NextResponse.json({ error: "missing_appointment" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!isBookableSlot(appointmentDate, appointmentTime)) {
    return NextResponse.json({ error: "invalid_slot" }, { status: 400 });
  }

  // Check the email transport before reserving anything: without it the
  // client composes a mailto: instead, and a reserved-but-unannounced slot
  // would block the calendar for nothing.
  if (!resendConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const info: AppointmentInfo = {
    name,
    phone,
    email,
    date: appointmentDate,
    time: appointmentTime,
    locale,
  };

  let adminToken: string | null = null;
  let appointmentId: number | null = null;

  if (hasDb) {
    await dbReady();
    const db = sql();

    // Light anti-abuse brake: a handful of bookings per network per day is
    // plenty for real visitors; a flood gets stopped here.
    const ip = (request.headers.get("x-forwarded-for") ?? "")
      .split(",")[0]
      .trim();
    if (ip) {
      const recent = (await db`
        SELECT count(*)::int AS n FROM appointments
        WHERE ip = ${ip} AND created_at > now() - interval '1 day'
      `) as { n: number }[];
      if ((recent[0]?.n ?? 0) >= MAX_BOOKINGS_PER_IP_PER_DAY) {
        return NextResponse.json({ error: "rate_limited" }, { status: 429 });
      }
    }

    adminToken = randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
    try {
      const inserted = (await db`
        INSERT INTO appointments (date, time, name, phone, email, locale, admin_token, ip)
        VALUES (${appointmentDate}, ${appointmentTime}, ${name}, ${phone}, ${email}, ${locale}, ${adminToken}, ${ip})
        RETURNING id
      `) as { id: number }[];
      appointmentId = inserted[0]?.id ?? null;
    } catch (error) {
      // 23505 = the partial unique index rejected a second active booking
      // for this slot — someone else was a moment faster.
      if ((error as { code?: string })?.code === "23505") {
        return NextResponse.json({ error: "slot_taken" }, { status: 409 });
      }
      throw error;
    }
  }

  const ics = buildIcs(info, adminToken ?? randomUUID());
  const icsBase64 = Buffer.from(ics).toString("base64");
  const owner = ownerEmail(info, { projectType, budget, message }, adminToken);

  const ownerSent = await sendEmail({
    to: [process.env.QUOTE_TO_EMAIL || company.email],
    replyTo: email,
    subject: owner.subject,
    text: owner.text,
    html: owner.html,
    attachments: [{ filename: "afspraak.ics", content: icsBase64 }],
  });

  if (!ownerSent) {
    // Nobody was notified — free the slot again so the calendar stays
    // truthful, and let the client fall back to mailto.
    if (appointmentId !== null) {
      await sql()`
        UPDATE appointments SET status = 'released' WHERE id = ${appointmentId}
      `;
    }
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  // Courtesy copy to the visitor ("received, awaiting confirmation").
  // Best-effort: the booking itself already succeeded.
  const received = visitorReceivedEmail(info);
  await sendEmail({
    to: [email],
    replyTo: company.email,
    subject: received.subject,
    text: received.text,
  });

  return NextResponse.json({ ok: true });
}
