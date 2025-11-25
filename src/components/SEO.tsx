'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'video';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
  alternate?: {
    hreflang: string;
    href: string;
  }[];
  structuredData?: Record<string, unknown>;
}

export function SEO({
  title = 'MMA Balkan — MMA portal za region',
  description = 'MMA portal sa borcima, događajima, vestima i klubovima sa Balkana — sve na jednom mestu.',
  image = '/og-image.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  noindex = false,
  canonical,
  alternate = [],
  structuredData,
}: SEOProps) {
  const router = useRouter();
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3002';
  const fullUrl = url || `${siteUrl}${router.asPath}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const structuredDataScript = structuredData ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  ) : null;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href={canonical || fullUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="MMA Balkan" />
      <meta property="og:locale" content="sr_RS" />

      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@mmabalkan" />
      <meta name="twitter:creator" content="@mmabalkan" />

      {/* Alternate languages */}
      {alternate.map((alt) => (
        <link
          key={alt.hreflang}
          rel="alternate"
          hrefLang={alt.hreflang}
          href={alt.href}
        />
      ))}

      {/* Structured Data */}
      {structuredDataScript}

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#00ff88" />
      <meta name="msapplication-TileColor" content="#00ff88" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="MMA Balkan" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Head>
  );
}

// Predefined SEO configurations for different page types
export const seoConfigs = {
  home: {
    title: 'MMA Balkan — MMA portal za region',
    description: 'MMA portal sa borcima, događajima, vestima i klubovima sa Balkana — sve na jednom mestu.',
    type: 'website' as const,
  },
  fighters: {
    title: 'Borci — MMA Balkan',
    description: 'Pregled svih MMA boraca sa Balkana. Statistike, rezultati, predstojeće borbe i više.',
    type: 'website' as const,
  },
  events: {
    title: 'Događaji — MMA Balkan',
    description: 'Najnoviji MMA događaji i turniri sa Balkana. Rezultati, rasporedi i informacije o borbama.',
    type: 'website' as const,
  },
  news: {
    title: 'Vesti — MMA Balkan',
    description: 'Najnovije vesti iz sveta MMA-a na Balkanu. Analize, intervjui i ekskluzivni sadržaj.',
    type: 'website' as const,
  },
  clubs: {
    title: 'Klubovi — MMA Balkan',
    description: 'Pregled MMA klubova sa Balkana. Lokacije, treneri, programi i kontakt informacije.',
    type: 'website' as const,
  },
};
