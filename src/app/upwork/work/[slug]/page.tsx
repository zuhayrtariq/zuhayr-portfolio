import CaseStudy from "@/components/sections/case-study";
import { caseStudies, getProject } from "@/constants/projects";
import { caseStudyMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug! }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return caseStudyMetadata((await params).slug, false);
}

export default async function UpworkCaseStudyPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <main id="main" className="animate-[page-in_300ms_var(--ease-lights)]">
      <CaseStudy project={project} audience="upwork" />
    </main>
  );
}
