import { Metadata } from 'next';
import { generateFighterStructuredData } from '@/lib/seo';

// Metadata generation function
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3003';

  try {
    // Fetch fighter data
    const res = await fetch(`${apiUrl}/api/fighters/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      return {
        title: 'Borac nije pronađen',
      };
    }

    const { data: fighter } = await res.json();

    if (!fighter) {
      return {
        title: 'Borac nije pronađen',
      };
    }

    const record = `${fighter.wins}-${fighter.losses}-${fighter.draws}`;
    const title = `${fighter.name}${fighter.nickname ? ` "${fighter.nickname}"` : ''} - MMA Borac`;
    const description = `${fighter.name} (${record}) - ${fighter.weightClass} kategorija iz ${fighter.country}. ${fighter.koTkoWins} KO pobed${fighter.submissionWins > 0 ? `, ${fighter.submissionWins} submission${fighter.submissionWins > 1 ? 'a' : ''}` : ''}. Pratite statistike i borbe na MMA Balkan.`;

    // Generate structured data
    const structuredData = generateFighterStructuredData({
      id: fighter.id,
      name: fighter.name,
      weightClass: fighter.weightClass,
      record,
      nationality: fighter.country,
      image: fighter.imageUrl,
      description: fighter.bio,
    });

    return {
      title,
      description,
      keywords: [
        fighter.name,
        fighter.nickname || '',
        'MMA',
        'borac',
        fighter.weightClass,
        fighter.country,
        'borbe',
        'statistike',
      ].filter(Boolean),
      openGraph: {
        title,
        description,
        type: 'profile',
        url: `/fighters/${fighter.id}`,
        images: [
          {
            url: fighter.imageUrl || '/og-fighter-default.jpg',
            width: 1200,
            height: 630,
            alt: `${fighter.name} - MMA Borac`,
          },
        ],
        locale: 'sr_RS',
        siteName: 'MMA Balkan',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [fighter.imageUrl || '/og-fighter-default.jpg'],
        site: '@mmabalkan',
        creator: '@mmabalkan',
      },
      alternates: {
        canonical: `/fighters/${fighter.id}`,
      },
      other: {
        'application/ld+json': JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    console.error('Error generating fighter metadata:', error);
    return {
      title: 'MMA Borac - MMA Balkan',
      description: 'Profil MMA borca na MMA Balkan platformi.',
    };
  }
}

export default function FighterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
