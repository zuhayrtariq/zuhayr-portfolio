import { hostOf } from "@/lib/utils";
import { Project } from "@/types";
import Link from "next/link";

const ProjectRow = ({ project }: { project: Project }) => {
  return (
    <article className="grid gap-3 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
      <h2 className="font-display text-[32px] leading-[1.02] font-semibold md:text-[40px]">
        {project.slug ? (
          <Link href={`/work/${project.slug}`} className="transition-colors hover:text-signal">
            {project.title}
          </Link>
        ) : (
          project.title
        )}
      </h2>
      <div>
        <p className="max-w-[60ch] text-body">{project.summary}</p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-ui text-fog">
          {project.slug && (
            <li>
              <Link href={`/work/${project.slug}`} className="link-underline text-caption">
                Case study
              </Link>
            </li>
          )}
          <li>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-underline">
              {hostOf(project.link)}
            </a>
          </li>
          {project.github && (
            <li>
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-underline">
                Source on GitHub
              </a>
            </li>
          )}
        </ul>
      </div>
    </article>
  );
};

export default ProjectRow;
