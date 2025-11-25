import { Metadata } from 'next';
import { generateEventStructuredData } from '@/lib/seo';

// Metadata generation function
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3003';

  try {
    // Fetch event data
    const res = await fetch(`${apiUrl}/api/events/${id}`, {
      next: { revalidate: 600 }, // Revalidate every 10 minutes
    });

    if (!res.ok) {
      return {
        title: 'Događaj nije pronađen',
      };
    }

    const { data: event } = await res.json();

    if (!event) {
      return {
        title: 'Događaj nije pronađen',
      };
    }

    const date = new Date(event.startAt).toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const title = `${event.name} - ${date}`;
    const description = `${event.name} - MMA događaj u ${event.city}, ${event.country}. ${event.fightsCount} borb${event.fightsCount === 1 ? 'a' : 'i'}. Status: ${event.status}. ${event.ticketsAvailable ? 'Ulaznice dostupne!' : ''}`.trim();

    // Generate structured data
    const structuredData = generateEventStructuredData({
      id: event.id,
      name: event.name,
      date: event.startAt,
      location: `${event.venue || event.city}, ${event.country}`,
      description,
      image: event.posterUrl,
      fighters: [], // Could fetch fights and add fighters
    });

    return {
      title,
      description,
      keywords: [
        event.name,
        'MMA',
        'događaj',
        'borbe',
        event.city,
        event.country,
        date,
        event.mainEvent || '',
      ].filter(Boolean),
      openGraph: {
        title,
        description,
        type: 'website',
        url: `/events/${event.id}`,
        images: [
          {
            url: event.posterUrl || '/og-event-default.jpg',
            width: 1200,
            height: 630,
            alt: `${event.name} - MMA Događaj`,
          },
        ],
        locale: 'sr_RS',
        siteName: 'MMA Balkan',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [event.posterUrl || '/og-event-default.jpg'],
        site: '@mmabalkan',
        creator: '@mmabalkan',
      },
      alternates: {
        canonical: `/events/${event.id}`,
      },
      other: {
        'application/ld+json': JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    console.error('Error generating event metadata:', error);
    return {
      title: 'MMA Događaj - MMA Balkan',
      description: 'Detalji MMA događaja na MMA Balkan platformi.',
    };
  }
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
