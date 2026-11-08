import { projects } from "@/constants/projects";
import ProjectRow from "../contents/project-row";

const ProjectsSection = () => {
  return (
    <div className="mx-auto max-w-[1440px] px-[clamp(20px,4vw,64px)] pb-32 pt-36 md:pt-48">
      <header className="max-w-3xl">
        <h1 className="font-display text-[clamp(56px,8vw,128px)] leading-[0.92] font-semibold">
          Everything I&apos;ve built
        </h1>
        <p className="mt-6 max-w-[56ch] text-lead leading-snug text-fog">
          {projects.length} projects, from the AI platform I lead today to my first React apps. Most
          client work is under NDA, so these are public products and personal projects.
        </p>
      </header>
      <ul className="mt-20 space-y-16 md:mt-28 md:space-y-20">
        {projects.map((project) => (
          <li key={project.title}>
            <ProjectRow project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsSection;
