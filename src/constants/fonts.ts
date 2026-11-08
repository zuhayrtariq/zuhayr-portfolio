import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

export const heading = Bricolage_Grotesque({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
});

export const base = Instrument_Sans({
    subsets: ["latin"],
    variable: "--font-base",
    display: "swap",
});
