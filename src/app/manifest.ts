import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zuhayr Tariq",
    short_name: "Zuhayr",
    description: "Zuhayr Tariq, full-stack web and AI developer. You describe it, I build it, and it goes live on the date we set.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0c0c",
    theme_color: "#0b0c0c",
    // Drawn by scripts/build-avatar.mjs.
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["portfolio", "technology", "developer"],
    lang: "en",
  };
}
