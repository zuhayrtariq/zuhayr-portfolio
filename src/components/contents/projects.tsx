import { projects } from "@/constants/projects";
import Link from "next/link";
import Section from "../site/section";
import ProjectRow from "./project-row";

const Projects = () => {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <Section
      id="projects"
      title="Selected projects"
      intro="AI platforms and products I've led or built end to end."
    >
      <div>
        {featured.map((project) => (
          <ProjectRow key={project.title} project={project} />
        ))}
      </div>
      <Link
        href="/projects"
        className="mt-10 inline-flex h-12 items-center rounded-full border border-foreground/20 px-6 text-[16px] font-medium transition-colors hover:border-foreground"
      >
        See all {projects.length} projects
      </Link>
    </Section>
  );
};

export default Projects;
