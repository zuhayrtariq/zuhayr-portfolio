import { Recursive } from "next/font/google";

/**
 * The whole site is set in one family. Recursive was drawn for code and for interfaces, and
 * it is one variable font with an axis from proportional to monospaced (MONO) and an axis
 * from ruled to hand-drawn (CASL). The styles use those axes as voices: what a tool writes
 * is monospaced and ruled, what Zuhayr says is proportional and drawn by hand.
 */
export const recursive = Recursive({
  subsets: ["latin"],
  axes: ["CASL", "CRSV", "MONO", "slnt"],
  variable: "--font-recursive",
  display: "swap",
});
