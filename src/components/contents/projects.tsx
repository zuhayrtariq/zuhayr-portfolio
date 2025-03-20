"use client";
import { projects } from "@/constants/projects";
import { Project as ProjectProps } from "@/types";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import AnimationContainer from "../utils/animation-container";
import Project from "../utils/project";
import { MagicCard } from "../ui/magic-card";

const Projects = () => {
  return (
    <div className="w-full relative pb-20 py-10 z-40">
      <AnimationContainer
        animation="slide-up"
        delay={0.1}
        className="flex items-center justify-center overflow-hidden w-full mx-auto"
      >
        <div className="w-full">
          <h2 className="text-2xl lg:text-3xl font-medium text-left w-full">
            Featured Projects
          </h2>
        </div>
      </AnimationContainer>

      <AnimationContainer
        animation="slide-up"
        delay={0.2}
        className="flex flex-col items-center justify-center gap-10 w-full mx-auto pt-10 relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
          className="bg-blue-500/10 hidden lg:block -z-10 w-[30rem] left-[-5rem] bottom-[8rem] absolute h-[18rem] blur-[10rem] rounded-full"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 w-full">
          {projects.length &&
            projects.slice(0, 4).map((project: ProjectProps, index) => (
              <AnimationContainer key={project.title} delay={0.2 * index + 0.1}>
                <MagicCard
                  className="p-2"
                  gradientSize={100}
                  gradientFrom="rgba(14,165,233,1)"
                  gradientTo="rgba(59,130,246,1)"
                >
                  <Project project={project} />
                </MagicCard>
              </AnimationContainer>
            ))}
        </div>
      </AnimationContainer>

      <AnimationContainer animation="slide-up" delay={0.2} className="mt-6">
        <Link href="/projects">
          <Button variant="secondary" size="sm">
            View more
            <ArrowRightIcon className="size-4 ml-1.5" />
          </Button>
        </Link>
      </AnimationContainer>
    </div>
  );
};

export default Projects;
