"use client";

import LocalTime from "@/components/site/local-time";
import Sign from "@/components/ui/sign";
import { SITE } from "@/constants/site";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

interface Dial {
  label: string;
  note: string;
  /** What the needle points at, and the end of the scale. */
  value: number;
  max: number;
  /** The reading, written out. */
  read: string;
  /** The numbers around the face, from the start of the scale to its end. */
  scale: string[];
}

/** Six facts, all of them checkable on his public Upwork profile or on this site. */
const DIALS: Dial[] = [
  { label: "Client rating", note: "Across 13 reviews on Upwork", value: 5, max: 5, read: "5.0", scale: ["0", "1", "2", "3", "4", "5"] },
  { label: "Job success", note: "My score on Upwork", value: 100, max: 100, read: "100%", scale: ["0", "20", "40", "60", "80", "100"] },
  { label: "Hours logged", note: "Of client work, roughly", value: 2500, max: 3000, read: "2,500", scale: ["0", "1k", "2k", "3k"] },
  { label: "Jobs delivered", note: "On Upwork", value: 18, max: 20, read: "18", scale: ["0", "5", "10", "15", "20"] },
  { label: "Projects shipped", note: "For 10+ clients since 2022", value: 30, max: 40, read: "30+", scale: ["0", "10", "20", "30", "40"] },
  { label: "Top Rated Plus", note: "The top 3% of freelancers on Upwork", value: 97, max: 100, read: "Top 3%", scale: ["0", "25", "50", "75", "100"] },
];

/** The scale runs three quarters of the way round, from lower left to lower right. */
const START = -135;
const SWEEP = 270;

const Gauge = ({ dial, live, delay }: { dial: Dial; live: boolean; delay: number }) => {
  const divisions = dial.scale.length - 1;
  const ticks = divisions * 5;
  const angle = START + SWEEP * (dial.value / dial.max);
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`${dial.label}: ${dial.read}`} className="block w-full">
      <circle cx="100" cy="100" r="99" fill="#16266a" />
      <circle cx="100" cy="100" r="92" fill="#050d28" />
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const major = i % 5 === 0;
        return (
          <line
            key={i}
            x1="100"
            y1={major ? 15 : 17}
            x2="100"
            y2={major ? 29 : 23}
            stroke={major ? "#f1f5fa" : "#7183c0"}
            strokeWidth={major ? 2.6 : 1.3}
            transform={`rotate(${START + (SWEEP * i) / ticks} 100 100)`}
          />
        );
      })}
      {dial.scale.map((mark, i) => {
        const a = ((START + (SWEEP * i) / divisions) * Math.PI) / 180;
        return (
          <text
            key={mark}
            // Rounded, so the server and the browser print the same digits.
            x={(100 + 59 * Math.sin(a)).toFixed(2)}
            y={(100 - 59 * Math.cos(a)).toFixed(2)}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
            fill="#c5d0f2"
            className="font-mono"
          >
            {mark}
          </text>
        );
      })}
      <text
        x="100"
        y="170"
        textAnchor="middle"
        fontSize={dial.read.length > 5 ? 17 : 22}
        fontWeight="800"
        fill="#ffffff"
        className="font-display font-stretch-[120%]"
      >
        {dial.read}
      </text>
      <g
        style={{
          transform: `rotate(${live ? angle : START}deg)`,
          transformOrigin: "100px 100px",
          transition: live ? `transform 1.9s cubic-bezier(0.3, 1.35, 0.5, 1) ${delay}ms` : "none",
        }}
      >
        <polygon points="100,20 104.5,100 100,116 95.5,100" fill="#ffce1f" />
      </g>
      <circle cx="100" cy="100" r="9" fill="#16266a" stroke="#ffce1f" strokeWidth="2.5" />
    </svg>
  );
};

/**
 * The record, as the six instruments in front of a pilot. Each needle sits on its true
 * reading in the page as served; in the browser it is wound back while still below the
 * screen, and swings up when the panel arrives.
 */
const Instruments = () => {
  const panel = useRef<HTMLUListElement>(null);
  const [live, setLive] = useState(true);

  useIsoLayoutEffect(() => {
    const el = panel.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setLive(false);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setLive(true);
      },
      { rootMargin: "0px 0px -25% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="record" aria-labelledby="record-title" className="on-cloud relative bg-cloud">
      <div className="mx-auto grid max-w-[1680px] gap-x-12 gap-y-12 px-[clamp(20px,4vw,64px)] py-24 md:py-36 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <h2 id="record-title" className="text-[clamp(32px,3.5vw,58px)]">
            Promises are easy. Read the instruments.
          </h2>
          <p className="mt-7 max-w-[42ch] text-body text-fog lg:text-lead">
            The rating, the job success score and Top Rated Plus all come from my public Upwork profile, where clients
            review each job after it&apos;s delivered.
          </p>
          <Sign href={SITE.upwork} tone="night" className="mt-8">
            Check it on Upwork
          </Sign>
          <p className="mt-10 flex max-w-[42ch] items-start gap-3 border-t pt-6 text-ui">
            <span aria-hidden className="relative mt-1.5 flex size-2.5 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-cobalt opacity-60 motion-reduce:hidden" />
              <span className="relative size-2.5 rounded-full bg-cobalt" />
            </span>
            <span>
              Taking on new projects. I&apos;m in Islamabad and work with clients worldwide; it&apos;s <LocalTime /> for
              me right now.
            </span>
          </p>
        </div>

        <ul
          ref={panel}
          className="on-night grid grid-cols-2 gap-x-5 gap-y-8 rounded-2xl bg-night p-5 shadow-[0_50px_100px_-45px_rgb(7_18_51/0.8)] sm:grid-cols-3 sm:p-8 lg:col-span-7 lg:gap-x-8 lg:p-10"
        >
          {DIALS.map((dial, i) => (
            <li key={dial.label}>
              <Gauge dial={dial} live={live} delay={i * 110} />
              <p className="mt-4 text-ui font-bold leading-tight">{dial.label}</p>
              <p className="mt-1 text-fine leading-snug text-fog">{dial.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Instruments;
