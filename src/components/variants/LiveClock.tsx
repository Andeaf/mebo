"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Extra text after the time, e.g. "[IJMUIDEN]" */
  suffix?: string;
  className?: string;
};

// Live HH:MM:SS clock in Dutch local time. Renders empty on the server and
// fills in after mount to avoid a hydration mismatch.
export default function LiveClock({ suffix, className }: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("nl-NL", {
      timeZone: "Europe/Amsterdam",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {time}
      {time && suffix ? ` ${suffix}` : ""}
    </span>
  );
}
