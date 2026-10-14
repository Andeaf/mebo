import { describe, expect, it } from "vitest";
import {
  buildIcs,
  ownerEmail,
  visitorConfirmedEmail,
  visitorReceivedEmail,
  type AppointmentInfo,
} from "@/lib/appointment-emails";

const info: AppointmentInfo = {
  name: "Jan de Vries",
  phone: "+31 6 00000000",
  email: "jan@example.com",
  date: "2026-10-20",
  time: "14:00",
  locale: "nl",
};
const details = {
  projectType: "Keuken",
  budget: "",
  message: "Graag <b>snel</b> & duidelijk",
};
const token = "a".repeat(64);

describe("buildIcs", () => {
  const ics = buildIcs(info, "abc123");
  const lines = ics.split("\r\n");

  it("is one event with CRLF line endings", () => {
    expect(lines[0]).toBe("BEGIN:VCALENDAR");
    expect(lines.at(-1)).toBe("END:VCALENDAR");
    expect(lines.filter((l) => l === "BEGIN:VEVENT")).toHaveLength(1);
    expect(lines.some((l) => /[\r\n]/.test(l))).toBe(false);
  });

  it("books 45 minutes in Amsterdam wall-clock time", () => {
    expect(lines).toContain("DTSTART;TZID=Europe/Amsterdam:20261020T140000");
    expect(lines).toContain("DTEND;TZID=Europe/Amsterdam:20261020T144500");
  });

  it("carries the given UID and a summary in the visitor's language", () => {
    expect(lines).toContain("UID:abc123@mebokeukens.nl");
    expect(lines).toContain("SUMMARY:Showroomafspraak — Mebo");
    expect(buildIcs({ ...info, locale: "en" }, "x")).toContain(
      "SUMMARY:Showroom appointment — Mebo",
    );
  });

  it("stamps the file in UTC", () => {
    expect(lines.find((l) => l.startsWith("DTSTAMP:"))).toMatch(
      /^DTSTAMP:\d{8}T\d{6}Z$/,
    );
  });
});

describe("ownerEmail", () => {
  it("adds confirm and release links when the booking is stored", () => {
    const mail = ownerEmail(info, details, token);
    for (const action of ["confirm", "release"]) {
      expect(mail.text).toContain(`/api/beheer?token=${token}&action=${action}`);
      expect(mail.html).toContain(`/api/beheer?token=${token}&action=${action}`);
    }
  });

  it("escapes what the visitor typed in the HTML version", () => {
    const mail = ownerEmail(
      { ...info, name: "<img src=x onerror=alert(1)>" },
      details,
      token,
    );
    expect(mail.html).not.toContain("<img src=x");
    expect(mail.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(mail.html).toContain("Graag &lt;b&gt;snel&lt;/b&gt; &amp; duidelijk");
  });

  it("falls back to plain text without action links when nothing is stored", () => {
    const mail = ownerEmail(info, details, null);
    expect(mail.html).toBeUndefined();
    expect(mail.text).not.toContain("/api/beheer");
    expect(mail.subject).toBe("Afspraakaanvraag van Jan de Vries — 2026-10-20 14:00");
    expect(mail.text).toContain("Indicatief budget: -");
  });
});

describe("visitor emails", () => {
  it("lead with the visitor's language and repeat the other below", () => {
    const nl = visitorReceivedEmail(info);
    expect(nl.subject).toBe("We hebben je afspraakaanvraag ontvangen — Mebo");
    const [first, second] = nl.text.split("\n\n----------\n\n");
    expect(first.startsWith("Beste Jan de Vries,")).toBe(true);
    expect(second.startsWith("Dear Jan de Vries,")).toBe(true);

    const en = visitorReceivedEmail({ ...info, locale: "en" });
    expect(en.subject).toBe("We received your appointment request — Mebo");
    expect(en.text.startsWith("Dear Jan de Vries,")).toBe(true);
  });

  it("state the date, time and showroom address in both languages", () => {
    const { subject, text } = visitorConfirmedEmail(info);
    expect(subject).toBe("Je afspraak is bevestigd — Mebo");
    expect(text).toContain("dinsdag 20 oktober 2026, 14:00");
    expect(text).toMatch(/Tuesday,? 20 October 2026, 14:00/);
    expect(text.match(/Plein 1945 50, 1971 GC IJmuiden/g)).toHaveLength(2);
  });
});
