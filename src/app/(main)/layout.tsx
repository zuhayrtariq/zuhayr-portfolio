import "@/styles/globals.css";
import "@mantine/core/styles.css";
import { Metadata } from "next";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { SparklesCore } from "@/components/ui/sparkles";
import { Navbar } from "@/components";
export const metadata: Metadata = {
  title: "Zuhayr Tariq",
  description:
    "This is my portfolio website. My name is Zuhayr Tariq and I am a Fullstack Web Developer.",
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
