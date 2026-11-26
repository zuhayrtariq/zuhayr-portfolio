"use client";

import ScreenFrame from "@/components/draft/screen-frame";
import Window from "@/components/ui/window";
import { screenIsDrawable, type Draft } from "@/lib/draft";
import { cn, lowerFirst } from "@/lib/utils";
import { memo, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** A line that fades up as it is written. */
const ARRIVE = "motion-safe:animate-[page-in_0.45s_var(--ease-lights)_both]";

/** The drafted screen is redrawn only when the screen itself changes, not on every scroll tick. */
const Screen = memo(ScreenFrame);

/** A product's name as it would sit in an address. */
export const slugOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "your-product";

/** The marks of a Markdown file, which a reader skips. */
const Mark = ({ children }: { children: ReactNode }) => (
  <span aria-hidden className="shrink-0 text-fog/65">
    {children}
  </span>
);

const Check = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" aria-hidden className={cn("size-[1.05em] shrink-0", className)} fill="none" stroke="currentColor" strokeWidth="3">
    <path d="m4 10.5 4 4 8-9" />
  </svg>
);

interface BriefProps {
  draft: Draft;
  /** How far down the brief the window has read: 0 is its first line, 1 its last. */
  scroll?: number;
  /** Show the whole brief, however long, where nothing will scroll it. */
  whole?: boolean;
  className?: string;
}

/**
 * The written scope, as the Markdown file it would be: what version one includes, what is
 * left out on purpose, when each piece arrives, and what he would ask first.
 */
export const BriefWindow = ({ draft, scroll = 0, whole = false, className }: BriefProps) => {
  const view = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  /** How much of the brief does not fit in the window, in pixels. */
  const [over, setOver] = useState(0);

  useIsoLayoutEffect(() => {
    const viewEl = view.current;
    const pageEl = page.current;
    if (!viewEl || !pageEl) return;
    const measure = () => setOver(Math.max(0, pageEl.offsetHeight - viewEl.clientHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewEl);
    ro.observe(pageEl);
    return () => ro.disconnect();
  }, []);

  const heading = "flex gap-[0.7em] pt-[1em] font-bold text-caption";
  const item = cn("flex gap-[0.7em] text-caption", ARRIVE);

  return (
    <Window title="brief.md" className={className}>
      <div ref={view} className={cn("overflow-hidden", !whole && "h-[min(29em,var(--fit,29em))]")}>
        <div
          ref={page}
          style={{ transform: `translate3d(0, ${(-scroll * over).toFixed(1)}px, 0)` }}
          className="px-[1.3em] pb-[1.5em] pt-[1.1em] font-mono text-[0.82em] leading-[1.6] text-fog transition-transform duration-500 ease-[var(--ease-lights)]"
        >
          {draft.decline ? (
            <p className="text-caption">{draft.decline}</p>
          ) : (
            <>
              <p className="flex gap-[0.7em] text-[1.2em] font-bold text-caption">
                <Mark>#</Mark>
                {draft.name || "\u00a0"}
              </p>
              <p className="mt-[0.4em] min-h-[3.2em]">{draft.pitch}</p>

              {draft.v1.length > 0 && (
                <p className={heading}>
                  <Mark>##</Mark>Version one
                </p>
              )}
              {draft.v1.map((line, i) => (
                <p key={i} className={item}>
                  <Mark>-</Mark>
                  {line}
                </p>
              ))}

              {draft.later.length > 0 && (
                <p className={cn(heading, ARRIVE)}>
                  <Mark>##</Mark>Left for later, on purpose
                </p>
              )}
              {draft.later.map((line, i) => (
                <p key={i} className={cn("flex gap-[0.7em]", ARRIVE)}>
                  <Mark>-</Mark>
                  {line}
                </p>
              ))}

              {draft.stack.length > 0 && (
                <>
                  <p className={cn(heading, ARRIVE)}>
                    <Mark>##</Mark>Built with
                  </p>
                  <p className={ARRIVE}>{draft.stack.join(", ")}</p>
                </>
              )}

              {draft.weeks.length > 0 && (
                <p className={cn(heading, ARRIVE)}>
                  <Mark>##</Mark>When each piece is due
                </p>
              )}
              {draft.weeks.map((week, i) => (
                <p key={i} className={item}>
                  <span className="w-[5.2em] shrink-0 text-mint">Week {week.when}</span>
                  {week.what}
                </p>
              ))}

              {draft.asks.length > 0 && (
                <p className={cn(heading, ARRIVE)}>
                  <Mark>##</Mark>Before I start, I&apos;d ask
                </p>
              )}
              {draft.asks.map((ask, i) => (
                <p key={i} className={item}>
                  <Mark>{i + 1}.</Mark>
                  {ask}
                </p>
              ))}
            </>
          )}
        </div>
      </div>
    </Window>
  );
};

/** How many of version one's tests have passed, a fraction `t` of the way through the build. */
export const passedAt = (draft: Draft, t: number) => Math.min(draft.v1.length, Math.floor(t * (draft.v1.length + 1)));

/**
 * Version one, written as tests: each thing the brief promised is a line that has to go
 * green before anything ships. The only code on the page, and it is the scope.
 */
export const TestsWindow = ({ draft, passed, className }: { draft: Draft; passed: number; className?: string }) => {
  const total = draft.v1.length;
  const keyword = "text-fog";
  return (
    <Window
      title="version-one.test.ts"
      status={
        <span className={cn("font-mono font-bold", passed >= total ? "text-mint" : "text-wait")}>
          {passed} of {total} passing
        </span>
      }
      className={className}
    >
      <div className="px-[1.3em] pb-[1.4em] pt-[1.1em] font-mono text-[0.82em] leading-[1.8]">
        <p className="voice-note text-fog">{"// Version one, written as tests."}</p>
        <p className="voice-note text-fog">{"// Nothing ships until every line is green."}</p>
        <p className="mt-[0.7em]">
          <span className={keyword}>describe</span>(&quot;{draft.name}&quot;, () =&gt; {"{"}
        </p>
        {draft.v1.map((line, i) => {
          const state = i < passed ? "passed" : i === passed ? "running" : "waiting";
          return (
            <p key={i} className="flex items-center gap-[0.8em] pl-[1.5em]">
              <span className={cn("min-w-0 flex-1 truncate transition-colors duration-300", state === "passed" && "text-mint")}>
                <span className={state === "passed" ? undefined : keyword}>it</span>(&quot;{lowerFirst(line)}&quot;)
              </span>
              {state === "passed" ? (
                <Check className="text-mint" />
              ) : (
                <span
                  aria-hidden
                  className={cn("mx-[0.2em] size-[0.62em] shrink-0 rounded-full", state === "running" ? "bg-wait" : "border border-fog/70")}
                />
              )}
            </p>
          );
        })}
        <p>{"});"}</p>
      </div>
    </Window>
  );
};

/** What he sends while a product is being built: what can be opened each week, and the one thing that needs an answer. */
export const updatesOf = (draft: Draft) => {
  const entries = draft.weeks.map((week) => ({ label: `Week ${week.when}`, text: week.what, ask: false }));
  const ask = draft.asks[draft.asks.length - 1];
  if (ask && entries.length) entries.splice(Math.min(2, entries.length), 0, { label: "I need a decision from you", text: ask, ask: true });
  return entries;
};

export const updatesAt = (draft: Draft, t: number) => Math.max(1, Math.ceil(t * updatesOf(draft).length));

/** The updates, as the thread a client would read them in. */
export const UpdatesWindow = ({ draft, shown, className }: { draft: Draft; shown: number; className?: string }) => {
  return (
    <Window tone="paper" title="Updates" className={className}>
      <div className="flex h-[min(27.5em,var(--fit,27.5em))] flex-col overflow-hidden text-[0.88em] leading-[1.45]">
        <p className="flex items-center gap-[0.7em] border-b px-[1.2em] py-[0.8em]">
          {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
          <img src="/images/avatar.webp" alt="" width={32} height={32} decoding="async" className="size-[2em] rounded-full bg-emerald" />
          <span className="font-bold">Zuhayr</span>
          <span className="text-fog">to you</span>
        </p>
        <ol className="flex flex-1 flex-col justify-end gap-[0.6em] p-[1.2em]">
          {updatesOf(draft)
            .slice(0, shown)
            .map((entry) => (
              <li key={entry.label} className={cn("rounded-[0.6em] px-[1em] py-[0.75em]", entry.ask ? "bg-wait/35" : "bg-umbra", ARRIVE)}>
                <p className="flex items-center gap-[0.5em] font-bold">
                  {!entry.ask && <Check className="text-emerald" />}
                  {entry.label}
                </p>
                <p className="mt-[0.15em]">{entry.text}</p>
              </li>
            ))}
        </ol>
      </div>
    </Window>
  );
};

/** What the terminal prints on the day of the launch. The last line is the point of the whole page. */
export const launchLines = (draft: Draft) => [
  `${draft.v1.length} of ${draft.v1.length} tests passing`,
  "Built",
  "Deployed to production",
  "Error monitoring on",
  `Live at ${slugOf(draft.name)}.example`,
];

/** One more than the lines, for the note under them. */
export const launchAt = (draft: Draft, t: number) => Math.ceil(t * (launchLines(draft).length + 1));

export const TerminalWindow = ({ draft, shown, className }: { draft: Draft; shown: number; className?: string }) => {
  const lines = launchLines(draft);
  return (
    <Window title="terminal" className={className}>
      <div className="min-h-[14.5em] px-[1.3em] pb-[1.3em] pt-[1.1em] font-mono text-[0.82em] leading-[1.85]">
        <p>
          <span className="text-fog">$</span> git push
        </p>
        {lines.slice(0, shown).map((line, i) => (
          <p key={i} className={cn("flex items-center gap-[0.7em]", i === lines.length - 1 && "font-bold text-mint", ARRIVE)}>
            <Check className="text-mint" />
            {line}
          </p>
        ))}
        {shown > lines.length && <p className={cn("voice-note mt-[0.5em] text-fog", ARRIVE)}># 30 days of free fixes start today.</p>}
      </div>
    </Window>
  );
};

interface BrowserProps {
  draft: Draft;
  /** True once the whole screen has been written. */
  done: boolean;
  /** Where the product is running: nowhere yet, on his machine, or in production. */
  stage?: "draft" | "local" | "live";
  className?: string;
}

/** The product's main screen, in the browser it is being built in. */
export const BrowserWindow = ({ draft, done, stage = "draft", className }: BrowserProps) => {
  const slug = slugOf(draft.name);
  const drawing = screenIsDrawable(draft.screen);
  return (
    <Window
      tone="paper"
      address={stage === "live" ? `${slug}.example` : stage === "local" ? "localhost:3000" : `first draft / ${slug}`}
      status={stage === "live" && <span className="rounded-[0.4em] bg-mint px-[0.6em] py-[0.35em] font-bold text-pine">Live</span>}
      className={className}
    >
      <div className="relative">
        <Screen
          screen={draft.screen}
          done={done}
          label={draft.name ? `A first draft of the main screen of ${draft.name}` : "The main screen, not drawn yet"}
        />
        {/* Until the screen exists, the frame carries the product's name. */}
        {!drawing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[0.8em] bg-umbra px-[2em] text-center">
            <p className="font-display text-[3.4em] font-black leading-[0.95] tracking-[-0.03em]">{draft.decline ? "No draft" : draft.name || "\u00a0"}</p>
            {!draft.decline && <p className="max-w-[40ch] text-[0.95em] text-fog">{draft.pitch}</p>}
          </div>
        )}
      </div>
    </Window>
  );
};
