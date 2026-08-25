// Thin wrapper around the Resend HTTP API, shared by the appointment
// routes. Returns true on success; failures are logged and reported as
// false so callers decide what degrades.

type EmailPayload = {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[]; // content = base64
};

export function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        process.env.QUOTE_FROM_EMAIL ||
        "Mebo offerteformulier <onboarding@resend.dev>",
      to: payload.to,
      reply_to: payload.replyTo || undefined,
      subject: payload.subject,
      text: payload.text,
      html: payload.html || undefined,
      attachments: payload.attachments || undefined,
    }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return false;
  }
  return true;
}
