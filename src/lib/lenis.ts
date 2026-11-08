import type Lenis from "lenis";

let instance: Lenis | null = null;

/** The page's smooth-scroll instance, or null when reduced motion keeps native scroll. */
export const getLenis = () => instance;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};
