"use client";

import BrandIcon from "@/components/ui/brand-icon";
import { NumberTicker } from "@/components/ui/number-ticker";
import SpotlightCard from "@/components/ui/spotlight-card";
import { WHY_QUESTION } from "@/constants/faq";
import { askAiHref, SITE } from "@/constants/site";
import { AI_WORKFLOW } from "@/constants/skills";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import Rise from "../motion/rise";

const EASE = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * The same five parts of a product, twice: what a prompt hands back, and what
 * goes live. Each row ends on somewhere he has already done it.
 */
const ROWS: { topic: string; demo: string; shipped: string; proof: string; href: string }[] = [
  {
    topic: "Payments",
    demo: "A checkout page that takes a card.",
    shipped: "Failed cards, refunds and webhooks handled, and no customer ever charged twice.",
    proof: "The Ticket Zone: Stripe Connect payouts and automatic refunds.",
    href: "/work/the-ticket-zone",
  },
  {
    topic: "Accounts",
    demo: "A login form.",
    shipped: "Sign-in people already trust, a role for each kind of user, and no account able to read another's data.",
    proof: "Yip: sign-in with Apple, Google or email, and every private page locked behind it.",
    href: "/work/yip",
  },
  {
    topic: "The AI",
    demo: "A chatbot that always has an answer.",
    shipped: "One that says when it doesn't know, stays inside a cost limit and can't be talked out of its rules.",
    proof: "The AI on this site: it answers only from my record, and it is rate limited.",
    href: "/talk",
  },
  {
    topic: "Real traffic",
    demo: "It works on your laptop.",
    shipped: "It works for the thousandth user on a slow phone, and I hear about an error before you do.",
    proof: "Yip: more than 48,000 listings, with errors tracked in Sentry.",
    href: "/work/yip",
  },
  {
    topic: "The date",
    demo: "“Almost done”, for weeks.",
    shipped: "A written scope, a date, and one person who answers for both.",
    proof: "My Upwork record: 100% job success across 18 jobs.",
    href: SITE.upwork,
  },
];

const COLUMNS = "lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,4fr)_minmax(0,3fr)] lg:gap-x-8";

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
      <div className="flex h-full flex-col p-7 lg:p-9">{children}</div>
    </SpotlightCard>
  </motion.li>
);

/** Shown above each cell on a phone, where the column headings are gone. */
const CellLabel = ({ children }: { children: ReactNode }) => (
  <span className="mb-1.5 block text-fine text-fog lg:sr-only">{children}</span>
);

/**
 * "Why hire a developer when AI can write code?", answered straight after the
 * visitor has watched AI draft a brief: the same five parts of a product as a
 * prompt returns them and as they ship, then what he brings that a prompt can't.
 */
const WhyHire = () => {
  return (
    <section id="why" aria-labelledby="why-title" className="relative">
      <div className="mx-auto max-w-[1680px] px-[clamp(16px,4vw,64px)] pb-24 pt-8 md:pb-40 md:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 xl:flex-nowrap">
          <Rise
            as="h2"
            by="lines"
            id="why-title"
            className="xl:shrink-0 font-display text-[clamp(60px,9.4vw,170px)] leading-[0.84] tracking-[-0.01em]"
          >
            A prompt gets you a demo. <br />
            <span className="text-signal">I ship the product.</span>
          </Rise>
          <p className="max-w-[38ch] pb-2 text-body text-fog lg:pb-4">
            That brief took AI a few seconds. I work with it all day, Claude, Gemini and GPT inside Cursor, and
            it&apos;s a big part of why I&apos;m fast. But typing the code was never the hard part. This is what a
            prompt leaves out.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[28px] border border-white/10 bg-[#101111] shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] md:mt-20 lg:rounded-[36px]">
          <div aria-hidden className={cn("border-b border-white/10 px-9 py-5 text-fine text-fog max-lg:hidden xl:px-12", COLUMNS)}>
            <span />
            <span>A prompt gives you</span>
            <span className="text-caption">I ship</span>
            <span>Where I&apos;ve done it</span>
          </div>
          <ul>
            {ROWS.map((row, i) => (
              <motion.li
                key={row.topic}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={IN_VIEW}
                transition={{ duration: 0.8, delay: i * 0.05, ease: EASE }}
                className={cn(
                  "group/row border-t border-white/8 px-6 py-8 transition-colors duration-300 first:border-t-0 hover:bg-white/3 sm:px-9 lg:items-start lg:py-9 xl:px-12",
                  COLUMNS
                )}
              >
                <h3 className="font-display text-[clamp(36px,3vw,52px)] leading-[0.92] transition-colors duration-300 group-hover/row:text-signal">
                  {row.topic}
                </h3>

                <div className="mt-5 lg:mt-1">
                  <CellLabel>A prompt gives you</CellLabel>
                  <p className="flex gap-3 text-body text-fog">
                    <span aria-hidden className="mt-1 size-5 shrink-0 rounded-full border border-white/25" />
                    {row.demo}
                  </p>
                </div>

                <div className="mt-5 lg:mt-1">
                  <CellLabel>I ship</CellLabel>
                  <p className="flex gap-3 text-body">
                    <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-signal text-ink">
                      <CheckIcon strokeWidth={3} className="size-3" />
                    </span>
                    {row.shipped}
                  </p>
                </div>

                <div className="mt-5 max-lg:pl-8 lg:mt-1.5">
                  <CellLabel>Where I&apos;ve done it</CellLabel>
                  {row.href.startsWith("/") ? (
                    <Link href={row.href} className="link-underline text-ui text-fog">
                      {row.proof}
                    </Link>
                  ) : (
                    <a href={row.href} target="_blank" rel="noopener noreferrer" className="link-underline text-ui text-fog">
                      {row.proof}
                    </a>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <ul className="mt-4 grid gap-4 lg:mt-5 lg:grid-cols-3 lg:gap-5">
          <Tile>
            <p className="text-fine text-fog">The tools</p>
            <h3 className="mt-6 font-display text-[clamp(40px,3.4vw,58px)] leading-[0.92]">
              I use the same AI you would
            </h3>
            <ul aria-label="AI tools I work with" className="mt-6 flex flex-wrap gap-2">
              {AI_WORKFLOW.stack.map((name) => (
                <li
                  key={name}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 text-ui has-[svg]:pl-3"
                >
                  <BrandIcon name={name} className="size-[18px] shrink-0" />
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-8 text-body text-fog">
              The difference is that I can tell when it&apos;s wrong. Nothing reaches production that I haven&apos;t
              read, run and tested myself.
            </p>
          </Tile>

          <Tile delay={0.08}>
            <p className="text-fine text-fog">MS in Computer Science, FAST NUCES</p>
            <p className="mt-6 font-display text-[clamp(112px,10vw,176px)] leading-[0.74] tracking-[-0.02em]">
              <NumberTicker value={3.89} startValue={3} decimalPlaces={2} />
            </p>
            <h3 className="mt-6 font-display text-[clamp(34px,2.6vw,44px)] leading-[0.95]">
              I studied what&apos;s inside the model
            </h3>
            <p className="mt-auto pt-6 text-body text-fog">
              My GPA out of 4, with machine learning and AI on the course. Before that I finished my BS in Computer
              Science as gold medalist.
            </p>
          </Tile>

          <Tile delay={0.16}>
            <p className="text-fine text-fog">The proof</p>
            <h3 className="mt-6 font-display text-[clamp(40px,3.4vw,58px)] leading-[0.92]">
              This page is running it
            </h3>
            <p className="mt-5 text-body text-fog">
              The assistant that greeted you and the brief that drew itself above are AI features I built and run in
              production. Put the question to it.
            </p>
            <div className="mt-auto flex items-end gap-3 pt-8">
              <span className="block size-11 shrink-0 overflow-hidden rounded-full bg-ember ring-1 ring-white/15">
                {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
                <img src="/images/avatar.webp" alt="" width={44} height={44} loading="lazy" decoding="async" className="size-full max-w-none" />
              </span>
              <Link
                href={askAiHref(WHY_QUESTION)}
                className="group/ask inline-flex min-h-12 items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-white/4 px-4 py-2.5 text-ui transition-colors duration-300 hover:border-signal/70 hover:bg-signal/10"
              >
                {WHY_QUESTION}
                <ArrowRightIcon
                  aria-hidden
                  className="size-4 shrink-0 transition-transform duration-300 ease-[var(--ease-lights)] group-hover/ask:translate-x-1"
                />
              </Link>
            </div>
          </Tile>
        </ul>
      </div>
    </section>
  );
};

export default WhyHire;
