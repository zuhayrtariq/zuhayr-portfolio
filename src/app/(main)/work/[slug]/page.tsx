import CaseStudy from "@/components/sections/case-study";
import JsonLd from "@/components/site/json-ld";
import { caseStudies, getProject } from "@/constants/projects";
import { caseStudyMetadata } from "@/lib/metadata";
import { caseStudySchema } from "@/lib/structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug! }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return caseStudyMetadata((await params).slug, true);
}

export default async function CaseStudyPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <main id="main" className="animate-[page-in_300ms_var(--ease-lights)]">
      <JsonLd data={caseStudySchema(project)} />
      <CaseStudy project={project} />
    </main>
  );
}
