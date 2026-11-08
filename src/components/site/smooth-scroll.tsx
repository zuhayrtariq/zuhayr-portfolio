"use client";

import Lenis from "lenis";
import { useEffect } from "react";

const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -80 },
      lerp: 0.12,
    });
    return () => lenis.destroy();
  }, []);

  return null;
};

export default SmoothScroll;
