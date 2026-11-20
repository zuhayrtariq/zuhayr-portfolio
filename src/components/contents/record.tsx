"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import BrandIcon from "@/components/ui/brand-icon";
import Globe from "@/components/ui/globe";
import { NumberTicker } from "@/components/ui/number-ticker";
import SpotlightCard from "@/components/ui/spotlight-card";
import { askAiHref, SITE } from "@/constants/site";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowUpRightIcon, StarIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

const ISLAMABAD: [number, number] = [33.6844, 73.0479];
const QUESTIONS = ["What have you shipped recently?", "How do you keep a project on schedule?", "Are you taking on new projects?"];

const EASE = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

const Tile = ({ className, children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) => (
  <motion.li
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={IN_VIEW}
    transition={{ duration: 0.9, delay, ease: EASE }}
    className={className}
  >
    <SpotlightCard
      spotlightColor="#ff8a5c"
      intensity={0.16}
      spotlightSize={320}
      borderGlow={0.9}
      proximity={140}
      className="h-full rounded-[28px] bg-[#101111] p-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
    >
      {children}
    </SpotlightCard>
  </motion.li>
);

const Label = ({ children }: { children: ReactNode }) => (
  <p className="flex items-center gap-2.5 text-fine text-fog">{children}</p>
);

/** The time where Zuhayr is, so a client can tell at a glance whether he is likely awake. */
const LocalTime = () => {
  const [now, setNow] = useState("");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Karachi", hour: "numeric", minute: "2-digit" });
    const tick = () => setNow(format.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 15_000);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="tabular-nums">{now || "\u2007\u2007:\u2007\u2007"}</span>;
};

const Record = ({ className }: { className?: string }) => {
  return (
    <ul className={cn("grid gap-4 lg:auto-rows-[196px] lg:grid-cols-12 lg:gap-5", className)}>
      {/* Rating */}
      <Tile className="lg:col-span-5 lg:row-span-2">
        <div className="relative flex h-full flex-col p-7 lg:p-9">
          <Label>
            <BrandIcon name="Upwork" className="size-5" /> Client rating on Upwork
          </Label>
          <p className="mt-10 font-display text-[clamp(132px,15vw,248px)] leading-[0.74] tracking-[-0.02em] lg:mt-auto">
            <NumberTicker value={5} startValue={4} decimalPlaces={1} />
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span role="img" aria-label="Five out of five stars" className="flex gap-1 text-signal">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.2, rotate: -40 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={IN_VIEW}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 + i * 0.09 }}
                >
                  <StarIcon aria-hidden className="size-7 fill-current" />
                </motion.span>
              ))}
            </span>
            <p className="text-ui text-fog">across 13 client reviews and 18 jobs</p>
          </div>
          <a
            href={SITE.upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-6 inline-flex w-fit items-center gap-1 text-ui font-bold"
          >
            See the Upwork profile <ArrowUpRightIcon aria-hidden className="size-4" />
          </a>
        </div>
        <BorderBeam size={220} duration={9} colorFrom="#ff4d1f" colorTo="#f0c28a" borderWidth={1.5} />
      </Tile>

      {/* Job success */}
      <Tile delay={0.08} className="lg:col-span-3 lg:row-span-2">
        <div className="flex h-full flex-col p-7 lg:p-9">
          <Label>Job success</Label>
          <div className="relative mx-auto my-8 aspect-square w-[min(100%,15rem)] lg:my-auto">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" strokeWidth="5" className="stroke-white/8" />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
                className="stroke-signal drop-shadow-[0_0_6px_rgb(255_77_31/0.7)]"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={IN_VIEW}
                transition={{ duration: 2, delay: 0.3, ease: EASE }}
              />
            </svg>
            <p className="absolute inset-0 grid place-items-center font-display text-[clamp(56px,5.4vw,84px)] leading-none">
              <span>
                <NumberTicker value={100} delay={0.3} />%
              </span>
            </p>
          </div>
          <p className="text-ui text-fog">My job success score on Upwork.</p>
        </div>
      </Tile>

      {/* Hours */}
      <Tile delay={0.16} className="lg:col-span-4">
        <div className="flex h-full flex-col justify-between gap-6 p-7 lg:p-8">
          <Label>Hours of client work, roughly</Label>
          <div className="flex items-end justify-between gap-6">
            <p className="font-display text-[clamp(72px,6.8vw,112px)] leading-[0.78]">
              <NumberTicker value={2500} startValue={2000} delay={0.2} />
            </p>
            <p className="max-w-[17ch] pb-1 text-right text-fine leading-snug text-fog">
              30+ projects for more than 10 clients since 2022
            </p>
          </div>
        </div>
      </Tile>

      {/* Top Rated Plus */}
      <Tile delay={0.24} className="lg:col-span-4">
        <div className="flex h-full items-center gap-6 p-7 lg:p-8">
          <div className="relative grid size-24 shrink-0 place-items-center rounded-full lg:size-28">
            <span
              aria-hidden
              className="absolute inset-0 animate-[spin_9s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#ff4d1f,#f0c28a,#fff3df,#ff4d1f,#7a1d05,#ff4d1f)] motion-reduce:animate-none"
            />
            <span aria-hidden className="absolute inset-[3px] rounded-full bg-[#101111]" />
            <span aria-hidden className="absolute inset-[9px] rounded-full bg-[radial-gradient(circle_at_30%_25%,#ff8a5c,#ff4d1f_45%,#a82a08)]" />
            <StarIcon aria-hidden className="relative size-10 fill-ink text-ink lg:size-12" />
          </div>
          <div>
            <p className="font-display text-[clamp(40px,3.5vw,56px)] leading-[0.92]">Top Rated Plus</p>
            <p className="mt-2 text-ui text-fog">The top 3% of freelancers on Upwork.</p>
          </div>
        </div>
      </Tile>

      {/* Where and when */}
      <Tile delay={0.05} className="lg:col-span-7 lg:row-span-2">
        <div className="relative flex h-full min-h-[25rem] flex-col overflow-hidden p-7 lg:p-9">
          <Label>
            <span className="relative flex size-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70 motion-reduce:animate-none" />
              <span className="relative size-2.5 rounded-full bg-signal" />
            </span>
            Taking on new projects
          </Label>
          <p className="relative z-10 mt-5 max-w-[11ch] font-display text-[clamp(48px,5vw,84px)] leading-[0.9]">
            In Islamabad, working worldwide
          </p>
          <p className="relative z-10 mt-auto pt-8 text-ui text-fog">
            It&apos;s <LocalTime /> for me right now.
          </p>
          <div className="pointer-events-none absolute -bottom-[42%] -right-[16%] w-[min(88%,34rem)] max-lg:-bottom-[30%] max-lg:-right-[30%] lg:w-[66%]">
            <Globe focus={ISLAMABAD} className="pointer-events-auto" />
          </div>
        </div>
      </Tile>

      {/* Ask */}
      <Tile delay={0.13} className="lg:col-span-5 lg:row-span-2">
        <div className="flex h-full flex-col p-7 lg:p-9">
          <div className="flex items-center gap-4">
<span className="block size-14 shrink-0 overflow-hidden rounded-full bg-ember ring-1 ring-white/15">
              {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
              <img src="/images/avatar.webp" alt="" width={56} height={56} loading="lazy" decoding="async" className="size-full max-w-none" />
            </span>
            <div>
              <p className="font-display text-[clamp(34px,2.6vw,42px)] leading-none">Ask me anything</p>
              <p className="mt-1.5 text-fine text-fog">An AI with my voice and my record answers.</p>
            </div>
          </div>
          <ul className="mt-7 flex flex-col items-start gap-2.5">
            {QUESTIONS.map((question) => (
              <li key={question}>
                <Link
                  href={askAiHref(question)}
                  className="inline-flex min-h-11 items-center rounded-2xl rounded-bl-md border border-white/10 bg-white/4 px-4 py-2 text-ui transition-colors duration-300 hover:border-signal/70 hover:bg-signal/10"
                >
                  {question}
                </Link>
              </li>
            ))}
          </ul>
          <form action="/talk" className="relative mt-auto pt-7">
            <label htmlFor="record-ask" className="sr-only">
              Your question
            </label>
            <input
              id="record-ask"
              name="q"
              required
              autoComplete="off"
              placeholder="Or type your own question"
              className="h-14 w-full rounded-full border border-white/12 bg-white/4 pl-6 pr-16 text-ui outline-none transition-colors placeholder:text-fog focus-visible:border-signal"
            />
            <button
              type="submit"
              aria-label="Ask"
              className="absolute bottom-1.5 right-1.5 grid size-11 place-items-center rounded-full bg-signal text-ink transition-transform duration-300 ease-[var(--ease-lights)] hover:scale-110"
            >
              <ArrowUpIcon aria-hidden className="size-5" />
            </button>
          </form>
        </div>
      </Tile>
    </ul>
  );
};

export default Record;
