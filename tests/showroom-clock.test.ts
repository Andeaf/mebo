import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hourAmsterdam, todayAmsterdam } from "@/lib/db";

// The server runs in UTC; the showroom's date and hour must follow
// Europe/Amsterdam, including daylight saving time.
beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe("showroom clock", () => {
  it("is still the same day one minute before local midnight", () => {
    vi.setSystemTime(new Date("2026-10-14T21:59:00Z")); // 23:59 CEST
    expect(todayAmsterdam()).toBe("2026-10-14");
    expect(hourAmsterdam()).toBe(23);
  });

  it("moves to the next day at local midnight in summer time", () => {
    vi.setSystemTime(new Date("2026-10-14T22:30:00Z")); // 00:30 CEST
    expect(todayAmsterdam()).toBe("2026-10-15");
    expect(hourAmsterdam()).toBe(0);
  });

  it("uses UTC+1 in winter", () => {
    vi.setSystemTime(new Date("2026-12-31T23:30:00Z")); // 00:30 CET
    expect(todayAmsterdam()).toBe("2027-01-01");
    expect(hourAmsterdam()).toBe(0);
  });
});
