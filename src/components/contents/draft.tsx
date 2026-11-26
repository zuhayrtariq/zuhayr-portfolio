"use client";

import ScreenFrame from "@/components/draft/screen-frame";
import { SiteLink, useAudience } from "@/components/site/audience";
import BrandIcon, { bareName } from "@/components/ui/brand-icon";
import BrowserFrame from "@/components/ui/browser-frame";
import { getProject } from "@/constants/projects";
import { useDraft, type DraftExample } from "@/hooks/use-draft";
import { handToContact } from "@/lib/contact-topic";
import { briefMessage, screenIsDrawable } from "@/lib/draft";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
    <h4 className="text-fine font-bold text-fog">{title}</h4>
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
  /** Whether the brief reached the clipboard, for a client who is taking it back to Upwork. */
  const [copied, setCopied] = useState<"" | "done" | "failed">("");
  const viaUpwork = useAudience() === "upwork";
  const section = useRef<HTMLElement>(null);
  // Fixed names: there is one of these on a page, and a generated id can differ between the
  // server and the browser when this component's code arrives after hydration has started.
  const ideaId = "draft-idea";
  const hintId = "draft-idea-hint";

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

  const submit = () => {
    const text = idea.trim();
    if (text.length < MIN_IDEA) {
      setHint("Add a little more: what is it, and who is it for?");
      return;
    }
    setHint("");
    setCopied("");
    void start(text);
  };

  /**
   * Hands a brief to Zuhayr: into the contact form, or for a client from Upwork onto the
   * clipboard, to paste into a message there, since that copy of the site has no form.
   */
  const handOver = (text: string) => {
    if (!viaUpwork) return handToContact(text);
    navigator.clipboard.writeText(text).then(
      () => setCopied("done"),
      () => setCopied("failed")
    );
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

  const where = viaUpwork ? " on Upwork" : "";
  const note =
    copied === "done"
      ? "Copied. Paste it into your message to me on Upwork."
      : copied === "failed"
        ? "It couldn't be copied from here. Select the brief on the right and copy it by hand."
        : status === "offline"
          ? `Live drafts aren't switched on right now. Send me the idea${where} and I'll reply with the scope myself.`
          : status === "error"
            ? error || `That draft didn't come through. Try again, or send me the idea${where} and I'll scope it myself.`
            : finished && draft.decline
              ? ""
              : finished && live
                ? `Drafted in ${seconds === 1 ? "a second" : `${seconds} seconds`}. It's a starting point for a conversation, not a quote.`
                : finished
                  ? "This one is an example. Describe your own product above and it's drafted while you watch."
                  : "";

  return (
    <section ref={section} id="draft" aria-labelledby="draft-title" className="on-night relative bg-night">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pb-24 pt-24 md:pb-36 md:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <h2 id="draft-title" className="text-[clamp(34px,4.6vw,80px)]">
            Tell me where you&apos;re going.
          </h2>
          <p className="max-w-[40ch] pb-1 text-body text-fog">
            Describe what you want built. You get the first version I&apos;d ship, a week-by-week plan and a first look
            at the main screen, drafted while you watch.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-10 md:mt-14"
        >
          <div className="flex flex-col gap-3 rounded-xl border border-input bg-umbra/70 p-3 pl-5 outline-offset-3 transition-colors focus-within:border-caption/70 has-[textarea:focus-visible]:outline-2 has-[textarea:focus-visible]:outline-signal sm:flex-row sm:items-end">
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
              className="inline-flex h-14 shrink-0 items-center justify-center rounded-md bg-sun px-8 text-ui font-bold text-night transition-opacity disabled:pointer-events-none disabled:opacity-60"
            >
              Draft it
            </button>
          </div>
          {hint && (
            <p id={hintId} className="mt-3 pl-5 text-fine text-error">
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
                  onClick={() => {
                    setCopied("");
                    void play(example, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
                  }}
                  className={cn(
                    "h-10 rounded-md border px-4 text-fine transition-colors",
                    current ? "border-sun bg-sun font-bold text-night" : "border-input text-caption hover:border-caption/70"
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
                    <p className="font-display text-[clamp(34px,5vw,84px)] font-extrabold leading-[0.95] tracking-[-0.025em] font-stretch-[135%]">
                      {draft.decline ? "No draft" : draft.name || "\u00a0"}
                    </p>
                    {!draft.decline && <p className="max-w-[44ch] text-ui text-fog">{draft.pitch}</p>}
                  </div>
                )}
              </div>
            </BrowserFrame>

            <div className={cn("mt-8 transition-opacity duration-500 lg:min-h-[9.5rem]", waiting && "opacity-40")}>
              <h3 className="font-text text-fine font-bold tracking-normal font-stretch-normal">What you can open, week by week</h3>
              <ol className="mt-4 grid gap-x-5 gap-y-4 sm:grid-flow-col sm:auto-cols-fr">
                {draft.weeks.map((week, i) => (
                  <li key={i} className={cn("border-t border-caption/25 pt-3", ARRIVE)}>
                    <p className="flex items-center gap-2 text-fine font-bold text-sun">
                      <span aria-hidden className="size-1.5 rounded-full bg-sun" />
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
                {progress && <span aria-hidden className="size-2 shrink-0 rounded-full bg-sun motion-safe:animate-pulse" />}
                {progress || note}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {finished && like?.slug && (
                  <SiteLink href={`/work/${like.slug}`} className="link-underline text-ui font-bold">
                    The closest thing I&apos;ve shipped: {like.title}
                  </SiteLink>
                )}
                {status === "done" && live && !draft.decline && (
                  <button
                    type="button"
                    onClick={() => handOver(briefMessage(shown.idea, draft))}
                    className="inline-flex h-13 items-center rounded-md bg-sun px-7 text-ui font-bold text-night"
                  >
                    {viaUpwork ? "Copy this brief for Upwork" : "Send me this brief"}
                  </button>
                )}
                {(status === "offline" || status === "error") && idea.trim().length >= MIN_IDEA && (
                  <button
                    type="button"
                    onClick={() => handOver(`I'd like to build: ${idea.trim()}\n`)}
                    className="inline-flex h-13 items-center rounded-md bg-sun px-7 text-ui font-bold text-night"
                  >
                    {viaUpwork ? "Copy the idea for Upwork" : "Send me the idea"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* The brief, on paper: the flight plan. */}
          <article
            aria-labelledby="draft-brief"
            className={cn(
              "on-cloud flex flex-col overflow-hidden rounded-xl bg-cloud transition-opacity duration-500 lg:col-span-5 lg:min-h-[54rem]",
              waiting && "opacity-40"
            )}
          >
            <p className="flex items-center justify-between gap-4 bg-sun px-6 py-3 text-fine font-bold text-night lg:px-8">
              <span>Flight plan, first draft</span>
              <span className="font-mono font-normal">{live ? "Yours" : "Example"}</span>
            </p>
            <div className="flex flex-1 flex-col gap-7 p-6 lg:p-8">
              <header>
                <h3 id="draft-brief" className="text-[clamp(34px,3.5vw,58px)]">
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
                          <CheckIcon aria-hidden className="mt-0.5 size-4.5 shrink-0 text-cobalt" strokeWidth={3} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Part>

                  {draft.later.length > 0 && (
                    <Part title="Left for later, on purpose" className={ARRIVE}>
                      <p className="mt-2 text-ui leading-snug text-fog">{draft.later.join(". ")}.</p>
                    </Part>
                  )}

                  {draft.stack.length > 0 && (
                    <Part title="Built with" className={ARRIVE}>
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                        {draft.stack.map((tool, i) => (
                          <li key={i} className={cn("inline-flex items-center gap-1.5 text-ui", ARRIVE)}>
                            <BrandIcon name={tool} className="size-3.5 shrink-0" />
                            {bareName(tool)}
                          </li>
                        ))}
                      </ul>
                    </Part>
                  )}

                  {draft.asks.length > 0 && (
                    <Part title="Before starting, I'd ask" className={cn("mt-auto border-t border-dashed border-night/35 pt-6", ARRIVE)}>
                      <ol className="mt-3 space-y-2">
                        {draft.asks.map((ask, i) => (
                          <li key={i} className={cn("flex gap-3 text-ui leading-snug", ARRIVE)}>
                            <span aria-hidden className="w-4 shrink-0 font-mono font-bold tabular-nums text-fog">
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
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Draft;
