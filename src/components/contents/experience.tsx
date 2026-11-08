import { experiences } from "@/constants/experiences";
import Image from "next/image";
import Section from "../site/section";

const formatRange = (date: string) =>
  date
    .replace(/\b(January|February|March|April|June|July|August|September|October|November|December)\b/g, (m) => m.slice(0, 3))
    .replace(" - ", " to ");

const Experience = () => {
  const jobs = experiences.toReversed();

  return (
    <Section
      id="experience"
      title="Experience"
      intro="From SAP reports in 2021 to leading an AI platform team today."
    >
      <ol>
        {jobs.map((job) => (
          <li
            key={`${job.company_name}-${job.date}`}
            className="grid gap-2 border-t border-border py-6 first:border-t-0 first:pt-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
          >
            <p className="text-[15px] tabular-nums text-muted-foreground sm:pt-1">
              {formatRange(job.date)}
              {job.active && (
                <span className="mt-1 block font-medium text-primary">
                  Current
                </span>
              )}
            </p>
            <div>
              <h3 className="flex items-center gap-3 text-[21px] font-semibold leading-snug tracking-tight">
                <span className="relative size-7 shrink-0 overflow-hidden rounded-md bg-card ring-1 ring-border">
                  <Image
                    src={job.icon}
                    alt=""
                    fill
                    sizes="28px"
                    className="object-contain p-0.5"
                  />
                </span>
                <span>
                  {job.title.split(" — ")[0]},{" "}
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    {job.company_name.replace(" — Freelance", "")}
                  </a>
                </span>
              </h3>
              <p className="mt-2 max-w-[62ch] text-[17px] leading-relaxed text-muted-foreground">
                {job.summary}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default Experience;
