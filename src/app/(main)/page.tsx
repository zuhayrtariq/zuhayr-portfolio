import HomeSection from "@/components/sections/home-section";
import JsonLd from "@/components/site/json-ld";
import { profileSchema } from "@/lib/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const Home = () => {
  return (
    <main id="main">
      <JsonLd data={profileSchema} />
      <HomeSection />
    </main>
  );
};

export default Home;
