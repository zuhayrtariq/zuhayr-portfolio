import { projects } from "@/constants/projects";
import ProjectCards from "../contents/project-cards";

const ProjectSection = () => {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 md:px-8 md:pt-24">
      <header className="max-w-3xl">
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[64px]">
          Projects
        </h1>
        <p className="mt-5 text-[19px] leading-relaxed text-muted-foreground">
          {projects.length} things I&apos;ve built, from the AI platform I lead
          today to early React experiments. Most client work is under NDA, so
          what&apos;s here is public products and personal projects.
        </p>
      </header>
      <div className="mt-16">
        <ProjectCards />
      </div>
    </div>
  );
};

export default ProjectSection;
