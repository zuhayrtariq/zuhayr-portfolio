import Hero from "../contents/hero";
import AboutMe from "../contents/about-me";
import Projects from "../contents/projects";
import Experience from "../contents/experience";
import MySkills from "../contents/my-skills";
import Contact from "../contents/contact";
import Draft from "../contents/draft";
import Faq from "../contents/faq";

const HomeSection = () => {
  return (
    <>
      <Hero />
      <Draft />
      <Projects />
      <AboutMe />
      <Experience />
      <MySkills />
      <Faq />
      <Contact />
    </>
  );
};

export default HomeSection;
