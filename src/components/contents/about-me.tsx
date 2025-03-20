import AnimationContainer from "../utils/animation-container";

const AboutMe = () => {
  return (
    <div className="w-full relative pt-10 pb-20 z-40">
      <AnimationContainer
        animation="slide-up"
        className="flex items-center justify-center overflow-hidden w-full mx-auto"
      >
        <div className="w-full">
          <h2 className="text-2xl lg:text-3xl font-medium text-left w-full">
            About Me
          </h2>
        </div>
      </AnimationContainer>
      <AnimationContainer
        animation="slide-up"
        className="flex items-center justify-center overflow-hidden w-full mx-auto pt-10"
      >
        <div className="w-full flex items-center justify-center">
          <p className="text-base md:text-lg text-justify w-full">
            I'm a skilled software developer with experience in TypeScript and
            JavaScript, and expertise in frameworks like NextJS, React, NodeJS,
            and ThreeJS. I specialize in building high-quality, responsive web
            applications and scalable back-end solutions. With a strong
            foundation in both front-end and back-end development, I’m a quick
            learner and always stay up-to-date with the latest industry trends
            and technologies. I collaborate closely with clients to understand
            their needs and deliver efficient, user-friendly solutions that
            solve real-world problems. My focus is on creating seamless
            experiences and ensuring optimal performance, no matter the project
            size. Let’s work together to turn your ideas into innovative,
            functional products!
          </p>
        </div>
      </AnimationContainer>
    </div>
  );
};

export default AboutMe;
