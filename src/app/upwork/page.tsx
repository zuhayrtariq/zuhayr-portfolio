import HomeSection from "@/components/sections/home-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function UpworkHome() {
  return (
    <main id="main">
      <HomeSection audience="upwork" />
    </main>
  );
}
