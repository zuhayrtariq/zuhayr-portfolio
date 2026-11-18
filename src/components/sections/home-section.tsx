import Hero from "../contents/hero";
import AboutMe from "../contents/about-me";
import Projects from "../contents/projects";
import Experience from "../contents/experience";
import MySkills from "../contents/my-skills";
import Contact from "../contents/contact";

const HomeSection = () => {
  return (
    <>
      <Hero />
      <Projects />
      <AboutMe />
      <Experience />
      <MySkills />
      <Contact />
    </>
  );
};

export default HomeSection;
