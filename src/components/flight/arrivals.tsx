"use client";

import BrandIcon from "@/components/ui/brand-icon";
import BrowserFrame from "@/components/ui/browser-frame";
import Sign from "@/components/ui/sign";
import SplitFlap from "@/components/ui/split-flap";
import { featuredProjects, projects } from "@/constants/projects";
import { stackName } from "@/lib/stack";
import { cn, hostOf, lowerFirst } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Cells in each column of the board. */
const COLUMNS = { product: 12, what: 22, address: 14, status: 4 };

/**
 * The work, as an arrivals board: each product that has landed, what it is, where it lives,
 * and that it is live. Choosing a row brings that product up underneath, in a browser window.
 */
const Arrivals = () => {
  const board = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);
  const [chosen, setChosen] = useState(0);
  const project = featuredProjects[chosen];
  const archived = projects.length - featuredProjects.length;

  useEffect(() => {
    const el = board.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setArrived(true);
      },
      { rootMargin: "0px 0px -22% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="work" aria-labelledby="work-title" className="on-night relative bg-night">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pb-24 pt-24 md:pb-36 md:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <h2 id="work-title" className="text-[clamp(38px,5.6vw,96px)]">
            Landed, and live.
          </h2>
          <p className="max-w-[40ch] pb-1 text-body text-fog">
            Four products I built or led, one of them alone from the first line of code. Each is live, so open it and
            click around, or read how it was made.
          </p>
        </div>

        <div
          ref={board}
          className="mt-10 rounded-xl bg-[#0a1640] p-3 text-[clamp(12px,3.9vw,30px)] shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_50px_100px_-50px_rgb(0_0_0/0.9)] sm:p-5 md:mt-16 lg:text-[clamp(13px,1.75vw,23px)] xl:text-[clamp(13px,1.27vw,22px)]"
        >
          {/* Column heads, on the same measure as the cells under them. */}
          <div aria-hidden className="flex gap-[0.55em] px-[0.3em] pb-[0.5em] text-fog [&>span>span]:text-[max(11px,0.52em)]">
            <span className="w-[15.11em] shrink-0">
              <span>Product</span>
            </span>
            <span className="w-[27.81em] shrink-0 max-lg:hidden">
              <span>What it is</span>
            </span>
            <span className="w-[17.65em] shrink-0 max-xl:hidden">
              <span>Address</span>
            </span>
            <span className="ml-auto w-[4.95em] shrink-0">
              <span>Status</span>
            </span>
          </div>
          <ul className="space-y-[0.32em]">
            {featuredProjects.map((item, i) => (
              <li key={item.slug}>
                <button
                  type="button"
                  aria-pressed={chosen === i}
                  aria-label={`${item.title}, ${lowerFirst(item.kind ?? "")}, live at ${hostOf(item.link)}. Show it below.`}
                  onClick={() => setChosen(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setChosen(i)}
                  onFocus={() => setChosen(i)}
                  className={cn(
                    "flex w-full items-center gap-[0.55em] rounded-md px-[0.3em] py-[0.26em] text-left transition-colors duration-200",
                    chosen === i ? "bg-white/9" : "hover:bg-white/5"
                  )}
                >
                  <SplitFlap text={item.title} width={COLUMNS.product} play={arrived} delay={i * 170} />
                  <SplitFlap
                    text={item.kind ?? ""}
                    width={COLUMNS.what}
                    play={arrived}
                    delay={i * 170 + 120}
                    className="max-lg:hidden"
                  />
                  <SplitFlap
                    text={hostOf(item.link)}
                    width={COLUMNS.address}
                    play={arrived}
                    delay={i * 170 + 240}
                    className="max-xl:hidden"
                  />
                  <span className="ml-auto [--flap-ink:var(--color-sun)]">
                    <SplitFlap text="LIVE" width={COLUMNS.status} play={arrived} delay={i * 170 + 380} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* The chosen product, in a browser window. */}
        <article
          aria-labelledby="work-chosen"
          style={{ "--accent": project.accent ?? "#ffce1f" } as CSSProperties}
          className="mt-6 grid gap-x-10 gap-y-8 md:mt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center"
        >
          <div className="max-lg:order-last">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fine text-fog">
              <span aria-hidden className="size-2.5 rounded-full bg-(--accent)" />
              {project.kind}
              {project.role && (
                <span>
                  {project.role}, {project.year}
                </span>
              )}
            </p>
            <h3 id="work-chosen" className="mt-4 text-[clamp(34px,4.4vw,72px)]">
              {project.title}
            </h3>
            <p className="mt-4 max-w-[46ch] text-body text-fog">{project.summary}</p>
            <ul aria-label="Built with" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-fine">
              {project.stack?.slice(0, 6).map((name) => (
                <li key={name} className="inline-flex items-center gap-2">
                  <BrandIcon name={name} className="size-4 shrink-0" />
                  {stackName(name)}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Sign href={`/work/${project.slug}`}>Read the case study</Sign>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-underline text-ui font-bold">
                Open {hostOf(project.link)}
              </a>
            </div>
          </div>

          <Link href={`/work/${project.slug}`} tabIndex={-1} aria-hidden className="block">
            <BrowserFrame host={hostOf(project.link)}>
              <div className="@container relative aspect-[16/10] overflow-hidden bg-night">
                {featuredProjects.map((item, i) =>
                  item.scroll ? (
                    <Image
                      key={item.slug}
                      src={item.scroll.src}
                      alt=""
                      width={item.scroll.width}
                      height={item.scroll.height}
                      sizes="(min-width: 1024px) 56vw, 100vw"
                      loading="lazy"
                      // The page scrolls itself only while it is the one on show, and waits for the
                      // board to arrive, so a visitor always meets it at the top.
                      style={{ animationPlayState: arrived && chosen === i ? "running" : "paused" }}
                      className={cn(
                        "absolute inset-x-0 top-0 h-auto w-full transition-opacity duration-500 motion-safe:animate-[screen-pan_26s_ease-in-out_1.2s_infinite_alternate]",
                        chosen === i ? "opacity-100" : "opacity-0"
                      )}
                    />
                  ) : null
                )}
              </div>
            </BrowserFrame>
          </Link>
        </article>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-t pt-8 md:mt-20">
          <p className="text-lead">{archived} more in the archive, back to my first React apps.</p>
          <Link href="/projects" className="link-underline text-ui font-bold">
            See every project
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Arrivals;
