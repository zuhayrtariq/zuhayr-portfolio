import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Lets a local production build run next to `next dev` without sharing .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // TalkingHead loads its lip-sync modules with an unanalyzable dynamic import
  // and only exports its main file, so the English module is aliased in directly.
  webpack(config) {
    config.resolve.alias["talkinghead-lipsync-en"] = path.resolve(
      "node_modules/@met4citizen/talkinghead/modules/lipsync-en.mjs"
    );
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["three"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2560],
    qualities: [40, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "simple-icons"],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/chat", destination: "/talk", permanent: true }];
  },
};

export default nextConfig;
