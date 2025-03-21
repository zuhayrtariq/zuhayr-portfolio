import React from "react";
import { AnimatedGrid } from "../ui/animated-grid";

const GradientBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full relative min-h-screen ">
      <div className="aspect-square size-[280px] lg:size-[565px] absolute left-1/2 -translate-x-1/2 top-0 lg:top-[-200px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(98,98,115,0.8)_0%,rgba(98,98,115,0)_100%)] rounded-full blur-[4rem] lg:blur-[14rem] z-10"></div>

      {children}
    </div>
  );
};

export default GradientBackground;
