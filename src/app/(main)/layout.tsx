import { Metadata } from "next";
import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";

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

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
