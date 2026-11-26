import ProjectsSection from "@/components/sections/projects-section";
import { PAGES, pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(PAGES.work);

export default function UpworkWorkPage() {
  return (
    <main id="main">
      <ProjectsSection audience="upwork" />
    </main>
  );
}
