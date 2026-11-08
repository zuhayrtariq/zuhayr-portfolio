"use client";

import { setLenis } from "@/lib/lenis";
import Lenis from "lenis";
import { useLayoutEffect } from "react";

const SmoothScroll = () => {
  // A layout effect, so Lenis exists before the hero's GSAP setup (also a layout effect) runs.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -80 },
      lerp: 0.12,
    });
    setLenis(lenis);
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
