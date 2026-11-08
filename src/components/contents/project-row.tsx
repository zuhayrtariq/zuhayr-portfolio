import { askAiHref } from "@/constants/site";
import { Project } from "@/types";
import Link from "next/link";

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const ProjectRow = ({
  project,
  headingLevel = "h3",
}: {
  project: Project;
  headingLevel?: "h2" | "h3";
}) => {
  const Heading = headingLevel;

  return (
    <article className="group grid gap-4 border-t border-border py-8 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:gap-10">
      <div>
        <Heading className="text-[28px] font-semibold leading-tight tracking-tight md:text-[34px]">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            {project.title}
          </a>
        </Heading>
        <p className="mt-1.5 text-[15px] text-muted-foreground">
          {project.role ? `${project.role}, ` : ""}
          {hostOf(project.link)}
        </p>
      </div>

      <div>
        <p className="max-w-[62ch] text-[17px] leading-relaxed">
          {project.description}
        </p>
        {project.stack && project.stack.length > 0 && (
          <p className="mt-3 text-[15px] text-muted-foreground">
            <span className="sr-only">Built with </span>
            {project.stack.join(", ")}
          </p>
        )}
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium">
          <li>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              Visit site
            </a>
          </li>
          {project.github && (
            <li>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
              >
                Source code
              </a>
            </li>
          )}
          <li>
            <Link
              href={askAiHref(`Tell me about the ${project.title} project.`)}
              className="link-underline text-primary"
            >
              Ask my AI about it
            </Link>
          </li>
        </ul>
      </div>
    </article>
  );
};

export default ProjectRow;
