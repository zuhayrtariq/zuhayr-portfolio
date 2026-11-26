import { SiteLink } from "@/components/site/audience";
import type { Audience } from "@/lib/audience";
import { hostOf } from "@/lib/utils";
import { Project } from "@/types";

const ProjectRow = ({ project, audience = "direct" }: { project: Project; audience?: Audience }) => {
  return (
    <article className="grid gap-3 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
      <h3 className="text-[24px] md:text-[30px]">
        {project.slug ? (
          <SiteLink href={`/work/${project.slug}`} className="transition-colors hover:text-signal">
            {project.title}
          </SiteLink>
        ) : (
          project.title
        )}
      </h3>
      <div>
        <p className="max-w-[60ch] text-body">{project.summary}</p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-ui text-fog">
          {project.slug && (
            <li>
              <SiteLink href={`/work/${project.slug}`} className="link-underline text-caption">
                Case study
              </SiteLink>
            </li>
          )}
          <li>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-underline">
              {hostOf(project.link)}
            </a>
          </li>
          {/* His GitHub account is a way to reach him, so a client from Upwork is not sent to it. */}
          {project.github && audience === "direct" && (
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
