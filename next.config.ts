import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    // Ensure server output trace ignores backend tree
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Exclude backend folder from page file watching/build
  webpack: (config) => {
    config.ignoreWarnings = config.ignoreWarnings || [];
    // Don't attempt to bundle backend
    config.externals = config.externals || [];
    return config;
  },
};

export default nextConfig;
