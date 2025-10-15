import type { NextConfig } from "next";

const isTurbopack = process.env.TURBOPACK === '1';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Webpack hook koristi se samo kada nije Turbopack, da ne trigeruje upozorenje
  webpack: isTurbopack ? undefined : (config) => {
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.externals = config.externals || [];
    return config;
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        // Ako backend koristi drugi port (automatski bump), pokušaj redirekciju na 3003; ako nije dostupan, klijent će fallback na polling
        { source: '/api/:path*', destination: 'http://127.0.0.1:3003/api/:path*' },
        { source: '/api/activity/:path*', destination: 'http://127.0.0.1:3003/api/activity/:path*' },
      ];
    }
    return [];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};

export default nextConfig;
