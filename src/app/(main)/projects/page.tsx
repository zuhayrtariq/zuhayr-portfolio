import ProjectsSection from "@/components/sections/projects-section";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Full-stack and AI projects",
  description:
    "Everything Zuhayr Tariq has built, from the enterprise AI platform he leads to AI agents, voice apps, analytics dashboards, ticketing and e-commerce.",
  path: "/projects",
});

const ProjectsPage = () => {
  return (
    <main id="main">
      <ProjectsSection />
    </main>
  );
};

export default ProjectsPage;
