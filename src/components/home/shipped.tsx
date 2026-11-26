"use client";

import { SiteLink } from "@/components/site/audience";
import BrandIcon from "@/components/ui/brand-icon";
import Sign from "@/components/ui/sign";
import { featuredProjects, projects } from "@/constants/projects";
import { stackName } from "@/lib/stack";
import { cn, hostOf } from "@/lib/utils";
import { LockIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

const LEAD =
  "Five live products I built or led. I built all of Yip on my own, and the Runes website too. Open one and click around, or read how it was made.";

interface ShippedProps {
  /** What the section says first, when the page is tailored to one kind of job. */
  lead?: string;
  /** Case-study slugs to put first, most relevant first. */
  order?: string[];
}

/**
 * The work, in the window a client would see it in: one browser, a tab for each product, the
 * real address in the bar and the real site on the page. Beside the page, what he did on it.
 */
const Shipped = ({ lead = LEAD, order }: ShippedProps) => {
  const frame = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [seen, setSeen] = useState(false);
  const [chosen, setChosen] = useState(0);
  const listed = useMemo(() => {
    const first = (order ?? []).flatMap((slug) => featuredProjects.filter((p) => p.slug === slug));
    return [...first, ...featuredProjects.filter((p) => !first.includes(p))];
  }, [order]);
  const project = listed[chosen];
  const archived = projects.length - featuredProjects.length;

  // The page inside the window starts scrolling once the window has been seen.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setSeen(true);
      },
      { rootMargin: "0px 0px -22% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (chosen + step + listed.length) % listed.length;
    setChosen(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="work" aria-labelledby="work-title" className="on-pine relative bg-pine">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-24 md:py-36">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <h2 id="work-title" className="text-[clamp(38px,5.6vw,96px)]">
            Shipped, and live.
          </h2>
          <p className="max-w-[40ch] pb-1 text-body text-fog">{lead}</p>
        </div>

        <div ref={frame} className="on-paper mt-10 overflow-hidden rounded-xl bg-paper shadow-[0_50px_100px_-50px_rgb(0_0_0/0.9)] md:mt-16">
          <div
            role="tablist"
            aria-label="Products"
            onKeyDown={onKeyDown}
            className="flex gap-1 overflow-x-auto bg-umbra px-2 pt-2 [scrollbar-width:none]"
          >
            {listed.map((item, i) => (
              <button
                key={item.slug}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`work-tab-${item.slug}`}
                aria-selected={chosen === i}
                aria-controls="work-panel"
                tabIndex={chosen === i ? 0 : -1}
                onClick={() => setChosen(i)}
                className={cn(
                  "flex h-12 shrink-0 items-center gap-2.5 rounded-t-lg px-4 text-ui transition-colors -outline-offset-2 sm:px-5",
                  chosen === i ? "bg-paper font-bold" : "text-fog hover:text-caption"
                )}
              >
                <span aria-hidden className="size-2.5 rounded-full" style={{ backgroundColor: item.accent }} />
                {item.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 border-b px-3 py-2.5 sm:px-4">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${hostOf(project.link)} in a new tab`}
              className="flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-md bg-umbra px-3.5 font-mono text-fine transition-colors hover:bg-caption/12 sm:text-ui"
            >
              <LockIcon aria-hidden className="size-3.5 shrink-0 text-fog" />
              <span className="truncate">{hostOf(project.link)}</span>
            </a>
            <span className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-mint px-3.5 text-fine font-bold text-pine">
              <span aria-hidden className="size-2 rounded-full bg-pine" />
              Live
            </span>
          </div>

          <div id="work-panel" role="tabpanel" aria-labelledby={`work-tab-${project.slug}`} className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
            <SiteLink href={`/work/${project.slug}`} tabIndex={-1} aria-hidden className="block">
              <div className="@container relative aspect-[16/10] overflow-hidden bg-pine">
                {listed.map((item, i) =>
                  item.scroll ? (
                    <Image
                      key={item.slug}
                      src={item.scroll.src}
                      alt=""
                      width={item.scroll.width}
                      height={item.scroll.height}
                      sizes="(min-width: 1024px) 66vw, 100vw"
                      loading="lazy"
                      // The page scrolls itself only while its tab is the open one, so a visitor always meets it at the top.
                      style={{ animationPlayState: seen && chosen === i ? "running" : "paused" }}
                      className={cn(
                        "absolute inset-x-0 top-0 h-auto w-full transition-opacity duration-300 motion-safe:animate-[screen-pan_26s_ease-in-out_1.2s_infinite_alternate]",
                        chosen === i ? "opacity-100" : "opacity-0"
                      )}
                    />
                  ) : null
                )}
              </div>
            </SiteLink>

            <article aria-labelledby="work-chosen" className="flex flex-col border-t p-6 sm:p-8 lg:border-l lg:border-t-0">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fine text-fog">
                {project.kind}
                {project.role && <span>{[project.role, project.year].filter(Boolean).join(", ")}</span>}
              </p>
              <h3 id="work-chosen" className="mt-3 text-[clamp(32px,3.2vw,52px)]">
                {project.title}
              </h3>
              <p className="mt-4 text-ui text-fog">{project.summary}</p>
              <ul aria-label="Built with" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-fine">
                {project.stack?.slice(0, 6).map((name) => (
                  <li key={name} className="inline-flex items-center gap-2">
                    <BrandIcon name={name} className="size-4 shrink-0" />
                    {stackName(name)}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-8">
                <Sign href={`/work/${project.slug}`} tone="pine">
                  Read the case study
                </Sign>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-underline text-ui font-bold">
                  Open {hostOf(project.link)}
                </a>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-t pt-8 md:mt-20">
          <p className="text-lead">{archived} more in the archive, back to my first React apps.</p>
          <SiteLink href="/work" className="link-underline text-ui font-bold">
            See every project
          </SiteLink>
        </div>
      </div>
    </section>
  );
};

export default Shipped;
