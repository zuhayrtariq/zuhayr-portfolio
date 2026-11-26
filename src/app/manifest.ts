import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zuhayr Tariq",
    short_name: "Zuhayr",
    description: "Zuhayr Tariq, full-stack web and AI developer. A prompt gets you a demo. I ship the product.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c3a2a",
    theme_color: "#0c7450",
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
