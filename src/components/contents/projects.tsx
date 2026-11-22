"use client";

import BrandIcon from "@/components/ui/brand-icon";
import BrowserFrame from "@/components/ui/browser-frame";
import { featuredProjects, projects } from "@/constants/projects";
import { hostOf, lowerFirst } from "@/lib/utils";
import type { Project } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import Rise from "../motion/rise";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MOTION = "(prefers-reduced-motion: no-preference)";
/** The cards pile up on each other only where there is room for a whole card on screen. */
const DECK = `(width >= 64rem) and (height >= 40rem) and ${MOTION}`;

/** Where the first card sticks, and how much of each earlier card stays showing above the next. */
const DECK_TOP = 92;
const DECK_STEP = 22;

const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };

const WorkCard = ({ project }: { project: Project }) => {
  const caseStudy = `/work/${project.slug}`;
  const shotAlt = `The ${project.title} website${project.kind ? `, ${lowerFirst(project.kind)}` : ""}`;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // The window leans a few degrees toward the pointer, and a highlight slides across the glass with it.
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [3.5, -3.5]), SPRING);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), SPRING);
  const glare = useSpring(useTransform(x, [-0.5, 0.5], [-30, 130]), SPRING);
  const glareX = useTransform(glare, (v) => `${v}%`);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - box.left) / box.width - 0.5);
    y.set((e.clientY - box.top) / box.height - 0.5);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <article
      data-card
      aria-labelledby={`work-${project.slug}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ "--accent": project.accent ?? "#ff4d1f" } as CSSProperties}
      className="relative isolate origin-top overflow-hidden rounded-[28px] border border-white/10 bg-[#101111] shadow-[0_-18px_60px_-20px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.06)] will-change-transform max-lg:flex max-lg:flex-col lg:grid lg:h-[min(78svh,760px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:rounded-[36px]"
    >
      {/* Each product lights its own card in its own colour. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[12%] -top-[30%] -z-10 aspect-square w-[78%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_34%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_70%,transparent)_50%,transparent)]"
      />

      <div className="relative z-10 flex flex-col p-6 pt-7 sm:p-9 lg:p-12 xl:p-14">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fine text-fog">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/4 py-1.5 pl-3 pr-3.5 text-caption">
            <span className="size-2 rounded-full bg-(--accent) shadow-[0_0_12px_var(--accent)]" />
            {project.kind}
          </span>
          {project.role && (
            <span>
              {project.role}, {project.year}
            </span>
          )}
        </p>

        <h3
          id={`work-${project.slug}`}
          className="mt-8 font-display text-[clamp(56px,6.6vw,118px)] leading-[0.86] tracking-[-0.01em] lg:mt-auto lg:pt-8"
        >
          {project.title}
        </h3>
        <p className="mt-5 max-w-[42ch] text-body text-fog">{project.summary}</p>

        <ul aria-label="Built with" className="mt-6 flex flex-wrap gap-2">
          {project.stack?.slice(0, 6).map((name) => (
            <li
              key={name}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3.5 text-fine text-caption/90 has-[svg]:pl-2.5"
            >
              <BrandIcon name={name} className="size-4 shrink-0" />
              {name}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={caseStudy}
            className="group/cta inline-flex h-12 items-center gap-2 rounded-full bg-caption pl-6 pr-5 text-ui font-bold text-ink transition-colors duration-300 hover:bg-(--accent)"
          >
            Read the case study
            <ArrowRightIcon
              aria-hidden
              className="size-4 transition-transform duration-300 ease-[var(--ease-lights)] group-hover/cta:translate-x-1"
            />
          </Link>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-1.5 rounded-full border border-white/14 px-5 text-ui font-bold transition-colors duration-300 hover:border-white/40 hover:bg-white/6"
          >
            {hostOf(project.link)} <ArrowUpRightIcon aria-hidden className="size-4" />
          </a>
        </div>
      </div>

      {/* The live site in a browser window, turned in space. It scrolls as the card travels up the screen. */}
      <div className="relative max-lg:order-first max-lg:px-4 max-lg:pt-4 sm:max-lg:px-9 sm:max-lg:pt-9 lg:[perspective:1800px]">
        <div className="lg:absolute lg:left-[5%] lg:top-[10%] lg:w-[112%] lg:origin-left lg:[transform:rotateY(-17deg)_rotateX(7deg)_rotateZ(0.6deg)] lg:[transform-style:preserve-3d]">
          <motion.div style={{ rotateX, rotateY }}>
            <Link href={caseStudy} tabIndex={-1} aria-hidden data-cursor="Open case study" className="relative block">
              <BrowserFrame host={hostOf(project.link)}>
                <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                  {project.scroll ? (
                    <Image
                      data-shot
                      src={project.scroll.src}
                      alt={shotAlt}
                      width={project.scroll.width}
                      height={project.scroll.height}
                      sizes="(min-width: 1024px) 62vw, 100vw"
                      className="h-auto w-full will-change-transform"
                    />
                  ) : (
                    project.image && (
                      <Image src={project.image} alt={shotAlt} fill sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover object-top" />
                    )
                  )}
                  <motion.span
                    aria-hidden
                    style={{ left: glareX }}
                    className="pointer-events-none absolute inset-y-0 w-[45%] -translate-x-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.07),transparent)] max-lg:hidden"
                  />
                </div>
              </BrowserFrame>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Darkens the card as the next one slides over it. */}
      <div data-dim aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />
    </article>
  );
};

const Projects = () => {
  const root = useRef<HTMLElement>(null);
  const archived = projects.length - featuredProjects.length;

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const items = q("[data-item]") as HTMLElement[];

      const mm = gsap.matchMedia();

      // The page inside each browser window scrolls while its card is on screen.
      mm.add(MOTION, () => {
        items.forEach((item) => {
          const shot = item.querySelector<HTMLElement>("[data-shot]");
          const frame = shot?.parentElement;
          if (!shot || !frame) return;
          gsap.to(shot, {
            y: () => -Math.min(shot.offsetHeight - frame.offsetHeight, frame.offsetHeight * 1.7),
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 38%",
              end: () => `+=${window.innerHeight * 1.1}`,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      mm.add(DECK, () => {
        section.dataset.deck = "";
        items.forEach((item, i) => {
          const next = items[i + 1];
          if (!next) return;
          const depth = items.length - 1 - i;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: () => `top ${DECK_TOP + (i + 1) * DECK_STEP}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          tl.to(item.querySelector("[data-card]"), { scale: 1 - depth * 0.022 }, 0).to(
            item.querySelector("[data-dim]"),
            { opacity: 0.62 },
            0
          );
        });
        return () => {
          delete section.dataset.deck;
          gsap.set(q("[data-card], [data-dim]"), { clearProps: "transform,opacity,scale" });
        };
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="group relative">
      <div className="mx-auto max-w-[1680px] px-[clamp(16px,4vw,64px)] pb-24 pt-24 md:pb-40 md:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <Rise
            as="h2"
            by="lines"
            id="work-title"
            className="font-display text-[clamp(72px,12vw,216px)] leading-[0.82] tracking-[-0.01em]"
          >
            Shipped and live
          </Rise>
          <p className="max-w-[34ch] pb-2 text-body text-fog lg:pb-5">
            Four products I built or led, one of them alone from the first line of code. Each is live, so open it
            and click around, or read how it was made.
          </p>
        </div>

        <ol className="mt-12 space-y-6 md:mt-20 group-data-deck:space-y-[9svh]">
          {featuredProjects.map((project, i) => (
            <li
              key={project.slug}
              data-item
              style={{ "--deck-top": `${DECK_TOP + i * DECK_STEP}px` } as CSSProperties}
              className="group-data-deck:sticky group-data-deck:top-(--deck-top)"
            >
              <WorkCard project={project} />
            </li>
          ))}
        </ol>

        <Link
          href="/projects"
          data-cursor="Open the archive"
          className="group/more relative mt-6 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 overflow-hidden rounded-[28px] border border-white/10 bg-[#101111] px-6 py-8 transition-colors duration-500 hover:border-signal/60 sm:px-9 md:mt-[9svh] lg:rounded-[36px] lg:px-14 lg:py-12"
        >
          <span className="font-display text-[clamp(44px,6vw,104px)] leading-[0.9]">
            {archived} more in the archive
          </span>
          <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-signal text-ink transition-transform duration-500 ease-[var(--ease-lights)] group-hover/more:translate-x-2 lg:size-20">
            <ArrowRightIcon aria-hidden className="size-7" />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Projects;
