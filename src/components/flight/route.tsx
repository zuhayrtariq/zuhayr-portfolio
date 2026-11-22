import BrandIcon, { bareName } from "@/components/ui/brand-icon";
import Sign from "@/components/ui/sign";
import { experiences } from "@/constants/experiences";
import { SITE } from "@/constants/site";
import { SKILLS } from "@/constants/skills";
import { cn } from "@/lib/utils";

/** Each employer as the three letters an airport would get. */
const CODES: Record<string, string> = {
  "Lucky Cement Ltd.": "LCK",
  "TFM Digital": "TFM",
  "EZ Solvers": "EZS",
  "Prime International Oil And Gas": "PRM",
  "Upwork — Freelance": "UPW",
  "Starling MX": "SMX",
};

const MONTHS = /\b(January|February|March|April|June|July|August|September|October|November|December)\b/g;
const shortRange = (date: string) => date.replace(MONTHS, (m) => m.slice(0, 3)).replace(" - ", " to ");

/**
 * Where he has worked, drawn as a route: six stops from an internship to the two roles he
 * holds now. Under it, what he flies with.
 */
const Route = () => {
  return (
    <section id="experience" aria-labelledby="experience-title" className="on-cloud relative bg-cloud">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-24 md:py-36">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <h2 id="experience-title" className="text-[clamp(34px,4.3vw,72px)]">
              The route so far.
            </h2>
            <p className="mt-5 max-w-[46ch] text-body text-fog lg:text-lead">
              Five years, from an SAP internship to leading engineering on an enterprise AI platform.
            </p>
          </div>
          <Sign href={SITE.resume} tone="night" download>
            Download my résumé
          </Sign>
        </div>

        <ol className="relative mt-14 grid gap-y-9 md:mt-20 lg:grid-cols-6 lg:gap-x-6">
          {/* The line the stops sit on: down the side on a phone, across the top on a wide screen. */}
          <span
            aria-hidden
            className="absolute bottom-3 left-[7px] top-3 border-l-2 border-dashed border-night/30 lg:inset-x-0 lg:bottom-auto lg:top-[7px] lg:border-l-0 lg:border-t-2"
          />
          {experiences.map((job) => (
            <li key={`${job.company_name}-${job.date}`} className="relative pl-9 lg:pl-0 lg:pt-10">
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-2 size-4 rounded-full border-[3px] border-night lg:top-0",
                  job.active ? "bg-sun" : "bg-cloud"
                )}
              />
              <a href={job.link} target="_blank" rel="noopener noreferrer" className="group/stop block">
                <p className="flex items-center gap-3">
                  <span className="font-display text-[clamp(34px,3.1vw,50px)] font-extrabold leading-none tracking-[-0.03em] font-stretch-[135%] transition-colors group-hover/stop:text-cobalt">
                    {CODES[job.company_name]}
                  </span>
                  {job.active && <span className="rounded-sm bg-night px-2 py-1 text-[12px] font-bold leading-none text-sun">Now</span>}
                </p>
                <p className="mt-3 text-ui font-bold leading-snug">{job.company_name.replace(" — Freelance", "")}</p>
                <p className="mt-1 text-fine leading-snug">{job.title.split(" — ")[0]}</p>
                <p className="mt-1 font-mono text-[13px] text-fog">{shortRange(job.date)}</p>
                <p className="mt-3 max-w-[44ch] text-fine leading-snug text-fog">{job.summary}</p>
              </a>
            </li>
          ))}
        </ol>

        <div className="mt-20 border-t pt-10 md:mt-28">
          <h3 className="text-[clamp(26px,2.6vw,42px)]">Whatever your product needs.</h3>
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

export default Route;
