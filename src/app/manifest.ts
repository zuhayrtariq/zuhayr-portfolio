import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zuhayr Tariq - Portfolio",
    short_name: "Zuhayr Tariq",
    description:
      "Top Rated Full Stack Web Developer specializing in Next.js, React, Node.js, and AI-powered applications.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    categories: ["portfolio", "technology", "developer"],
    lang: "en",
    orientation: "portrait-primary",
  };
}
