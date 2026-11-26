/** The facts of where the work happens. */
const DESK = [
  { label: "The desk", value: "A Mac mini, three laptops and two monitors." },
  { label: "If a machine fails", value: "I carry on from the next one. Your code lives in the repository, not on one disk." },
  { label: "Where", value: "Islamabad, Pakistan. UTC+5, all year." },
];

/**
 * The top of "How I work": the two things he wants a client to know before anything else,
 * and where he sits when he does them.
 */
const HowHero = () => {
  return (
    <section aria-labelledby="how-title" className="on-pine relative bg-pine">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pb-24 pt-36 md:pb-32 md:pt-48">
        <h1 id="how-title" className="max-w-[17ch] text-[clamp(38px,6.2vw,108px)]">
          I finish what I start. If it breaks, it&apos;s mine.
        </h1>
        <div className="mt-10 grid gap-x-12 gap-y-12 md:mt-14 xl:grid-cols-12">
          <p className="max-w-[46ch] text-body lg:text-lead xl:col-span-6">
            I work remotely from Islamabad, mostly for clients in other time zones. This page is what you&apos;d see if
            you sat next to me: how I decide something is done, what I do when it goes wrong, my hours against yours,
            and how I use AI.
          </p>
          {/* Three across on a tablet, a column beside the paragraph on a wide screen. */}
          <dl className="grid gap-x-10 gap-y-6 border-t pt-6 text-ui md:grid-cols-3 xl:col-span-5 xl:col-start-8 xl:grid-cols-1 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-0">
            {DESK.map((fact) => (
              <div key={fact.label} className="grid gap-x-6 gap-y-1 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
                <dt className="text-fog">{fact.label}</dt>
                <dd className="max-w-[34ch]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default HowHero;
