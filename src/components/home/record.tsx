"use client";

import LocalTime from "@/components/site/local-time";
import Sign from "@/components/ui/sign";
import Window from "@/components/ui/window";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Six facts, all of them checkable on his public Upwork profile or on this site. */
const CHECKS = [
  { name: "Client rating", read: "5.0", note: "across 13 reviews on Upwork" },
  { name: "Job success", read: "100%", note: "my score on Upwork" },
  { name: "Hours logged", read: "2,500", note: "of client work, roughly" },
  { name: "Jobs delivered", read: "18", note: "on Upwork" },
  { name: "Projects shipped", read: "30+", note: "for 10+ clients since 2022" },
  { name: "Top Rated Plus", read: "Top 3%", note: "of freelancers on Upwork" },
];

/**
 * The record, as a run of checks in a terminal: each fact is a line that passes. The page is
 * served with every line passed; in the browser the run is wound back while it is still below
 * the screen, and plays once when it arrives.
 */
const Record = () => {
  const list = useRef<HTMLOListElement>(null);
  const [ran, setRan] = useState(true);

  useIsoLayoutEffect(() => {
    const el = list.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setRan(false);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setRan(true);
      },
      { rootMargin: "0px 0px -25% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="record" aria-labelledby="record-title" className="on-paper relative bg-paper">
      <div className="mx-auto grid max-w-[1680px] gap-x-12 gap-y-12 px-[clamp(20px,4vw,64px)] py-24 md:py-36 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <h2 id="record-title" className="text-[clamp(32px,3.7vw,62px)]">
            Promises are easy. Check the record.
          </h2>
          <p className="mt-7 max-w-[42ch] text-body text-fog lg:text-lead">
            The rating, the job success score and Top Rated Plus all come from my public Upwork profile, where clients
            review each job after it&apos;s delivered.
          </p>
          <Sign href={SITE.upwork} tone="brand" className="mt-8">
            Check it on Upwork
          </Sign>
          <p className="mt-10 flex max-w-[42ch] items-start gap-3 border-t pt-6 text-ui">
            <span aria-hidden className="relative mt-1.5 flex size-2.5 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60 motion-reduce:hidden" />
              <span className="relative size-2.5 rounded-full bg-ok" />
            </span>
            <span>
              Taking on new projects. I&apos;m in Islamabad and work with clients worldwide; it&apos;s <LocalTime /> for
              me right now.
            </span>
          </p>
        </div>

        <div className="text-[15px] sm:text-[17px] lg:col-span-7">
          <Window
            title="my record"
            status={<span className="font-mono font-bold text-mint">{CHECKS.length} of {CHECKS.length} passing</span>}
            className="shadow-[0_50px_100px_-45px_rgb(6_14_40/0.8)]"
          >
            <ol ref={list} className="px-5 py-3 sm:px-8 sm:py-5">
              {CHECKS.map((check, i) => (
                <li
                  key={check.name}
                  style={{ transitionDelay: ran ? `${i * 150}ms` : "0ms" }}
                  className={cn(
                    "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 border-t border-white/10 py-4 transition-opacity duration-500 first:border-t-0 sm:grid-cols-[auto_11.5rem_minmax(0,1fr)] sm:gap-x-5",
                    ran ? "opacity-100" : "opacity-25"
                  )}
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden
                    style={{ transitionDelay: ran ? `${i * 150}ms` : "0ms" }}
                    className={cn(
                      "row-span-2 size-6 rounded-full bg-mint p-1.5 text-ink transition-transform duration-300 ease-[var(--ease-lights)] sm:row-span-1",
                      ran ? "scale-100" : "scale-0"
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                  >
                    <path d="m4 10.5 4 4 8-9" />
                  </svg>
                  <span className="font-mono text-fine text-fog sm:text-ui">{check.name}</span>
                  <span className="flex flex-wrap items-baseline gap-x-3 max-sm:col-start-2">
                    <span className="font-display text-[clamp(28px,2.9vw,46px)] font-black leading-none tracking-[-0.03em]">{check.read}</span>
                    <span className="text-fine text-fog sm:text-ui">{check.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Window>
        </div>
      </div>
    </section>
  );
};

export default Record;
