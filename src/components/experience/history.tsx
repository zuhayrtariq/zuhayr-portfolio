import BrandIcon, { bareName } from "@/components/ui/brand-icon";
import Sign from "@/components/ui/sign";
import { experiences } from "@/constants/experiences";
import { SITE } from "@/constants/site";
import { SKILLS } from "@/constants/skills";
import type { Audience } from "@/lib/audience";
import { cn } from "@/lib/utils";

const MONTHS = /\b(January|February|March|April|June|July|August|September|October|November|December)\b/g;
const shortRange = (date: string) => date.replace(MONTHS, (m) => m.slice(0, 3)).replace(" - ", " to ");

/** Where he studied, most recent first. */
const TRAINING = [
  {
    course: "MS in Computer Science",
    school: "FAST NUCES, Karachi",
    note: "GPA 3.89 of 4, with advanced algorithms, machine learning and artificial intelligence.",
  },
  {
    course: "BS in Computer Science",
    school: "Institute of Business Management, Karachi",
    note: "Graduated in 2023 as gold medalist, CGPA 3.8 of 4, on the Dean's List and a Presidential Merit Scholarship.",
  },
  {
    course: "Exchange semester",
    school: "Istanbul Aydin University",
    note: "One semester abroad, in 2022.",
  },
];

/**
 * The Experience page. Where he has worked, newest first, drawn the way a history of commits
 * is drawn: one line down the page with a point for each role, and a second line beside it
 * where two roles run at once, as his two do now. Under it, where he trained and what he
 * builds with.
 */
const History = ({ audience = "direct" }: { audience?: Audience }) => {
  const jobs = experiences.toReversed();
  return (
    <section aria-labelledby="experience-title" className="on-paper relative bg-paper">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pb-24 pt-36 md:pb-36 md:pt-48">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <h1 id="experience-title" className="text-[clamp(36px,5.4vw,92px)]">
              The history so far.
            </h1>
            <p className="mt-6 max-w-[46ch] text-body text-fog lg:text-lead">
              Five years, from an SAP internship to leading engineering on an enterprise AI platform.
            </p>
          </div>
          {/* The résumé carries his email and phone number, which a client from Upwork is not given. */}
          {audience === "direct" && (
            <Sign href={SITE.resume} tone="pine" download>
              Download my résumé
            </Sign>
          )}
        </div>

        <ol className="mt-14 md:mt-20">
          {jobs.map((job, i) => {
            // The newest role runs beside the one under it, so it sits on a line of its own.
            const beside = i === 0;
            const last = i === jobs.length - 1;
            return (
              <li key={`${job.company_name}-${job.date}`} className="relative grid gap-x-10 gap-y-2 pb-12 pl-[4.25rem] last:pb-0 md:grid-cols-[13rem_minmax(0,1fr)] md:pb-14">
                {/* The main line, which stops at the first role. */}
                <span aria-hidden className={cn("absolute left-[7px] top-0 w-0.5 bg-pine/30", last ? "h-3" : "bottom-0")} />
                {/* The second line: down to its point, then round the corner into the main line. */}
                {beside && (
                  <>
                    <span aria-hidden className="absolute left-[35px] top-0 h-3 w-0.5 bg-pine/30" />
                    <span aria-hidden className="absolute bottom-0 left-[8px] top-3 w-[28px] rounded-br-[22px] border-b-2 border-r-2 border-pine/30" />
                  </>
                )}
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-2 size-4 rounded-full border-[3px] border-pine",
                    beside ? "left-[28px]" : "left-0",
                    job.active ? "bg-mint" : "bg-paper"
                  )}
                />
                <p className="flex flex-wrap content-start items-center gap-x-3 gap-y-2 self-start pt-1 font-mono text-fine text-fog">
                  {shortRange(job.date)}
                  {job.active && <span className="rounded-sm bg-mint px-2 py-1 font-text text-[12px] font-bold leading-none text-pine">Now</span>}
                </p>
                <div>
                  <h2 className="text-[clamp(24px,2.4vw,38px)]">{job.title.split(" — ")[0]}</h2>
                  <p className="mt-2 text-ui font-bold">
                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="link-underline">
                      {job.company_name.replace(" — Freelance", "")}
                    </a>
                  </p>
                  <p className="mt-2 max-w-[60ch] text-ui text-fog">{job.summary}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-20 border-t pt-10 md:mt-28">
          <h2 className="text-[clamp(26px,2.6vw,42px)]">Where I trained.</h2>
          <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-3">
            {TRAINING.map((item) => (
              <div key={item.course} className="border-t pt-5">
                <dt className="text-lead font-bold leading-snug">{item.course}</dt>
                <dd className="mt-1 text-ui">{item.school}</dd>
                <dd className="mt-3 max-w-[40ch] text-ui text-fog">{item.note}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-20 border-t pt-10 md:mt-28">
          <h2 className="text-[clamp(26px,2.6vw,42px)]">Whatever your product needs.</h2>
          <dl className="mt-8 grid gap-x-12 md:grid-cols-2">
            {SKILLS.map((group) => (
              <div key={group.title} className="grid gap-x-6 gap-y-2 border-t py-5 sm:grid-cols-[11rem_minmax(0,1fr)]">
                <dt className="text-ui font-bold">{group.title}</dt>
                <dd className="flex flex-wrap gap-x-4 gap-y-1.5 text-ui text-fog">
                  {group.stack.map((name) => (
                    <span key={name} className="inline-flex items-center gap-1.5">
                      <BrandIcon name={name} className="size-3.5 shrink-0" />
                      {bareName(name)}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default History;
