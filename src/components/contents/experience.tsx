"use client";

import SpotlightCard from "@/components/ui/spotlight-card";
import { experiences } from "@/constants/experiences";
import { SITE } from "@/constants/site";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import Rise from "../motion/rise";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MONTHS =
  /\b(January|February|March|April|June|July|August|September|October|November|December)\b/g;

const formatRange = (date: string) =>
  date.replace(MONTHS, (m) => m.slice(0, 3)).replace(" - ", " to ");

const EASE = [0.22, 1, 0.36, 1] as const;

const Experience = () => {
  const root = useRef<HTMLElement>(null);
  const jobs = experiences.toReversed();

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-fill]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-list]")[0], start: "top 60%", end: "bottom 60%", scrub: 0.4 },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    // The rows wait off to the right before they slide in. Clipping keeps that from widening the page; clip, unlike hidden, leaves sticky working.
    <section ref={root} id="experience" aria-labelledby="experience-title" className="relative overflow-x-clip">
      <div className="mx-auto grid max-w-[1680px] gap-x-8 gap-y-12 px-[clamp(16px,4vw,64px)] py-24 md:py-40 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <Rise
            as="h2"
            by="lines"
            id="experience-title"
            className="font-display text-[clamp(72px,8.4vw,150px)] leading-[0.84] tracking-[-0.01em]"
          >
            Experience
          </Rise>
          <p className="mt-6 max-w-[32ch] text-body text-fog">
            Five years from an SAP internship to leading engineering on an enterprise AI platform.
          </p>
          <a
            href={SITE.resume}
            download
            className="mt-8 inline-flex h-12 items-center gap-2.5 rounded-full border border-white/14 pl-5 pr-6 text-ui font-bold transition-colors duration-300 hover:border-white/40 hover:bg-white/6"
          >
            <DownloadIcon aria-hidden className="size-4" /> Download my résumé (PDF)
          </a>
        </div>

        <ol data-list className="relative lg:col-span-8">
          <div aria-hidden className="absolute bottom-6 left-[5px] top-6 w-px bg-white/10 sm:left-[7px]">
            <div data-fill className="size-full origin-top bg-signal shadow-[0_0_12px_rgb(255_77_31/0.8)]" />
          </div>
          {jobs.map((job, i) => (
            <motion.li
              key={`${job.company_name}-${job.date}`}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.9, ease: EASE, delay: Math.min(i, 2) * 0.05 }}
              className="relative pb-4 pl-8 last:pb-0 sm:pl-12 lg:pb-5"
            >
              {/* The current roles are lit on the rail. */}
              <span aria-hidden className="absolute left-0 top-[2.6rem] flex size-[11px] sm:size-[15px]">
                {job.active && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70 motion-reduce:animate-none" />
                )}
                <span
                  className={
                    job.active
                      ? "relative size-full rounded-full bg-signal shadow-[0_0_14px_rgb(255_77_31/0.9)]"
                      : "relative size-full rounded-full border border-white/25 bg-backdrop"
                  }
                />
              </span>
              <SpotlightCard
                spotlightColor="#ff8a5c"
                intensity={0.14}
                spotlightSize={380}
                borderGlow={0.9}
                proximity={90}
                className="rounded-[24px] bg-[#101111] p-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
              >
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Visit"
                  className="group/row grid gap-x-6 gap-y-4 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-7"
                >
                  <span
                    className="grid size-14 place-items-center overflow-hidden rounded-2xl p-2 ring-1 ring-white/10 sm:size-16"
                    style={{ backgroundColor: job.iconBg }}
                  >
                    <Image src={job.icon} alt="" width={64} height={64} className="size-full object-contain" />
                  </span>
                  <span>
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-display text-[clamp(38px,3.8vw,60px)] leading-[0.95]">
                        {job.company_name.replace(" — Freelance", "")}
                      </span>
                      {job.active && (
                        <span className="rounded-full bg-signal px-3 py-1 text-fine font-bold leading-none text-ink">Now</span>
                      )}
                    </span>
                    <span className="mt-2 block text-ui font-bold">{job.title.split(" — ")[0]}</span>
                    <span className="mt-2 block max-w-[58ch] text-ui text-fog">{job.summary}</span>
                  </span>
                  <span className="flex items-start gap-3 text-fine tabular-nums text-fog sm:flex-col sm:items-end sm:justify-between">
                    {formatRange(job.date)}
                    <ArrowUpRightIcon
                      aria-hidden
                      className="size-5 text-caption transition-transform duration-500 ease-[var(--ease-lights)] group-hover/row:-translate-y-1 group-hover/row:translate-x-1 max-sm:ml-auto"
                    />
                  </span>
                </a>
              </SpotlightCard>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
