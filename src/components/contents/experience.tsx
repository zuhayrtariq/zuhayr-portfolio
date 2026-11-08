import { experiences } from "@/constants/experiences";
import Section from "../site/section";

const MONTHS =
  /\b(January|February|March|April|June|July|August|September|October|November|December)\b/g;

const formatRange = (date: string) =>
  date.replace(MONTHS, (m) => m.slice(0, 3)).replace(" - ", " to ");

const Experience = () => {
  const jobs = experiences.toReversed();

  return (
    <Section id="experience" question="Where have you worked?">
      <ol className="space-y-14 md:space-y-16">
        {jobs.map((job) => (
          <li
            key={`${job.company_name}-${job.date}`}
            className="grid gap-2 sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:gap-10"
          >
            <p className="text-ui tabular-nums text-fog sm:pt-1.5">{formatRange(job.date)}</p>
            <div>
              <h3 className="font-text text-lead leading-snug font-bold">
                {job.title.split(" — ")[0]},{" "}
                <a href={job.link} target="_blank" rel="noopener noreferrer" className="link-underline">
                  {job.company_name.replace(" — Freelance", "")}
                </a>
              </h3>
              <p className="mt-2 max-w-[60ch] text-body text-fog">{job.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default Experience;
