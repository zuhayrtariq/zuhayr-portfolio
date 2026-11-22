import { Anybody, B612, B612_Mono } from "next/font/google";

/** Headlines. One family with a width axis, so it can be set wide like a livery or narrow like a flap. */
export const display = Anybody({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-anybody",
  display: "swap",
});

/** Body and interface. Drawn for Airbus so cockpit displays stay legible at a glance. */
export const text = B612({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-b612",
  display: "swap",
});

/** The arrivals board and the boarding pass, where every character sits in its own cell. */
export const mono = B612_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-b612-mono",
  display: "swap",
});
