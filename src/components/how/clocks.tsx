"use client";

import { HOME_ZONE } from "@/components/site/local-time";
import { useEffect, useState } from "react";

/** The start of a working morning, lunch, and the end of the day, in the visitor's own time. */
const ANCHORS = [9, 13, 17];

/** How far a zone is ahead of UTC at a given moment, in minutes. */
const offsetOf = (zone: string, at: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).formatToParts(at);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"));
  return Math.round((asUtc - at.getTime()) / 60_000);
};

const clockOf = (zone: string, at: Date) => ({
  time: new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false }).format(at),
  day: new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "short" }).format(at),
  long: new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "long", hour: "numeric", minute: "2-digit" }).format(at),
});

/** Minutes after midnight as a time of day: 540 is "9 AM", 1110 is "6:30 PM". */
const spoken = (minutes: number) => {
  const inDay = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(inDay / 60);
  const minute = inDay % 60;
  return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2, "0")}` : ""} ${hour < 12 ? "AM" : "PM"}`;
};

const span = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const parts = [hours && `${hours} ${hours === 1 ? "hour" : "hours"}`, rest && `${rest} minutes`].filter(Boolean);
  return parts.join(" and ");
};

/**
 * His clock next to the visitor's, and what the visitor's working day looks like from
 * Islamabad. Everything is worked out from the
 * visitor's own device, so it says nothing it cannot know.
 */
const Clocks = () => {
  const [now, setNow] = useState<Date | null>(null);
  const [zone, setZone] = useState("");

  useEffect(() => {
    setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 10_000);
    return () => window.clearInterval(timer);
  }, []);

  const home = now ? clockOf(HOME_ZONE, now) : null;
  const yours = now && zone ? clockOf(zone, now) : null;
  /** How far ahead of the visitor he is, in minutes. Negative when he is behind. */
  const ahead = now && zone ? offsetOf(HOME_ZONE, now) - offsetOf(zone, now) : 0;
  // The city the visitor's time zone is named after.
  const place = zone ? (zone.split("/").pop() ?? "").replace(/_/g, " ") : "";

  return (
    <section aria-labelledby="clocks-title" className="on-pine relative bg-pine">
      <div className="mx-auto grid max-w-[1680px] gap-x-12 gap-y-12 px-[clamp(20px,4vw,64px)] py-24 md:py-36 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <h2 id="clocks-title" className="text-[clamp(34px,4.3vw,72px)]">
            Your day against mine.
          </h2>
          <p className="mt-7 max-w-[42ch] text-body text-fog lg:text-lead">
            I&apos;m on Pakistan time, five hours ahead of UTC, all year: there is no daylight saving here. This is what
            that means for you, worked out from your own clock.
          </p>
          <p className="mt-5 max-w-[42ch] text-body text-fog">
            Tell me your working hours when we talk, and I&apos;ll offer call times inside them.
          </p>
        </div>

        <div className="lg:col-span-7">
          <dl className="border-t">
            {[
              { name: "Islamabad", clock: home },
              { name: place || "Where you are", clock: yours },
            ].map((row) => (
              <div key={row.name} className="flex flex-wrap items-baseline justify-between gap-x-8 border-b py-5">
                <dt className="text-lead">{row.name}</dt>
                <dd className="flex items-baseline gap-4 font-mono tabular-nums">
                  <span className="text-[clamp(44px,6.4vw,104px)] font-bold leading-none tracking-[-0.04em]">{row.clock?.time ?? "--:--"}</span>
                  <span className="w-[3ch] text-lead text-fog">{row.clock?.day ?? ""}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="sr-only" aria-live="off">
            {home && yours ? `It is ${home.long} in Islamabad, and ${yours.long} where you are.` : ""}
          </p>

          {/* The visitor's day, read from Islamabad. Empty until the browser has said where they are. */}
          <div className="mt-8 min-h-[9.5rem] text-body sm:mt-10 lg:text-lead">
            {now && zone && ahead === 0 && <p>We&apos;re on the same clock.</p>}
            {now && zone && ahead !== 0 && (
              <>
                <p className="text-fog">
                  I&apos;m {span(Math.abs(ahead))} {ahead > 0 ? "ahead of" : "behind"} you.
                </p>
                <ul className="mt-4 border-t">
                  {ANCHORS.map((hour) => {
                    const mine = hour * 60 + ahead;
                    const shift = Math.floor(mine / 1440);
                    return (
                      <li key={hour} className="flex flex-wrap items-baseline justify-between gap-x-8 border-b py-3">
                        <span>Your {spoken(hour * 60)}</span>
                        <span className="text-fog">
                          is my {spoken(mine)}
                          {shift > 0 ? ", the next day" : shift < 0 ? ", the day before" : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clocks;
