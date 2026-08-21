// Showroom appointment availability. Edit here — the calendar and time
// chips render from this, nothing is hardcoded in the markup.
export const booking = {
  // ISO weekdays the showroom takes appointments (1 = Monday … 7 = Sunday).
  openWeekdays: [2, 3, 4, 5], // Tue–Fri
  // First and last bookable slot, whole hours (opening hours 11.00–16.30).
  firstHour: 11,
  lastHour: 16,
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
