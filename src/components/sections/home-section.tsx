import React from "react";
import Wrapper from "../utils/wrapper";
import Hero from "../contents/hero";
import AboutMe from "../contents/about-me";
import Projects from "../contents/projects";
import Experience from "../contents/experience";
import MySkills from "../contents/my-skills";
import Contact from "../contents/contact";

const HomeSection = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      <Wrapper className="lg:max-w-screen-lg">
        <Hero />
      </Wrapper>
      <Wrapper>
        <AboutMe />
      </Wrapper>
      <Wrapper>
        <Experience />
      </Wrapper>
      <Wrapper>
        <Projects />
      </Wrapper>
      <Wrapper>
        <MySkills />
      </Wrapper>
      <Wrapper>
        <Contact />
      </Wrapper>
    </div>
  );
};

export default HomeSection;
