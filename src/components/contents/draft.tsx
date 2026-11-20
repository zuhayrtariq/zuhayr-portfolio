"use client";

import ScreenFrame from "@/components/draft/screen-frame";
import BrandIcon, { bareName } from "@/components/ui/brand-icon";
import BrowserFrame from "@/components/ui/browser-frame";
import { getProject } from "@/constants/projects";
import { useDraft, type DraftExample } from "@/hooks/use-draft";
import { handToContact } from "@/lib/contact-topic";
import { briefMessage, screenIsDrawable } from "@/lib/draft";
import { cn } from "@/lib/utils";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Rise from "../motion/rise";

const EXAMPLES: (DraftExample & { label: string })[] = [
  {
    label: "A clinic booking app",
    idea: "A booking app for my dental clinic. Patients book and pay a deposit online, and the front desk sees the whole day.",
    file: "/drafts/booking.txt",
  },
  {
    label: "An AI support agent",
    idea: "An AI agent for my online store that answers customers from our help docs and can look up their orders.",
    file: "/drafts/support.txt",
  },
  {
    label: "A revenue dashboard",
    idea: "A dashboard that pulls in our Stripe revenue and ad spend and explains what changed each week.",
    file: "/drafts/dashboard.txt",
  },
];

const MIN_IDEA = 12;
const MAX_IDEA = 600;

/** A line that fades up as it is written. */
const ARRIVE = "motion-safe:animate-[page-in_0.45s_var(--ease-lights)_both]";

const Part = ({ title, className, children }: { title: string; className?: string; children: ReactNode }) => (
  <div className={className}>
    <h4 className="text-fine font-bold">{title}</h4>
    {children}
  </div>
);

/**
 * "Describe it": the visitor types a product and watches a first brief and
 * the product's main screen get drafted. Until they do, a finished example
 * plays, so the section is never empty.
 */
const Draft = () => {
  const { draft, status, shown, waiting, error, seconds, play, start } = useDraft();
  const [idea, setIdea] = useState("");
  const [hint, setHint] = useState("");
  const section = useRef<HTMLElement>(null);
  const ideaId = useId();
  const hintId = useId();

  // The first example plays once the section is on screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        void play(EXAMPLES[0], window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      },
      { rootMargin: "0px 0px -30% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  // A draft can leave the section a little taller or shorter, which moves every pinned section below it.
  useEffect(() => {
    if (status === "writing" || status === "idle") return;
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [status]);

  const submit = () => {
    const text = idea.trim();
    if (text.length < MIN_IDEA) {
      setHint("Add a little more: what is it, and who is it for?");
      return;
    }
    setHint("");
    void start(text);
  };

  const writing = status === "writing";
  const live = shown.source === "live";
  const drawing = screenIsDrawable(draft.screen);
  // After a failure the last whole draft is back on show, so it counts as finished too.
  const finished = status !== "writing" && status !== "idle";
  const like = draft.like ? getProject(draft.like) : undefined;
  const slug = draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const progress = waiting
    ? "Reading your idea"
    : !writing
      ? ""
      : !draft.planned
        ? "Writing the brief"
        : drawing
          ? "Drawing the main screen"
          : "Setting up the main screen";

  const note =
    status === "offline"
      ? "Live drafts aren't switched on right now. Send me the idea and I'll reply with the scope myself."
      : status === "error"
        ? error || "That draft didn't come through. Try again, or send me the idea and I'll scope it myself."
        : finished && draft.decline
          ? ""
          : finished && live
            ? `Drafted in ${seconds === 1 ? "a second" : `${seconds} seconds`}. It's a starting point for a conversation, not a quote.`
            : finished
              ? "This one is an example. Describe your own product above and it's drafted while you watch."
              : "";

  return (
    <section ref={section} id="draft" aria-labelledby="draft-title" className="relative">
      <div className="mx-auto max-w-[1680px] px-[clamp(16px,4vw,64px)] pb-24 pt-24 md:pb-40 md:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <Rise
            as="h2"
            by="lines"
            id="draft-title"
            className="font-display text-[clamp(72px,12vw,216px)] leading-[0.82] tracking-[-0.01em]"
          >
            Describe it
          </Rise>
          <p className="max-w-[38ch] pb-2 text-body text-fog lg:pb-5">
            Tell me what you want built. You get the first version I&apos;d ship, a week-by-week plan and a first look
            at the main screen, drafted while you watch.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-12 md:mt-16"
        >
          <div className="flex flex-col gap-3 rounded-[28px] border border-input bg-umbra/75 p-3 pl-6 outline-offset-3 transition-colors focus-within:border-caption/60 has-[textarea:focus-visible]:outline-2 has-[textarea:focus-visible]:outline-signal sm:flex-row sm:items-end">
            <label htmlFor={ideaId} className="sr-only">
              Describe the product you want built
            </label>
            <textarea
              id={ideaId}
              name="idea"
              rows={2}
              value={idea}
              maxLength={MAX_IDEA}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="A marketplace where local bakeries sell tomorrow's surplus…"
              aria-describedby={hint ? hintId : undefined}
              aria-invalid={hint ? true : undefined}
              enterKeyHint="send"
              className="min-h-[4.25rem] min-w-0 flex-1 resize-none bg-transparent py-2.5 text-lead leading-snug text-caption outline-none placeholder:text-fog/70 focus-visible:outline-none max-sm:text-body"
            />
            <button
              type="submit"
              disabled={writing && (waiting || live)}
              className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-signal px-8 text-ui font-bold text-ink transition-colors hover:bg-caption disabled:pointer-events-none disabled:opacity-60"
            >
              Draft it <ArrowRightIcon aria-hidden className="size-4" />
            </button>
          </div>
          {hint && (
            <p id={hintId} className="mt-3 pl-6 text-fine text-error">
              {hint}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2.5 pl-1">
            <span className="text-fine text-fog">Or watch an example:</span>
            {EXAMPLES.map((example) => {
              const current = !live && shown.idea === example.idea;
              return (
                <button
                  key={example.file}
                  type="button"
                  aria-pressed={current}
                  onClick={() => void play(example, window.matchMedia("(prefers-reduced-motion: reduce)").matches)}
                  className={cn(
                    "h-10 rounded-full border px-4 text-fine transition-colors",
                    current ? "border-caption bg-caption text-ink" : "border-input text-caption hover:border-caption/60"
                  )}
                >
                  {example.label}
                </button>
              );
            })}
          </div>
        </form>

        <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-12 lg:gap-8">
          {/* The screen, and under it the weeks. */}
          <div className="flex flex-col lg:col-span-7">
            <p className={cn("mb-4 text-fine text-fog transition-opacity duration-500", waiting && "opacity-40")}>
              <span className="font-bold text-caption">{live ? "Your idea" : "The idea"}:</span>{" "}
              {shown.idea ? `“${shown.idea}”` : "…"}
            </p>
            <BrowserFrame
              host={slug ? `first draft / ${slug}` : "first draft"}
              className={cn("transition-opacity duration-500", waiting && "opacity-40")}
            >
              <div className="relative">
                <ScreenFrame
                  screen={draft.screen}
                  done={finished}
                  label={draft.name ? `A first draft of the main screen of ${draft.name}` : "The main screen, not drawn yet"}
                />
                {/* Until the screen exists, the frame carries the product's name. */}
                {!drawing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-umbra px-8 text-center">
                    <p className="font-display text-[clamp(48px,7vw,120px)] leading-[0.85]">
                      {draft.decline ? "No draft" : draft.name || "\u00a0"}
                    </p>
                    {!draft.decline && <p className="max-w-[44ch] text-ui text-fog">{draft.pitch}</p>}
                  </div>
                )}
              </div>
            </BrowserFrame>

            <div className={cn("mt-8 transition-opacity duration-500 lg:min-h-[9.5rem]", waiting && "opacity-40")}>
              <h3 className="font-text text-fine font-bold">What you can open, week by week</h3>
              <ol className="mt-4 grid gap-x-5 gap-y-4 sm:grid-flow-col sm:auto-cols-fr">
                {draft.weeks.map((week, i) => (
                  <li key={i} className={cn("border-t border-caption/25 pt-3", ARRIVE)}>
                    <p className="flex items-center gap-2 text-fine font-bold text-tungsten">
                      <span aria-hidden className="size-1.5 rounded-full bg-signal" />
                      Week {week.when}
                    </p>
                    <p className="mt-1.5 text-fine leading-snug text-caption">{week.what}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* What is happening, then what to do next. */}
            <div className="mt-auto flex min-h-14 flex-wrap items-center justify-between gap-x-8 gap-y-4 pt-8">
              <p role="status" className="flex max-w-[46ch] items-center gap-3 text-ui text-fog">
                {progress && <span aria-hidden className="size-2 shrink-0 rounded-full bg-signal motion-safe:animate-pulse" />}
                {progress || note}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {finished && like?.slug && (
                  <Link href={`/work/${like.slug}`} className="link-underline inline-flex items-center gap-1 text-ui font-bold">
                    The closest thing I&apos;ve shipped: {like.title} <ArrowUpRightIcon aria-hidden className="size-4" />
                  </Link>
                )}
                {status === "done" && live && !draft.decline && (
                  <button
                    type="button"
                    onClick={() => handToContact(briefMessage(shown.idea, draft))}
                    className="inline-flex h-13 items-center gap-2 rounded-full bg-signal px-8 text-ui font-bold text-ink transition-colors hover:bg-caption"
                  >
                    Send me this brief <ArrowRightIcon aria-hidden className="size-4" />
                  </button>
                )}
                {(status === "offline" || status === "error") && idea.trim().length >= MIN_IDEA && (
                  <button
                    type="button"
                    onClick={() => handToContact(`I'd like to build: ${idea.trim()}\n`)}
                    className="inline-flex h-13 items-center gap-2 rounded-full bg-signal px-8 text-ui font-bold text-ink transition-colors hover:bg-caption"
                  >
                    Send me the idea <ArrowRightIcon aria-hidden className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* The brief, on paper. */}
          <article
            aria-labelledby="draft-brief"
            className={cn(
              "flex flex-col gap-7 rounded-[28px] bg-paper p-7 text-ink transition-opacity duration-500 selection:bg-ink selection:text-paper lg:col-span-5 lg:min-h-[56rem] lg:p-9",
              waiting && "opacity-40"
            )}
          >
            <header>
              <p className="flex items-center justify-between gap-4 text-fine text-ink/65">
                <span>First draft of the brief</span>
                <span className="rounded-full border border-ink/25 px-3 py-1">{live ? "Yours" : "Example"}</span>
              </p>
              <h3 id="draft-brief" className="mt-5 font-display text-[clamp(56px,5.6vw,92px)] leading-[0.85] tracking-[-0.01em]">
                {draft.decline ? "No draft" : draft.name || "\u00a0"}
              </h3>
              <p className="mt-3 min-h-[3.4em] text-body leading-snug">{draft.decline ?? draft.pitch}</p>
            </header>

            {!draft.decline && (
              <>
                <Part title="Version one">
                  <ul className="mt-3 space-y-2">
                    {draft.v1.map((item, i) => (
                      <li key={i} className={cn("flex gap-3 text-ui leading-snug", ARRIVE)}>
                        <CheckIcon aria-hidden className="mt-0.5 size-4.5 shrink-0 text-ember" strokeWidth={3} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Part>

                {draft.later.length > 0 && (
                  <Part title="Left for later, on purpose" className={ARRIVE}>
                    <p className="mt-2 text-ui leading-snug text-ink/65">{draft.later.join(". ")}.</p>
                  </Part>
                )}

                {draft.stack.length > 0 && (
                  <Part title="Built with" className={ARRIVE}>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {draft.stack.map((tool, i) => (
                        <li
                          key={i}
                          className={cn("flex h-9 items-center gap-2 rounded-full border border-ink/20 px-3.5 text-fine", ARRIVE)}
                        >
                          <BrandIcon name={tool} colored={false} className="size-3.5" />
                          {bareName(tool)}
                        </li>
                      ))}
                    </ul>
                  </Part>
                )}

                {draft.asks.length > 0 && (
                  <Part title="Before starting, I'd ask" className={cn("mt-auto border-t border-ink/15 pt-6", ARRIVE)}>
                    <ol className="mt-3 space-y-2">
                      {draft.asks.map((ask, i) => (
                        <li key={i} className={cn("flex gap-3 text-ui leading-snug", ARRIVE)}>
                          <span aria-hidden className="w-4 shrink-0 font-bold tabular-nums text-ink/45">
                            {i + 1}
                          </span>
                          {ask}
                        </li>
                      ))}
                    </ol>
                  </Part>
                )}
              </>
            )}
          </article>
        </div>

      </div>
    </section>
  );
};

export default Draft;
