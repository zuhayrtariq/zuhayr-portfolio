"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckIcon, MinusIcon } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    title: "Dates in writing, before any code",
    body: "We start with a call, then a written scope: what's in, what's out, and when each piece lands.",
  },
  {
    title: "Something to click, early",
    body: "You get something you can click through early on, and new pieces as they're finished, so you see progress instead of hearing about it.",
  },
  {
    title: "Updates before you ask",
    body: "You always know where things stand, including anything that needs a decision from you.",
  },
  {
    title: "Launch, and I stay on",
    body: "I ship to production, hand over the code and the docs, and fix what real users turn up.",
  },
];

const list: Variants = {
  hide: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.18 } },
};
const item: Variants = {
  hide: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const Window = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#131414] shadow-[0_50px_100px_-40px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.06)]">
    <div className="flex h-11 shrink-0 items-center gap-3 border-b border-white/8 px-4">
      <div className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-white/16" />
        <span className="size-2.5 rounded-full bg-white/16" />
        <span className="size-2.5 rounded-full bg-white/16" />
      </div>
      <p className="text-fine text-fog">{title}</p>
    </div>
    <motion.div variants={list} className="flex flex-1 flex-col justify-center gap-3 p-5 sm:p-7">
      {children}
    </motion.div>
  </div>
);

const Row = ({ className, children }: { className?: string; children: ReactNode }) => (
  <motion.div
    variants={item}
    className={cn("flex items-center gap-3.5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3.5 text-ui", className)}
  >
    {children}
  </motion.div>
);

const Tick = () => (
  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-signal text-ink">
    <CheckIcon aria-hidden strokeWidth={3} className="size-3.5" />
  </span>
);

const Heading = ({ children }: { children: ReactNode }) => (
  <motion.p variants={item} className="mt-2 text-fine font-bold text-fog first:mt-0">
    {children}
  </motion.p>
);

/* Each step is shown as the thing the client actually receives at that point.
   The contents are an example project, not a real client's. */
const VISUALS = [
  <Window key="scope" title="Scope and timeline">
    <Heading>In this phase</Heading>
    <Row>
      <Tick /> Sign-in and team accounts
    </Row>
    <Row>
      <Tick /> Subscriptions and invoices
    </Row>
    <Row className="text-fog">
      <span className="grid size-6 shrink-0 place-items-center rounded-full border border-white/20">
        <MinusIcon aria-hidden className="size-3.5" />
      </span>
      Mobile app, next phase
    </Row>
    <Heading>Dates</Heading>
    <motion.div variants={item} className="grid grid-cols-3 gap-2.5 text-fine">
      {[
        ["Week 1", "Clickable prototype"],
        ["Week 3", "Billing on staging"],
        ["Week 5", "Launch"],
      ].map(([when, what], i) => (
        <div key={when} className={cn("rounded-2xl border border-white/8 bg-white/3 p-3.5", i === 2 && "border-signal/60 bg-signal/10")}>
          <p className={cn("font-bold", i === 2 ? "text-signal" : "text-fog")}>{when}</p>
          <p className="mt-1 leading-snug">{what}</p>
        </div>
      ))}
    </motion.div>
  </Window>,

  <Window key="builds" title="Preview builds">
    {[
      ["Checkout flow", "Ready to try"],
      ["Team dashboard", "Ready to try"],
      ["Sign-in", "Ready to try"],
    ].map(([name, status], i) => (
      <Row key={name} className={cn("justify-between", i === 0 && "border-white/16 bg-white/6")}>
        <span className="flex items-center gap-3.5">
          <span className="relative flex size-2.5">
            {i === 0 && <span className="absolute inset-0 animate-ping rounded-full bg-[#4ade80] opacity-60 motion-reduce:animate-none" />}
            <span className="relative size-2.5 rounded-full bg-[#4ade80]" />
          </span>
          {name}
        </span>
        <span className="text-fine text-fog">{status}</span>
      </Row>
    ))}
    <motion.div variants={item} className="mt-2 overflow-hidden rounded-2xl border border-white/8 bg-ink">
      <div className="flex h-8 items-center border-b border-white/8 px-3 text-[11px] text-fog">preview.yourproduct.app/checkout</div>
      <div className="grid grid-cols-[1.4fr_1fr] gap-3 p-4">
        <div className="space-y-2.5">
          <div className="h-3 w-2/3 rounded-full bg-white/14" />
          <div className="h-9 rounded-xl border border-white/10" />
          <div className="h-9 rounded-xl border border-white/10" />
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-white/5 p-3">
          <div className="h-2.5 w-1/2 rounded-full bg-white/14" />
          <div className="h-8 rounded-lg bg-signal" />
        </div>
      </div>
    </motion.div>
  </Window>,

  <Window key="updates" title="Friday update">
    <motion.div variants={item} className="flex items-start gap-3.5">
<span className="mt-0.5 block size-10 shrink-0 overflow-hidden rounded-full bg-ember">
        {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
        <img src="/images/avatar.webp" alt="" width={40} height={40} loading="lazy" decoding="async" className="size-full max-w-none" />
      </span>
      <div className="flex-1 space-y-2.5 rounded-2xl rounded-tl-md border border-white/8 bg-white/4 p-4 text-ui">
        <p>
          <span className="font-bold text-[#4ade80]">Done.</span> Checkout and invoices are on staging.
        </p>
        <p>
          <span className="font-bold text-tungsten">Next.</span> Roles and permissions for teams.
        </p>
        <p>
          <span className="font-bold text-signal">Needs you.</span> Names for the two plans, by Tuesday.
        </p>
      </div>
    </motion.div>
    <motion.div variants={item} className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-caption px-4 py-3 text-ui text-ink">
      Let&apos;s go with Starter and Pro.
    </motion.div>
    <motion.div variants={item} className="flex items-center gap-2 pl-14 text-fine text-fog">
      <Tick /> On track for week 5
    </motion.div>
  </Window>,

  <Window key="launch" title="Launch">
    {["Tests passing", "Deployed to production", "Domain and SSL live", "Repo, docs and access handed over"].map((line) => (
      <Row key={line}>
        <Tick /> {line}
      </Row>
    ))}
    <motion.div variants={item} className="mt-2 flex items-center justify-between rounded-2xl bg-signal px-5 py-4 text-ink">
      <span className="font-display text-[34px] leading-none">Live, on the date we set</span>
      <span className="relative flex size-3">
        <span className="absolute inset-0 animate-ping rounded-full bg-ink opacity-50 motion-reduce:animate-none" />
        <span className="relative size-3 rounded-full bg-ink" />
      </span>
    </motion.div>
  </Window>,
];

/**
 * The four steps of a project. On a large screen the steps scroll past a fixed
 * stage that shows what the client holds at each one; on a small screen each
 * step carries its own picture.
 */
const Process = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const steps = root.current?.querySelectorAll("[data-step]");
    if (!steps?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    steps.forEach((step) => io.observe(step));
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-fill]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-steps]")[0], start: "top 55%", end: "bottom 55%", scrub: 0.4 },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className={cn("grid gap-x-8 lg:grid-cols-12", className)}>
      <ol data-steps className="relative lg:col-span-5">
        <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-white/10 max-lg:hidden">
          <div data-fill className="size-full origin-top bg-signal shadow-[0_0_12px_rgb(255_77_31/0.8)]" />
        </div>
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            data-step={i}
            data-active={active === i ? "" : undefined}
            className="group/step flex flex-col justify-center pb-16 last:pb-0 lg:min-h-[68svh] lg:pb-0 lg:pl-12"
          >
            <span
              aria-hidden
              className="font-display text-[clamp(88px,9vw,150px)] leading-[0.8] text-signal transition-[color,opacity] duration-700 ease-[var(--ease-lights)] lg:text-caption/15 lg:group-data-active/step:text-signal"
            >
              {i + 1}
            </span>
            <h4 className="mt-6 font-display text-[clamp(40px,4.4vw,72px)] leading-[0.92]">{step.title}</h4>
            <p className="mt-4 max-w-[40ch] text-body text-fog">{step.body}</p>
            <motion.div
              aria-hidden
              initial="hide"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              className="mt-8 lg:hidden"
            >
              {VISUALS[i]}
            </motion.div>
          </li>
        ))}
      </ol>

      <div aria-hidden className="max-lg:hidden lg:col-span-6 lg:col-start-7">
        <div className="sticky top-[calc(50svh-17.5rem)] h-[35rem]">
          {/* Warm light behind the stage. */}
          <div className="absolute -inset-[18%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(255_77_31/0.16),transparent)]" />
          {VISUALS.map((visual, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={active === i ? "show" : "hide"}
              variants={{
                hide: { opacity: 0, y: 28, scale: 0.96, rotateX: 8, transition: { duration: 0.35, ease: "easeIn" } },
                show: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { duration: 0.7, ease: EASE } },
              }}
              style={{ transformPerspective: 1400, pointerEvents: active === i ? "auto" : "none" }}
              className="absolute inset-0"
            >
              {visual}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Process;
