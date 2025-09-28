import type { Metadata } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
if (process.env.NODE_ENV === 'production') {
  const allowLocalSite = /localhost|127\.0\.0\.1/.test(SITE);
  const allowLocalApi = /localhost|127\.0\.0\.1/.test(API);
  if (!allowLocalSite && !SITE.startsWith('https://')) throw new Error('NEXT_PUBLIC_SITE_URL mora biti https u produkciji');
  if (!allowLocalApi && !API.startsWith('https://')) throw new Error('NEXT_PUBLIC_API_URL mora biti https u produkciji');
}

type FighterDto = {
  id: string;
  name: string;
  nickname?: string;
  country?: string;
  weightClass?: string;
};

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const id = params.id;
  let f: FighterDto | null = null;
  try {
    const res = await fetch(`${API}/api/fighters/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      f = json?.data ?? null;
    }
  } catch {}

  const url = `${SITE}/fighters/${id}`;
  const title = f ? `${f.name}${f.nickname ? ` "${f.nickname}"` : ''} · Borac` : 'Borac · MMA Balkan';
  const description = f
    ? `${f.name}${f.nickname ? ` "${f.nickname}"` : ''}${f.weightClass ? ` — ${f.weightClass}` : ''}${f.country ? `, ${f.country}` : ''}.`
    : 'Profil borca na MMA Balkanu.';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'profile',
      url,
      siteName: 'MMA Balkan',
      locale: 'sr_RS',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default function FighterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
