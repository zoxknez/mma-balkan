'use client';

import { Metadata } from 'next';

// SEO configuration
export const seoConfig = {
  siteName: 'MMA Balkan',
  siteUrl: 'https://mmabalkan.com',
  defaultTitle: 'MMA Balkan - Prva MMA platforma na Balkanu',
  defaultDescription: 'Kompletna baza MMA boraca, događaja i klubova sa Balkana. Praćenje performansi, statistike i analize u realnom vremenu.',
  defaultKeywords: 'MMA, Balkan, borci, događaji, klubovi, statistike, analize',
  author: 'MMA Balkan Team',
  twitterHandle: '@mmabalkan',
  ogImage: '/og-image.jpg',
  favicon: '/favicon.ico',
} as const;

// Generate structured data for fighters
export function generateFighterStructuredData(fighter: {
  id: string;
  name: string;
  weightClass: string;
  record: string;
  nationality: string;
  image?: string;
  description?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${seoConfig.siteUrl}/fighters/${fighter.id}`,
    name: fighter.name,
    description: fighter.description || `${fighter.name} - MMA borac iz ${fighter.nationality}`,
    image: fighter.image ? `${seoConfig.siteUrl}${fighter.image}` : undefined,
    jobTitle: 'MMA Fighter',
    worksFor: {
      '@type': 'Organization',
      name: 'MMA Balkan'
    },
    knowsAbout: ['Mixed Martial Arts', 'Combat Sports', fighter.weightClass],
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Weight Class',
        value: fighter.weightClass
      },
      {
        '@type': 'PropertyValue',
        name: 'Record',
        value: fighter.record
      },
      {
        '@type': 'PropertyValue',
        name: 'Nationality',
        value: fighter.nationality
      }
    ]
  };
}

// Generate structured data for events
export function generateEventStructuredData(event: {
  id: string;
  name: string;
  date: string;
  location: string;
  description?: string;
  image?: string;
  fighters?: Array<{ name: string; id: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    '@id': `${seoConfig.siteUrl}/events/${event.id}`,
    name: event.name,
    description: event.description || `MMA događaj: ${event.name}`,
    startDate: event.date,
    location: {
      '@type': 'Place',
      name: event.location
    },
    image: event.image ? `${seoConfig.siteUrl}${event.image}` : undefined,
    organizer: {
      '@type': 'Organization',
      name: 'MMA Balkan'
    },
    sport: 'Mixed Martial Arts',
    ...(event.fighters && {
      participant: event.fighters.map(fighter => ({
        '@type': 'Person',
        name: fighter.name,
        '@id': `${seoConfig.siteUrl}/fighters/${fighter.id}`
      }))
    })
  };
}

// Generate structured data for clubs
export function generateClubStructuredData(club: {
  id: string;
  name: string;
  location: string;
  description?: string;
  image?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    '@id': `${seoConfig.siteUrl}/clubs/${club.id}`,
    name: club.name,
    description: club.description || `MMA klub: ${club.name}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: club.location
    },
    image: club.image ? `${seoConfig.siteUrl}${club.image}` : undefined,
    ...(club.contactInfo && {
      telephone: club.contactInfo.phone,
      email: club.contactInfo.email,
      url: club.contactInfo.website
    }),
    sport: 'Mixed Martial Arts'
  };
}

// Generate structured data for news
export function generateNewsStructuredData(news: {
  id: string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: string;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${seoConfig.siteUrl}/news/${news.id}`,
    headline: news.headline,
    description: news.description,
    image: news.image ? [`${seoConfig.siteUrl}${news.image}`] : undefined,
    datePublished: news.datePublished,
    dateModified: news.dateModified,
    author: {
      '@type': 'Person',
      name: news.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'MMA Balkan',
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.png`
      }
    },
    articleSection: news.category
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{
  name: string;
  url: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${seoConfig.siteUrl}${item.url}`
    }))
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{
  question: string;
  answer: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${seoConfig.siteUrl}/#organization`,
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/logo.png`,
    description: seoConfig.defaultDescription,
    sameAs: [
      `https://twitter.com/${seoConfig.twitterHandle}`,
      'https://www.facebook.com/mmabalkan',
      'https://www.instagram.com/mmabalkan'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+381-11-123-4567',
      contactType: 'customer service',
      availableLanguage: ['Serbian', 'English']
    }
  };
}

// Generate website structured data
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${seoConfig.siteUrl}/#website`,
    url: seoConfig.siteUrl,
    name: seoConfig.siteName,
    description: seoConfig.defaultDescription,
    publisher: {
      '@id': `${seoConfig.siteUrl}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// Generate metadata for pages
export function generatePageMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  structuredData
}: {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  structuredData?: Record<string, unknown>;
}): Metadata {
  const fullTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle;
  const fullDescription = description || seoConfig.defaultDescription;
  const fullImage = image ? `${seoConfig.siteUrl}${image}` : `${seoConfig.siteUrl}${seoConfig.ogImage}`;
  const fullUrl = url ? `${seoConfig.siteUrl}${url}` : seoConfig.siteUrl;

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords || seoConfig.defaultKeywords,
    authors: authors ? authors.map(name => ({ name })) : [{ name: seoConfig.author }],
    creator: seoConfig.author,
    publisher: seoConfig.siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'sr_RS',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: seoConfig.twitterHandle,
      site: seoConfig.twitterHandle,
    },
    alternates: {
      canonical: fullUrl,
    },
    other: {
      'google-site-verification': 'your-google-verification-code',
      'msvalidate.01': 'your-bing-verification-code',
    },
  };

  if (structuredData) {
    metadata.other = {
      ...(metadata.other || {}),
      'application/ld+json': JSON.stringify(structuredData),
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  return metadata;
}

// Generate sitemap data
export function generateSitemapData(pages: Array<{
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}>) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>${seoConfig.siteUrl}${page.url}</loc>
      <lastmod>${page.lastModified}</lastmod>
      <changefreq>${page.changeFrequency}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `).join('')}
</urlset>`;
}

// Generate robots.txt content
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${seoConfig.siteUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /fighters/
Allow: /events/
Allow: /clubs/
Allow: /news/
Allow: /community/`;
}

// SEO utilities
export const seoUtils = {
  // Generate meta tags for head
  generateMetaTags(metadata: Metadata): string {
    const tags: string[] = [];
    
    if (metadata.title) {
      tags.push(`<title>${String(metadata.title)}</title>`);
    }
    
    if (metadata.description) {
      tags.push(`<meta name="description" content="${metadata.description}">`);
    }
    
    if (metadata.keywords) {
      tags.push(`<meta name="keywords" content="${Array.isArray(metadata.keywords) ? metadata.keywords.join(', ') : metadata.keywords}">`);
    }
    
    if (metadata.authors) {
      const authorsList = Array.isArray(metadata.authors) ? metadata.authors : [metadata.authors];
      const authors = authorsList.map(author => author.name).join(', ');
      tags.push(`<meta name="author" content="${authors}">`);
    }
    
    // Open Graph tags
    if (metadata.openGraph) {
      // @ts-expect-error - type property exists on OpenGraphMetadata
      if (metadata.openGraph.type) tags.push(`<meta property="og:type" content="${metadata.openGraph.type}">`);
      if (metadata.openGraph.title) tags.push(`<meta property="og:title" content="${metadata.openGraph.title}">`);
      if (metadata.openGraph.description) tags.push(`<meta property="og:description" content="${metadata.openGraph.description}">`);
      if (metadata.openGraph.url) tags.push(`<meta property="og:url" content="${metadata.openGraph.url}">`);
      if (metadata.openGraph.siteName) tags.push(`<meta property="og:site_name" content="${metadata.openGraph.siteName}">`);
      
      if (metadata.openGraph.images) {
        const images = Array.isArray(metadata.openGraph.images) ? metadata.openGraph.images : [metadata.openGraph.images];
        images.forEach((image) => {
          if (typeof image === 'string') {
             tags.push(`<meta property="og:image" content="${image}">`);
          } else if (typeof image === 'object' && image !== null && 'url' in image) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             const img = image as any;
             tags.push(`<meta property="og:image" content="${img.url}">`);
             if (img.width) tags.push(`<meta property="og:image:width" content="${img.width}">`);
             if (img.height) tags.push(`<meta property="og:image:height" content="${img.height}">`);
             if (img.alt) tags.push(`<meta property="og:image:alt" content="${img.alt}">`);
          }
        });
      }
    }
    
    // Twitter tags
    if (metadata.twitter) {
      // @ts-expect-error - card property exists on TwitterMetadata
      if (metadata.twitter.card) tags.push(`<meta name="twitter:card" content="${metadata.twitter.card}">`);
      if (metadata.twitter.title) tags.push(`<meta name="twitter:title" content="${metadata.twitter.title}">`);
      if (metadata.twitter.description) tags.push(`<meta name="twitter:description" content="${metadata.twitter.description}">`);
      if (metadata.twitter.creator) tags.push(`<meta name="twitter:creator" content="${metadata.twitter.creator}">`);
      if (metadata.twitter.site) tags.push(`<meta name="twitter:site" content="${metadata.twitter.site}">`);
      
      if (metadata.twitter.images) {
        const images = Array.isArray(metadata.twitter.images) ? metadata.twitter.images : [metadata.twitter.images];
        images.forEach((image) => {
           if (typeof image === 'string') {
             tags.push(`<meta name="twitter:image" content="${image}">`);
           } else if (typeof image === 'object' && image !== null && 'url' in image) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             const img = image as any;
             tags.push(`<meta name="twitter:image" content="${img.url}">`);
           }
        });
      }
    }
    
    return tags.join('\n');
  },

  // Validate URL structure
  validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Generate canonical URL
  generateCanonicalUrl(path: string): string {
    return `${seoConfig.siteUrl}${path}`;
  },

  // Generate social sharing URL
  generateSocialShareUrl(platform: 'facebook' | 'twitter' | 'linkedin', url: string, text?: string): string {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = text ? encodeURIComponent(text) : '';
    
    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      default:
        return url;
    }
  }
};
