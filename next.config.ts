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
    // Errors stay, so a failed email or AI call still shows up in the server log.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No other site may put these pages in a frame.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The voice conversation needs the microphone; nothing needs the rest.
          { key: "Permissions-Policy", value: "microphone=(self), camera=(), geolocation=(), payment=(), usb=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [{ source: "/chat", destination: "/talk", permanent: true }];
  },
};

export default nextConfig;
