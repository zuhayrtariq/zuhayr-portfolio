"use client";

import { featuredProjects, projects } from "@/constants/projects";
import { hostOf } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** The reel runs sideways only where there is room for it and motion is welcome. */
const REEL = "(width >= 64rem) and (prefers-reduced-motion: no-preference)";

const pad = (n: number) => String(n).padStart(2, "0");

const Projects = () => {
  const root = useRef<HTMLElement>(null);
  const archived = projects.length - featuredProjects.length;

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const track = q("[data-track]")[0] as HTMLElement;
      const shots = q("[data-shot]") as HTMLElement[];
      const bar = q("[data-bar]")[0];
      const count = q("[data-count]")[0];

      const mm = gsap.matchMedia();
      mm.add(REEL, () => {
        section.dataset.reel = "";
        const distance = () => track.scrollWidth - window.innerWidth;
        // The section is as tall as the reel is long, so vertical scroll pays for the sideways travel.
        const size = () => {
          section.style.height = `${window.innerHeight + distance()}px`;
        };
        size();
        ScrollTrigger.addEventListener("refreshInit", size);

        const lean = gsap.quickTo(track, "skewX", { duration: 0.6, ease: "power3.out" });
        let active = -1;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              lean(gsap.utils.clamp(-2.5, 2.5, self.getVelocity() / -500));
              gsap.set(bar, { scaleX: self.progress });
              let nearest = 0;
              let best = Infinity;
              shots.forEach((shot, i) => {
                const frame = shot.parentElement!.getBoundingClientRect();
                const offset = (frame.left + frame.width / 2 - window.innerWidth / 2) / window.innerWidth;
                // Each screenshot slides inside its frame against the direction of travel.
                gsap.set(shot, { xPercent: offset * -8 });
                if (Math.abs(offset) < best) {
                  best = Math.abs(offset);
                  nearest = i;
                }
              });
              if (nearest !== active) {
                active = nearest;
                count.textContent = pad(nearest + 1);
              }
            },
          },
        });

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", size);
          section.style.height = "";
          delete section.dataset.reel;
          gsap.set([track, ...shots], { clearProps: "transform" });
        };
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="on-paper group relative">
      <div className="group-data-reel:sticky group-data-reel:top-0 group-data-reel:flex group-data-reel:h-[100svh] group-data-reel:flex-col group-data-reel:overflow-hidden">
        <div
          data-track
          className="flex flex-col gap-24 px-[clamp(20px,4vw,64px)] py-24 md:py-32 group-data-reel:w-max group-data-reel:flex-1 group-data-reel:flex-row group-data-reel:items-center group-data-reel:gap-[7vw] group-data-reel:py-0 group-data-reel:pr-[10vw] group-data-reel:will-change-transform"
        >
          <header className="shrink-0 group-data-reel:w-[42vw]">
            <h2 id="work-title" className="font-display text-[clamp(84px,13.5vw,240px)] leading-[0.82] tracking-[-0.01em]">
              Selected
              <br />
              work
            </h2>
            <p className="mt-8 max-w-[30ch] text-lead leading-snug text-fog">
              Products I&apos;ve led or built end to end, from the first commit to production.
            </p>
            <p aria-hidden className="mt-10 hidden items-center gap-3 text-ui font-bold group-data-reel:flex">
              Keep scrolling <ArrowRightIcon className="size-5" />
            </p>
          </header>

          <ol className="contents">
            {featuredProjects.map((project, i) => {
              const meta = [project.role, project.year].filter(Boolean).join(", ");
              const caseStudy = `/work/${project.slug}`;
              return (
                <li key={project.title} className="shrink-0 group-data-reel:w-[min(60vw,100svh)]">
                  {/* The article is its own blending group, so the title can invert against paper and screenshot alike. */}
                  <article
                    aria-labelledby={`work-${project.slug}`}
                    className="relative isolate bg-backdrop group-data-reel:-mx-[2.4vw] group-data-reel:px-[2.4vw]"
                  >
                    <div className="flex items-baseline justify-between text-ui tabular-nums text-fog">
                      <span aria-hidden>{pad(i + 1)}</span>
                      {meta && <span>{meta}</span>}
                    </div>
                    {project.image && (
                      <Link
                        href={caseStudy}
                        tabIndex={-1}
                        aria-hidden
                        data-cursor="Open case study"
                        className="relative mt-3 block aspect-[16/10] overflow-hidden bg-ink"
                      >
                        <div data-shot className="absolute inset-y-0 -inset-x-[5%]">
                          <Image
                            src={project.image}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 66vw, 100vw"
                            className="object-cover object-top"
                          />
                        </div>
                      </Link>
                    )}
                    <h3
                      id={`work-${project.slug}`}
                      className="pointer-events-none relative z-10 -mt-[0.44em] font-display text-[clamp(60px,8.4vw,150px)] leading-[0.86] text-paper mix-blend-difference group-data-reel:-ml-[2.4vw]"
                    >
                      {project.title}
                    </h3>
                    <div className="mt-5 flex flex-wrap items-start justify-between gap-x-10 gap-y-4">
                      <p className="max-w-[44ch] text-body">{project.summary}</p>
                      <ul className="flex shrink-0 gap-x-7 text-ui font-bold">
                        <li>
                          <Link href={caseStudy} className="link-underline">
                            Case study
                          </Link>
                        </li>
                        <li>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-underline inline-flex items-center gap-1"
                          >
                            {hostOf(project.link)} <ArrowUpRightIcon aria-hidden className="size-4" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>

          <div className="shrink-0 group-data-reel:w-[36vw]">
            <p className="text-lead leading-snug text-fog">That&apos;s the recent, public work.</p>
            <Link
              href="/projects"
              data-cursor="Open the archive"
              className="group/more mt-4 block font-display text-[clamp(60px,8.4vw,150px)] leading-[0.86]"
            >
              {archived} more in
              <br />
              the archive
              <ArrowRightIcon
                aria-hidden
                className="ml-[0.12em] inline size-[0.55em] transition-transform duration-500 ease-[var(--ease-lights)] group-hover/more:translate-x-[0.18em]"
              />
            </Link>
          </div>
        </div>

        <div
          aria-hidden
          className="hidden h-16 shrink-0 items-center gap-6 px-[clamp(20px,4vw,64px)] text-ui tabular-nums text-fog group-data-reel:flex"
        >
          <span data-count className="text-caption">
            01
          </span>
          <div className="h-px flex-1 bg-caption/20">
            <div data-bar className="h-full origin-left scale-x-0 bg-caption" />
          </div>
          <span>{pad(featuredProjects.length)}</span>
        </div>
      </div>
    </section>
  );
};

export default Projects;
