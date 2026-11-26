import { SiteLink } from "@/components/site/audience";
import BrowserFrame from "@/components/ui/browser-frame";
import Sign from "@/components/ui/sign";
import { featuredProjects, projects } from "@/constants/projects";
import type { Audience } from "@/lib/audience";
import { hostOf } from "@/lib/utils";
import Image from "next/image";
import type { CSSProperties } from "react";
import ProjectRow from "../contents/project-row";

const archive = projects.filter((project) => !project.featured);

/**
 * All of the work: the live products first, each in a browser window, then everything
 * earlier as a plain list.
 */
const ProjectsSection = ({ audience = "direct" }: { audience?: Audience }) => {
  return (
    <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pb-32 pt-36 md:pt-48">
      <header className="max-w-3xl">
        <h1 className="text-[clamp(36px,5.4vw,92px)]">Everything I&apos;ve built</h1>
        <p className="mt-6 max-w-[56ch] text-lead leading-snug text-fog">
          {projects.length} projects, from the AI platform I lead today to my first React apps. Most client work is
          under NDA, so these are public products and personal projects.
        </p>
      </header>

      <ul className="mt-20 space-y-20 md:mt-28 md:space-y-28">
        {featuredProjects.map((project, i) => (
          <li key={project.slug}>
            <article
              style={{ "--accent": project.accent ?? "#1838dc" } as CSSProperties}
              className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center"
            >
              <div className="max-lg:order-last">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fine text-fog">
                  <span aria-hidden className="size-2.5 rounded-full bg-(--accent)" />
                  {project.kind}
                  {project.role && (
                    <span>
                      {project.role}, {project.year}
                    </span>
                  )}
                </p>
                <h2 className="mt-4 text-[clamp(32px,4vw,66px)]">
                  <SiteLink href={`/work/${project.slug}`} className="transition-colors hover:text-signal">
                    {project.title}
                  </SiteLink>
                </h2>
                <p className="mt-4 max-w-[48ch] text-body text-fog">{project.summary}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <Sign href={`/work/${project.slug}`} tone="night">
                    Read the case study
                  </Sign>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-underline text-ui font-bold">
                    Open {hostOf(project.link)}
                  </a>
                </div>
              </div>

              {project.image && (
                <SiteLink href={`/work/${project.slug}`} tabIndex={-1} aria-hidden className="block">
                  <BrowserFrame host={hostOf(project.link)}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-night">
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="(min-width: 1024px) 56vw, 100vw"
                        className="object-cover object-top"
                      />
                    </div>
                  </BrowserFrame>
                </SiteLink>
              )}
            </article>
          </li>
        ))}
      </ul>

      <section aria-labelledby="archive-title" className="mt-28 border-t pt-16 md:mt-40 md:pt-24">
        <h2 id="archive-title" className="text-[clamp(30px,3.4vw,56px)]">
          The archive
        </h2>
        <p className="mt-5 max-w-[56ch] text-body text-fog">
          A client site, an internal tool, and the personal projects I learned on.
        </p>
        <ul className="mt-14 space-y-14 md:mt-16 md:space-y-16">
          {archive.map((project) => (
            <li key={project.title}>
              <ProjectRow project={project} audience={audience} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ProjectsSection;
