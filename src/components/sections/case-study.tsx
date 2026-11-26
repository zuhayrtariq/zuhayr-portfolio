import { SiteLink } from "@/components/site/audience";
import Footage from "@/components/site/footage";
import { caseStudies } from "@/constants/projects";
import { askAiHref } from "@/constants/site";
import type { Audience } from "@/lib/audience";
import { stackName } from "@/lib/stack";
import { hostOf } from "@/lib/utils";
import type { Project } from "@/types";

const listFormat = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

/** One product: what it is, what it was built with, and where to see it running. */
const CaseStudy = ({ project, audience = "direct" }: { project: Project; audience?: Audience }) => {
  const index = caseStudies.findIndex((p) => p.slug === project.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const meta = [project.role, project.year].filter(Boolean).join(", ");
  const description = project.description.replace(/\s+/g, " ").trim();
  const stack = listFormat.format([...new Set((project.stack ?? []).map(stackName))]);

  return (
    <>
      <article className="mx-auto max-w-[1440px] px-[clamp(20px,4vw,64px)] pb-24 pt-36 md:pb-40 md:pt-48">
        <header className="grid gap-8 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-8">
            <p className="text-ui text-fog">
              <SiteLink href="/work" className="link-underline">
                Work
              </SiteLink>
            </p>
            <h1 className="mt-4 text-[clamp(36px,5.6vw,96px)]">{project.title}</h1>
          </div>
          <div className="self-end md:col-span-4">
            <p className="text-lead leading-snug">{project.summary}</p>
            {meta && <p className="mt-4 text-ui text-fog">{meta}</p>}
          </div>
        </header>

        {project.image && (
          <Footage
            src={project.image}
            alt={`The ${project.title} website`}
            priority
            sizes="(min-width: 1440px) 1312px, 100vw"
            className="mt-16 md:mt-24"
          />
        )}

        <div className="mt-20 grid gap-16 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <section aria-labelledby="what" className="md:col-span-7">
            <h2 id="what" className="text-q-sm md:text-q">
              What is it?
            </h2>
            <p className="mt-6 max-w-[60ch] text-body text-fog">{description}</p>
          </section>

          <section aria-labelledby="built-with" className="md:col-span-4 md:col-start-9">
            <h2 id="built-with" className="text-q-sm md:text-q">
              Built with
            </h2>
            <p className="mt-6 text-body text-fog">{stack}.</p>
            <ul className="mt-10 space-y-3 text-ui font-bold">
              <li>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-underline">
                  Visit {hostOf(project.link)}
                </a>
              </li>
              {/* His GitHub account is a way to reach him, so a client from Upwork is not sent to it. */}
              {project.github && audience === "direct" && (
                <li>
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-underline">
                    Read the source on GitHub
                  </a>
                </li>
              )}
              <li>
                <SiteLink href={askAiHref(`Tell me about the ${project.title} project.`)} className="link-underline">
                  Ask my AI about {project.title}
                </SiteLink>
              </li>
            </ul>
          </section>
        </div>
      </article>

      <nav aria-label="Next case study" className="bg-umbra">
        <SiteLink
          href={`/work/${next.slug}`}
          className="group mx-auto block max-w-[1440px] px-[clamp(20px,4vw,64px)] py-20 md:py-28"
        >
          <span className="text-ui text-fog">Next case study</span>
          <span className="mt-3 block font-display text-[clamp(34px,5vw,84px)] font-extrabold leading-[0.96] tracking-[-0.025em] transition-colors group-hover:text-signal">
            {next.title}
          </span>
        </SiteLink>
      </nav>
    </>
  );
};

export default CaseStudy;
