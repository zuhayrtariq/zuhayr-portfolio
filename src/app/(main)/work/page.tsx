import ProjectsSection from "@/components/sections/projects-section";
import JsonLd from "@/components/site/json-ld";
import { PAGES, pageMetadata } from "@/lib/metadata";
import { projectsSchema } from "@/lib/structured-data";

export const metadata = pageMetadata(PAGES.work);

const WorkPage = () => {
  return (
    <main id="main">
      <JsonLd data={projectsSchema} />
      <ProjectsSection />
    </main>
  );
};

export default WorkPage;
