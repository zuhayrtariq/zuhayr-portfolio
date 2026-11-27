import { cn } from "@/lib/utils";

/**
 * The life of a bug in something he has shipped, as the three things that happen to an issue:
 * it is opened, it is fixed, and it is closed with a note. The colours are the ones every
 * tracker uses for those states.
 */
const EVENTS = [
  {
    state: "Opened",
    by: "By you, a user, or the error monitoring",
    text: "Something I built has stopped working.",
    dot: "bg-fail",
  },
  {
    state: "Fixed",
    by: "By me, as soon as I see it",
    text: "Cause found and fixed, then tested the way a user would run into it, before it goes out.",
    dot: "bg-wait",
  },
  {
    state: "Closed",
    by: "With a note from me to you",
    text: "What broke, why, and what I changed so it doesn't come back.",
    dot: "bg-mint",
  },
];

/** What he does when something breaks, and what he promises about it. */
const Issue = () => {
  return (
    <section aria-labelledby="breaks-title" className="on-brand relative bg-brand">
      <div className="mx-auto grid max-w-[1680px] gap-x-12 gap-y-12 px-[clamp(20px,4vw,64px)] py-24 md:py-36 lg:grid-cols-12 lg:items-start">
        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <h2 id="breaks-title" className="text-[clamp(34px,4.3vw,72px)]">
            If it breaks, it&apos;s mine.
          </h2>
          <div className="mt-7 max-w-[44ch] space-y-5 text-body lg:text-lead">
            <p>Software breaks. What matters is who picks it up, and how fast.</p>
            <p>
              A bug in something I&apos;ve shipped gets written down, and it stays open until it is fixed and I&apos;ve
              told you what I changed. You don&apos;t have to chase me to do it.
            </p>
          </div>
          <dl className="mt-9 max-w-[44ch] space-y-5 border-t border-white/25 pt-7 text-ui">
            <div>
              <dt className="text-fine text-fog">The first 30 days after launch</dt>
              <dd className="mt-1.5 font-bold">Bugs in what I built are fixed free.</dd>
            </div>
            <div>
              <dt className="text-fine text-fog">After that</dt>
              <dd className="mt-1.5 font-bold">A monthly retainer, if you want me to stay on.</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <div className="on-paper overflow-hidden rounded-xl bg-paper shadow-[0_50px_100px_-40px_rgb(5_11_32/0.75)]">
            <p className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-2 border-ink px-5 py-4 text-ui font-bold sm:px-8">
              <span>A bug, from report to closed</span>
              <span className="inline-flex items-center gap-2 rounded-md bg-mint px-3 py-1.5 text-fine text-ink">
                <svg viewBox="0 0 20 20" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3.4">
                  <path d="m4 10.5 4 4 8-9" />
                </svg>
                Closed
              </span>
            </p>
            <ol className="px-5 py-3 sm:px-8 sm:py-5">
              {EVENTS.map((event, i) => (
                <li key={event.state} className="relative grid gap-x-8 gap-y-2 py-5 pl-10 sm:grid-cols-[12rem_minmax(0,1fr)] sm:py-7">
                  {/* The line that joins one event to the next. */}
                  {i < EVENTS.length - 1 && <span aria-hidden className="absolute bottom-[-1.6rem] left-[8px] top-9 w-0.5 bg-ink/25 sm:top-11" />}
                  <span aria-hidden className={cn("absolute left-0 top-6 size-[18px] rounded-full border-[3px] border-ink sm:top-8", event.dot)} />
                  <div>
                    <h3 className="text-[24px] sm:text-[28px]">{event.state}</h3>
                    <p className="mt-1.5 text-fine leading-snug text-fog">{event.by}</p>
                  </div>
                  <p className="max-w-[44ch] text-body sm:text-lead sm:leading-snug">{event.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Issue;
