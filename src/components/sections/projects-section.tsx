import ProjectCards from "../contents/project-cards";
import AnimationContainer from "../utils/animation-container";
import Heading from "../utils/heading";
import Wrapper from "../utils/wrapper";

const ProjectSection = () => {
  return (
    <Wrapper>
      <div className="flex flex-col items-start w-full mt-0 lg:mt-8">
        <Heading title="Projects" />

        <AnimationContainer className="w-full flex flex-col gap-5 mb-8">
          <p className="text-base text-justify lg:leading-8 text-foreground/80">
            Here are some of the projects I've built, highlighting my skills in
            problem-solving and innovative solutions. These showcase my passion
            for technology and continuous learning. Client projects cannot be
            shared due to confidentiality.
          </p>
        </AnimationContainer>

        <ProjectCards />
      </div>
    </Wrapper>
  );
};

export default ProjectSection;
