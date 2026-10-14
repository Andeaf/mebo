// Showroom appointment availability. Edit here — the calendar and time
// chips render from this, nothing is hardcoded in the markup.
export const booking = {
  // ISO weekdays the showroom takes appointments (1 = Monday … 7 = Sunday).
  openWeekdays: [2, 3, 4, 5], // Tue–Fri
  // First and last bookable slot, whole hours. Appointments run wider than
  // the showroom's opening hours (11.00–16.30): outside them the door opens
  // by appointment only.
  firstHour: 8,
  lastHour: 20,
} as const;

export function bookingTimes(): string[] {
  const times: string[] = [];
  for (let h = booking.firstHour; h <= booking.lastHour; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
  }
  return times;
}

// ISO weekday (1 = Monday … 7 = Sunday) for a Date.
export function isoWeekday(date: Date): number {
  return date.getDay() === 0 ? 7 : date.getDay();
}

// Server-side check of a requested slot, mirroring what the calendar offers:
// an open weekday, an hour on the grid, and not in the past. `now` is the
// showroom's current date ("YYYY-MM-DD") and hour (0-23) in Europe/Amsterdam,
// passed in so the rule does not depend on the server clock and stays testable.
export function isBookableSlot(
  date: string,
  time: string,
  now: { today: string; hour: number },
): boolean {
  const day = new Date(`${date}T12:00:00`);
  if (Number.isNaN(day.getTime())) return false;
  if (!(booking.openWeekdays as readonly number[]).includes(isoWeekday(day))) {
    return false;
  }
  if (!bookingTimes().includes(time)) return false;
  if (date < now.today) return false;
  // Same-day requests: only slots that are still ahead of the clock.
  if (date === now.today && Number(time.slice(0, 2)) <= now.hour) {
    return false;
  }
  return true;
}
