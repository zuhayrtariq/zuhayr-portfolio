import { SiteLink } from "@/components/site/audience";
import { projects } from "@/constants/projects";

/** The rest of the site, one line each. */
const WAYS = [
  { name: "Work", href: "/work", line: `All ${projects.length} projects, back to my first React apps.` },
  { name: "How I work", href: "/how-i-work", line: "My desk, my hours against yours, and what I do when something breaks." },
  { name: "Experience", href: "/experience", line: "Five years, six stops, and the tools I build with." },
  { name: "Talk to me", href: "/talk", line: "Ask my AI anything about my work. It answers out loud." },
];

/**
 * The way on from the home page, as the sign that hangs over a terminal concourse: one
 * panel, an arrow for each direction. It is the largest piece of yellow on the site because
 * it is the largest "this way".
 */
const Wayfinding = () => {
  return (
    <section aria-labelledby="ways-title" className="on-cloud relative bg-cloud">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-24 md:py-32">
        <h2 id="ways-title" className="text-[clamp(34px,4.3vw,72px)]">
          Where to next.
        </h2>
        <nav
          aria-labelledby="ways-title"
          className="mt-10 overflow-hidden rounded-xl bg-night text-night shadow-[0_40px_80px_-45px_rgb(7_18_51/0.7)] md:mt-14"
        >
          {/* The seams between the panels are the dark ground showing through the gaps. */}
          <ul className="grid gap-0.5 sm:grid-cols-2 xl:grid-cols-4">
            {WAYS.map((way) => (
              <li key={way.href} className="bg-sun">
                <SiteLink
                  href={way.href}
                  className="group/way flex h-full items-start gap-5 p-5 [--focus:var(--color-night)] focus-visible:-outline-offset-4 sm:flex-col sm:gap-8 sm:p-7 xl:gap-10 xl:p-8"
                >
                  <span aria-hidden className="grid size-13 shrink-0 place-items-center rounded-md bg-night text-sun sm:size-16">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-6 transition-transform duration-300 ease-[var(--ease-lights)] group-hover/way:-translate-y-0.5 group-hover/way:translate-x-0.5 sm:size-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="square"
                    >
                      <path d="M6 18 18 6M8 6h10v10" />
                    </svg>
                  </span>
                  <span>
                    <span className="block font-display text-[clamp(26px,2.1vw,36px)] font-extrabold leading-none tracking-[-0.025em] font-stretch-[130%]">
                      {way.name}
                    </span>
                    <span className="mt-3 block max-w-[30ch] text-ui leading-snug">{way.line}</span>
                  </span>
                </SiteLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Wayfinding;
