import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zuhayr Tariq",
    short_name: "Zuhayr Tariq",
    description: "Zuhayr Tariq, full-stack web and AI developer. I take products from idea to launch, on time.",
    start_url: "/",
    display: "standalone",
    background_color: "#1d2a2c",
    theme_color: "#1d2a2c",
    icons: [
      {
        src: "/icons/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    categories: ["portfolio", "technology", "developer"],
    lang: "en",
  };
}
