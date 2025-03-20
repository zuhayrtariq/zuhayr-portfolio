import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      {
        hostname: 'api.microlink.io'
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', '@mantine/core', 'lucide-react'],
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
};

export default nextConfig;