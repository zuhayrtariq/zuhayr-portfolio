"use client";

import { HOME_ZONE } from "@/components/site/local-time";
import SplitFlap from "@/components/ui/split-flap";
import { useEffect, useState } from "react";

/** Cells in each column of the board. */
const COLUMNS = { place: 12, time: 5, day: 3 };
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

const Row = ({ place, time, day, play }: { place: string; time: string; day: string; play: boolean }) => (
  <div aria-hidden className="flex items-center gap-[0.55em] px-[0.3em] py-[0.26em]">
    <SplitFlap text={place} width={COLUMNS.place} play={play} />
    <SplitFlap text={time} width={COLUMNS.time} play={play} delay={140} />
    <SplitFlap text={day} width={COLUMNS.day} play={play} delay={260} className="max-sm:hidden" />
  </div>
);

/**
 * His clock next to the visitor's, on the same kind of board as the arrivals, and what the
 * visitor's working day looks like from Islamabad. Everything is worked out from the
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
  const place = zone ? (zone.split("/").pop() ?? "").replace(/_/g, " ") : "";

  return (
    <section aria-labelledby="clocks-title" className="on-night relative bg-night">
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
          <div className="rounded-xl bg-[#0a1640] p-3 text-[clamp(11px,3.5vw,26px)] shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_50px_100px_-50px_rgb(0_0_0/0.9)] sm:p-5 lg:text-[clamp(13px,1.9vw,26px)]">
            <div aria-hidden className="flex gap-[0.55em] px-[0.3em] pb-[0.5em] text-fog [&>span>span]:text-[max(11px,0.52em)]">
              <span className="w-[15.11em] shrink-0">
                <span>Where</span>
              </span>
              <span className="w-[6.22em] shrink-0">
                <span>Time</span>
              </span>
              <span className="shrink-0 max-sm:hidden">
                <span>Day</span>
              </span>
            </div>
            <div className="space-y-[0.32em]">
              <Row place="Islamabad" time={home?.time ?? "--:--"} day={home?.day ?? ""} play />
              <Row place={place || "Your time"} time={yours?.time ?? "--:--"} day={yours?.day ?? ""} play />
            </div>
            <p className="sr-only" aria-live="off">
              {home && yours ? `It is ${home.long} in Islamabad, and ${yours.long} where you are.` : ""}
            </p>
          </div>

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
