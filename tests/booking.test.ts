import { describe, expect, it } from "vitest";
import { bookingTimes, isBookableSlot, isoWeekday } from "@/lib/booking";

// Wednesday 14 October 2026, 10:00 in the showroom.
const now = { today: "2026-10-14", hour: 10 };

describe("bookingTimes", () => {
  it("offers whole hours from 08:00 to 20:00", () => {
    const times = bookingTimes();
    expect(times).toHaveLength(13);
    expect(times[0]).toBe("08:00");
    expect(times.at(-1)).toBe("20:00");
    expect(times.every((t) => /^\d{2}:00$/.test(t))).toBe(true);
  });
});

describe("isoWeekday", () => {
  it("numbers Monday 1 through Sunday 7", () => {
    expect(isoWeekday(new Date("2026-10-12T12:00:00"))).toBe(1);
    expect(isoWeekday(new Date("2026-10-18T12:00:00"))).toBe(7);
  });
});

describe("isBookableSlot", () => {
  it("accepts a future open weekday on the hour grid", () => {
    expect(isBookableSlot("2026-10-20", "14:00", now)).toBe(true); // Tuesday
    expect(isBookableSlot("2026-10-23", "08:00", now)).toBe(true); // Friday, first slot
    expect(isBookableSlot("2026-10-23", "20:00", now)).toBe(true); // Friday, last slot
  });

  it("rejects the days the showroom is closed", () => {
    expect(isBookableSlot("2026-10-19", "14:00", now)).toBe(false); // Monday
    expect(isBookableSlot("2026-10-24", "14:00", now)).toBe(false); // Saturday
    expect(isBookableSlot("2026-10-25", "14:00", now)).toBe(false); // Sunday
  });

  it("rejects times that are not on the grid", () => {
    for (const time of ["07:00", "21:00", "14:30", "2:00", ""]) {
      expect(isBookableSlot("2026-10-20", time, now)).toBe(false);
    }
  });

  it("rejects days in the past", () => {
    expect(isBookableSlot("2026-10-13", "14:00", now)).toBe(false);
  });

  it("accepts only hours still ahead of the clock today", () => {
    expect(isBookableSlot("2026-10-14", "09:00", now)).toBe(false);
    expect(isBookableSlot("2026-10-14", "10:00", now)).toBe(false);
    expect(isBookableSlot("2026-10-14", "11:00", now)).toBe(true);
  });

  it("rejects malformed dates", () => {
    expect(isBookableSlot("2026-13-01", "14:00", now)).toBe(false);
    expect(isBookableSlot("not-a-date", "14:00", now)).toBe(false);
  });
});
