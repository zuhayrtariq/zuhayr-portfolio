import { projects } from "@/constants/projects";
import ProjectRow from "./project-row";

const ProjectCards = () => {
  return (
    <div>
      {projects.map((project) => (
        <ProjectRow key={project.title} project={project} headingLevel="h2" />
      ))}
    </div>
  );
};

export default ProjectCards;
