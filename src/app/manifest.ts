import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zuhayr Tariq",
    short_name: "Zuhayr Tariq",
    description: "Zuhayr Tariq builds AI products people can talk to.",
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
