import { Atkinson_Hyperlegible_Next, Imbue } from "next/font/google";

export const display = Imbue({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-imbue",
  display: "swap",
});

export const text = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
