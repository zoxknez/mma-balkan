import type { Metadata } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
if (process.env.NODE_ENV === 'production') {
  const allowLocalSite = /localhost|127\.0\.0\.1/.test(SITE);
  const allowLocalApi = /localhost|127\.0\.0\.1/.test(API);
  if (!allowLocalSite && !SITE.startsWith('https://')) throw new Error('NEXT_PUBLIC_SITE_URL mora biti https u produkciji');
  if (!allowLocalApi && !API.startsWith('https://')) throw new Error('NEXT_PUBLIC_API_URL mora biti https u produkciji');
}

type EventDto = {
  id: string;
  name: string;
  startAt: string;
  status: string;
  city?: string;
  country?: string;
};

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const id = params.id;
  let e: EventDto | null = null;
  try {
    const res = await fetch(`${API}/api/events/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      e = json?.data ?? null;
    }
  } catch {}

  const url = `${SITE}/events/${id}`;
  const title = e ? `${e.name} · Događaj` : 'Događaj · MMA Balkan';
  const description = e
    ? `MMA događaj ${e.name}${e.city ? ` — ${e.city}` : ''}${e.country ? `, ${e.country}` : ''}.`
    : 'Detalji MMA događaja na MMA Balkanu.';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'MMA Balkan',
      locale: 'sr_RS',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return children;
}
