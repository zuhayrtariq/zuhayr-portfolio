import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    optimizePackageImports: ["lucide-react", "motion"],
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
