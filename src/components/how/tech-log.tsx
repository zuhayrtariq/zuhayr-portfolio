/**
 * The three boxes of an aircraft's technical log, filled in with what happens to a defect in
 * something he has shipped. An entry in the real thing is not closed until the last box is signed.
 */
const ENTRY = [
  {
    box: "Defect",
    by: "Entered by you, a user, or the error monitoring",
    text: "Something I built has stopped working.",
  },
  {
    box: "Action taken",
    by: "Mine, as soon as I see it",
    text: "Cause found and fixed, then tested the way a user would run into it, before it goes out.",
  },
  {
    box: "Released",
    by: "Signed, Zuhayr Tariq",
    text: "A note to you: what broke, why, and what I changed so it doesn't come back.",
  },
];

/**
 * What he does when something breaks, set as a page of the log every aircraft carries:
 * a defect is written down, acted on and signed for, by a named person.
 */
const TechLog = () => {
  return (
    <section aria-labelledby="breaks-title" className="on-cobalt relative bg-cobalt">
      <div className="mx-auto grid max-w-[1680px] gap-x-12 gap-y-12 px-[clamp(20px,4vw,64px)] py-24 md:py-36 lg:grid-cols-12 lg:items-start">
        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <h2 id="breaks-title" className="text-[clamp(34px,4.3vw,72px)]">
            If it breaks, it&apos;s mine.
          </h2>
          <div className="mt-7 max-w-[44ch] space-y-5 text-body lg:text-lead">
            <p>Software breaks. What matters is who picks it up, and how fast.</p>
            <p>
              Aircraft have a rule for this. Every defect goes in the technical log, and the entry stays open until
              someone has fixed it and signed for it. I treat everything I&apos;ve shipped the same way, and you
              don&apos;t have to chase me to do it.
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
          <div className="on-cloud overflow-hidden rounded-xl bg-cloud shadow-[0_50px_100px_-40px_rgb(4_11_34/0.75)]">
            <p className="flex items-center justify-between gap-6 bg-night px-5 py-3.5 text-ui font-bold text-cloud sm:px-8">
              <span>Technical log</span>
              <span className="font-mono text-fine font-normal">Entry 1</span>
            </p>
            <ol>
              {ENTRY.map((item) => (
                <li
                  key={item.box}
                  className="grid gap-x-8 gap-y-3 border-t-2 border-night/80 px-5 py-6 first:border-t-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:px-8 sm:py-8"
                >
                  <div>
                    <h3 className="font-text text-[19px] font-bold leading-tight tracking-normal font-stretch-normal">{item.box}</h3>
                    <p className="mt-1.5 font-mono text-[13px] leading-snug text-fog">{item.by}</p>
                  </div>
                  <p className="max-w-[44ch] text-body sm:text-lead sm:leading-snug">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechLog;
