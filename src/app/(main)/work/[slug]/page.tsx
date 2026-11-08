import Footage from "@/components/site/footage";
import { askAiHref } from "@/constants/site";
import { caseStudies, getProject } from "@/constants/projects";
import { stackName } from "@/lib/stack";
import { hostOf } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug! }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
  };
}

const listFormat = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = caseStudies.findIndex((p) => p.slug === slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const meta = [project.role, project.year].filter(Boolean).join(", ");
  const description = project.description.replace(/\s+/g, " ").trim();
  const stack = listFormat.format([...new Set((project.stack ?? []).map(stackName))]);

  return (
    <main id="main" className="animate-[page-in_300ms_var(--ease-lights)]">
      <article className="mx-auto max-w-[1440px] px-[clamp(20px,4vw,64px)] pb-24 pt-36 md:pb-40 md:pt-48">
        <header className="grid gap-8 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-8">
            <p className="text-ui text-fog">
              <Link href="/#work" className="link-underline">
                Work
              </Link>
            </p>
            <h1 className="mt-4 font-display text-[clamp(64px,10vw,168px)] leading-[0.88] font-semibold">
              {project.title}
            </h1>
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
            <h2 id="what" className="font-display text-q-sm leading-[1.02] font-semibold md:text-q">
              What is it?
            </h2>
            <p className="mt-6 max-w-[60ch] text-body text-fog">{description}</p>
          </section>

          <section aria-labelledby="built-with" className="md:col-span-4 md:col-start-9">
            <h2 id="built-with" className="font-display text-q-sm leading-[1.02] font-semibold md:text-q">
              Built with
            </h2>
            <p className="mt-6 text-body text-fog">{stack}.</p>
            <ul className="mt-10 space-y-3 text-ui font-bold">
              <li>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-underline">
                  Visit {hostOf(project.link)}
                </a>
              </li>
              {project.github && (
                <li>
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-underline">
                    Read the source on GitHub
                  </a>
                </li>
              )}
              <li>
                <Link href={askAiHref(`Tell me about the ${project.title} project.`)} className="link-underline">
                  Ask my AI about {project.title}
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </article>

      <nav aria-label="Next case study" className="bg-umbra">
        <Link
          href={`/work/${next.slug}`}
          className="group mx-auto block max-w-[1440px] px-[clamp(20px,4vw,64px)] py-20 md:py-28"
        >
          <span className="text-ui text-fog">Next case study</span>
          <span className="mt-3 block font-display text-[clamp(56px,8vw,128px)] leading-[0.9] font-semibold transition-colors group-hover:text-signal">
            {next.title}
          </span>
        </Link>
      </nav>
    </main>
  );
}
