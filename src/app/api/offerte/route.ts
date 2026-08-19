import { NextResponse } from "next/server";
import { company } from "@/lib/company";

// Quote-request endpoint: validates the form payload and forwards it as an
// email via Resend. Without RESEND_API_KEY it answers 503 and the client
// falls back to a mailto: compose, so no request is ever lost.

function field(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
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
  const locale = field(data.locale, 5);
  const website = field(data.website, 200); // honeypot
  const startedAt = typeof data.startedAt === "number" ? data.startedAt : 0;
  const message =
    typeof data.message === "string" ? data.message.trim().slice(0, 4000) : "";

  // Honeypot filled or submitted within 2s of page load: almost certainly a
  // bot — pretend success so it learns nothing.
  if (website || (startedAt > 0 && Date.now() - startedAt < 2000)) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !phone || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  // The owner reads Dutch — the notification email is always in Dutch,
  // whichever language the visitor used.
  const text = [
    `Naam: ${name}`,
    `Telefoon: ${phone}`,
    `E-mail: ${email || "-"}`,
    `Type project: ${projectType || "-"}`,
    `Indicatief budget: ${budget || "-"}`,
    "",
    message,
    "",
    `— Verzonden via het offerteformulier op ${company.siteUrl} (${locale || "nl"})`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.QUOTE_FROM_EMAIL || "Mebo offerteformulier <onboarding@resend.dev>",
      to: [process.env.QUOTE_TO_EMAIL || company.email],
      reply_to: email || undefined,
      subject: `Offerteaanvraag van ${name}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
