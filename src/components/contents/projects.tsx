import { featuredProjects, projects } from "@/constants/projects";
import { hostOf } from "@/lib/utils";
import Link from "next/link";
import Footage from "../site/footage";
import Section from "../site/section";

const Projects = () => {
  return (
    <Section id="work" question="What have you shipped?">
      <ol className="space-y-24 md:space-y-36">
        {featuredProjects.map((project) => {
          const meta = [project.role, project.year].filter(Boolean).join(", ");
          const caseStudy = `/work/${project.slug}`;
          return (
            <li key={project.title}>
              <article aria-labelledby={`work-${project.slug}`}>
                {project.image && (
                  <Link href={caseStudy} tabIndex={-1} aria-hidden className="block">
                    <Footage src={project.image} alt="" />
                  </Link>
                )}
                <div className="mt-7 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3
                    id={`work-${project.slug}`}
                    className="font-display text-[44px] leading-none font-semibold md:text-[64px]"
                  >
                    {project.title}
                  </h3>
                  {meta && <p className="text-ui text-fog">{meta}</p>}
                </div>
                <p className="mt-4 max-w-[60ch] text-body">{project.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-ui font-bold">
                  <li>
                    <Link href={caseStudy} className="link-underline">
                      Read the case study
                    </Link>
                  </li>
                  <li>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-underline">
                      Visit {hostOf(project.link)}
                    </a>
                  </li>
                </ul>
              </article>
            </li>
          );
        })}
      </ol>

      <p className="mt-24 text-body text-fog md:mt-32">
        That&apos;s the recent, public work. There are {projects.length - featuredProjects.length} more
        projects in the{" "}
        <Link href="/projects" className="link-underline text-caption">
          full archive
        </Link>
        .
      </p>
    </Section>
  );
};

export default Projects;
