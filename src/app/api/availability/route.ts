import { NextResponse } from "next/server";
import { dbReady, hasDb, sql } from "@/lib/db";

// Booked slots for one month, consumed by the booking calendar:
// GET /api/availability?year=2026&month=8 →
//   { booked: { "2026-08-28": ["13:00", "15:00"], ... } }
// Only date+time leave the server — never names or contact details.
// Without a database every slot is free, matching the old behaviour.

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const year = Number(params.get("year"));
  const month = Number(params.get("month"));
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    year < 2024 ||
    year > 2100 ||
    month < 1 ||
    month > 12
  ) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const booked: Record<string, string[]> = {};

  if (hasDb) {
    await dbReady();
    const prefix = `${year}-${String(month).padStart(2, "0")}-`;
    const rows = (await sql()`
      SELECT date, time FROM appointments
      WHERE status <> 'released' AND date LIKE ${prefix + "%"}
    `) as { date: string; time: string }[];
    for (const row of rows) {
      (booked[row.date] ??= []).push(row.time);
    }
  }

  return NextResponse.json(
    { booked },
    { headers: { "Cache-Control": "no-store" } },
  );
}
