import { experiences } from "@/constants/experiences";
import { ArrowUpRightIcon } from "lucide-react";
import Rise from "../motion/rise";

const MONTHS =
  /\b(January|February|March|April|June|July|August|September|October|November|December)\b/g;

const formatRange = (date: string) =>
  date.replace(MONTHS, (m) => m.slice(0, 3)).replace(" - ", " to ");

const Experience = () => {
  const jobs = experiences.toReversed();

  return (
    <section id="experience" aria-labelledby="experience-title" className="on-paper">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pb-10 pt-28 md:pt-44">
        <Rise
          as="h2"
          by="lines"
          id="experience-title"
          className="font-display text-[clamp(72px,13.5vw,240px)] leading-[0.82] tracking-[-0.01em]"
        >
          Experience
        </Rise>

        <ol className="mt-12 border-t border-caption/25 md:mt-20">
          {jobs.map((job) => (
            <li key={`${job.company_name}-${job.date}`} className="border-b border-caption/25">
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Visit"
                className="group/row relative isolate grid gap-x-8 gap-y-2 py-7 outline-offset-[-2px] md:grid-cols-[10rem_minmax(0,1fr)_auto] md:items-baseline md:px-5 md:py-9"
              >
                {/* Ink rises through the row on hover and the type flips to paper. */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-caption transition-transform duration-500 ease-[var(--ease-lights)] group-hover/row:scale-y-100 group-focus-visible/row:scale-y-100 max-md:hidden"
                />
                <span className="text-ui tabular-nums text-fog transition-colors duration-300 md:group-hover/row:text-backdrop/70 md:group-focus-visible/row:text-backdrop/70">
                  {formatRange(job.date)}
                </span>
                <span className="transition-colors duration-300 md:group-hover/row:text-backdrop md:group-focus-visible/row:text-backdrop">
                  <span className="block font-display text-[clamp(40px,5.4vw,92px)] leading-[0.92]">
                    {job.company_name.replace(" — Freelance", "")}
                  </span>
                  <span className="mt-3 block max-w-[58ch] text-body text-fog transition-colors duration-300 md:group-hover/row:text-backdrop/70 md:group-focus-visible/row:text-backdrop/70">
                    {job.summary}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 text-ui font-bold transition-colors duration-300 md:group-hover/row:text-backdrop md:group-focus-visible/row:text-backdrop">
                  {job.title.split(" — ")[0]}
                  <ArrowUpRightIcon
                    aria-hidden
                    className="size-4 transition-transform duration-500 ease-[var(--ease-lights)] group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5"
                  />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
