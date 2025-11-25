import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const isTurbopack = process.env.TURBOPACK === '1';
const isProd = process.env.NODE_ENV === 'production';

// Bundle analyzer setup
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Production optimizations
  output: 'standalone', // Enables self-contained output for custom hosting
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mma-balkan.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.mma-balkan.org',
      },
      // Add more trusted domains as needed
    ],
    // Allowed domains (deprecated but for backwards compat)
    domains: [],
  },

  // ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Experimental features
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
    ],
    // Enable PPR (Partial Prerendering) for Next 15
    ppr: false, // Enable when ready
  },

  // Webpack optimizations
  webpack: isTurbopack ? undefined : (config) => {
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.externals = config.externals || [];

    // Production optimizations
    if (isProd) {
      // Tree shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };

      // Module concatenation
      config.optimization.concatenateModules = true;
    }

    // Handle binary modules
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    return config;
  },

  // API rewrites for development
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:3003/api/:path*',
        },
        {
          source: '/api/activity/:path*',
          destination: 'http://127.0.0.1:3003/api/activity/:path*',
        },
      ];
    }
    return [];
  },

  // Security and performance headers
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // HSTS in production only
          ...(isProduction ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          }] : []),
          // CORS headers
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache Next.js generated static files
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache optimized images
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache PWA files
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, must-revalidate',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      // Cache fonts
      {
        source: '/:path*.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [];
  },
};

export default withBundleAnalyzer(nextConfig);
