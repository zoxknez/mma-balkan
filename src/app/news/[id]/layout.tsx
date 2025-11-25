import { Metadata } from 'next';
import { generateNewsStructuredData } from '@/lib/seo';

// Metadata generation function
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3003';

  try {
    // Fetch news data
    const res = await fetch(`${apiUrl}/api/news/${id}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!res.ok) {
      return {
        title: 'Vest nije pronađena',
      };
    }

    const { data: news } = await res.json();

    if (!news) {
      return {
        title: 'Vest nije pronađena',
      };
    }

    const publishDate = new Date(news.publishAt).toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const title = news.title;
    const description = news.excerpt || news.content.substring(0, 155) + '...';

    // Generate structured data
    const structuredData = generateNewsStructuredData({
      id: news.id,
      headline: news.title,
      description,
      image: news.imageUrl,
      datePublished: news.publishAt,
      dateModified: news.updatedAt,
      author: news.authorName,
      category: news.category,
    });

    return {
      title,
      description,
      keywords: [
        ...news.title.split(' ').filter((w: string) => w.length > 3),
        'MMA',
        'vesti',
        'news',
        news.category,
        publishDate,
      ],
      authors: [{ name: news.authorName }],
      openGraph: {
        title,
        description,
        type: 'article',
        url: `/news/${news.id}`,
        images: [
          {
            url: news.imageUrl || '/og-news-default.jpg',
            width: 1200,
            height: 630,
            alt: news.title,
          },
        ],
        locale: 'sr_RS',
        siteName: 'MMA Balkan',
        publishedTime: news.publishAt,
        modifiedTime: news.updatedAt,
        section: news.category,
        authors: [news.authorName],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [news.imageUrl || '/og-news-default.jpg'],
        site: '@mmabalkan',
        creator: '@mmabalkan',
      },
      alternates: {
        canonical: `/news/${news.id}`,
      },
      other: {
        'application/ld+json': JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    console.error('Error generating news metadata:', error);
    return {
      title: 'MMA Vest - MMA Balkan',
      description: 'Najnovije MMA vesti na MMA Balkan platformi.',
    };
  }
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
