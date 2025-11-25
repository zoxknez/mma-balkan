import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3002';
  const allowLocal = /localhost|127\.0\.0\.1/.test(base);
  if (process.env.NODE_ENV === 'production' && !allowLocal && !base.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_SITE_URL mora biti https u produkciji');
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [`${base}/sitemap.xml`],
  };
}
