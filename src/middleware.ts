import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Security Headers
 * Executed on ALL requests before reaching pages
 */
export function middleware(request: NextRequest) {
  // Generate nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // Content Security Policy with nonces
  const cspHeader = generateCSP(nonce);
  
  // Clone request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  
  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Security Headers
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // HSTS (HTTP Strict Transport Security)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Additional Security Headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  
  // Cross-Origin Policies
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  
  // Remove powered-by header
  response.headers.delete('X-Powered-By');
  
  return response;
}

/**
 * Generate Content Security Policy
 * Uses nonces for inline scripts and styles
 */
function generateCSP(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  
  const csp = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isDev ? ["'unsafe-eval'"] : []), // Only in development for HMR
      'https://challenges.cloudflare.com', // Cloudflare Turnstile
      'https://va.vercel-scripts.com', // Vercel Analytics
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Needed for Tailwind and Framer Motion
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://*.mma-balkan.org',
    ],
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    'connect-src': [
      "'self'",
      process.env['NEXT_PUBLIC_API_URL'] || '',
      process.env['NEXT_PUBLIC_SOCKET_URL'] || '',
      'https://*.sentry.io', // Sentry error reporting
      'https://vitals.vercel-insights.com', // Vercel Analytics
      ...(isDev ? ['ws://localhost:*', 'http://localhost:*'] : []),
    ].filter(Boolean),
    'media-src': ["'self'", 'blob:', 'https:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    'frame-src': ["'self'", 'https://challenges.cloudflare.com'],
    'manifest-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
    'child-src': ["'self'", 'blob:'],
    ...(isDev ? {} : { 'upgrade-insecure-requests': [] }),
  };

  // Build CSP string
  return Object.entries(csp)
    .map(([key, values]) => {
      if (Array.isArray(values) && values.length === 0) {
        return key;
      }
      return `${key} ${Array.isArray(values) ? values.join(' ') : values}`;
    })
    .join('; ');
}

// Configure middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (public files)
     * - sw.js, manifest.json (PWA files)
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw.js|manifest.json|icons/).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

