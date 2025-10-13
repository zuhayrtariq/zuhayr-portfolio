import "@/styles/globals.css";
import "@mantine/core/styles.css";
import { Metadata } from "next";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { SparklesCore } from "@/components/ui/sparkles";
import { Navbar } from "@/components";
export const metadata: Metadata = {
  title: "Zuhayr Tariq - Portfolio & Projects",
  description:
    "Explore Zuhayr Tariq's portfolio showcasing full-stack web development projects including AI-powered applications, e-commerce platforms, and modern web technologies. Top rated freelance developer available for hire.",
  keywords: [
    "Zuhayr Tariq Portfolio",
    "Zuhayr Projects",
    "Full Stack Developer Portfolio",
    "Web Development Projects",
    "Next.js Projects",
    "React Projects",
    "AI Applications",
    "E-commerce Development",
    "Freelance Developer Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TracingBeam className="px-6">
      <div className="w-full absolute inset-0 min-h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={0.8}
          particleDensity={15}
          speed={1}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <Navbar />
      {children}
    </TracingBeam>
  );
}
