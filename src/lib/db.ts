import { neon } from "@neondatabase/serverless";

// Appointment storage (Neon Postgres via the Vercel marketplace). Without
// DATABASE_URL the site degrades gracefully to the old behaviour: the
// calendar shows every slot as free and nothing is blocked — same pattern
// as the Resend fallback in /api/offerte.

export const hasDb = Boolean(process.env.DATABASE_URL);

type Sql = ReturnType<typeof neon>;

let client: Sql | null = null;
let schemaReady: Promise<unknown> | null = null;

export function sql(): Sql {
  if (!client) {
    client = neon(process.env.DATABASE_URL!);
  }
  return client;
}

// Run the schema bootstrap once per server instance. `date` is a plain
// "YYYY-MM-DD" string and `time` "HH:MM" — no timezone ambiguity. The
// partial unique index is the double-booking guarantee: at most one
// non-released appointment per slot, enforced by Postgres itself.
export function dbReady(): Promise<unknown> {
  if (!schemaReady) {
    const db = sql();
    schemaReady = db`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL DEFAULT '',
        locale TEXT NOT NULL DEFAULT 'nl',
        status TEXT NOT NULL DEFAULT 'pending',
        admin_token TEXT NOT NULL,
        ip TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.then(
      () => db`
        CREATE UNIQUE INDEX IF NOT EXISTS appointments_active_slot
        ON appointments (date, time)
        WHERE status <> 'released'
      `,
    );
  }
  return schemaReady;
}

// Today's date in the showroom's timezone as "YYYY-MM-DD" (the server runs
// in UTC — a naive `new Date()` comparison would be wrong around midnight).
export function todayAmsterdam(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// Current hour (0-23) in the showroom's timezone, for same-day cutoffs.
export function hourAmsterdam(): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Amsterdam",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date()),
  );
}
