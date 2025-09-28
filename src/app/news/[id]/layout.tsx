import type { Metadata } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
if (process.env.NODE_ENV === 'production') {
  const allowLocalSite = /localhost|127\.0\.0\.1/.test(SITE);
  const allowLocalApi = /localhost|127\.0\.0\.1/.test(API);
  if (!allowLocalSite && !SITE.startsWith('https://')) throw new Error('NEXT_PUBLIC_SITE_URL mora biti https u produkciji');
  if (!allowLocalApi && !API.startsWith('https://')) throw new Error('NEXT_PUBLIC_API_URL mora biti https u produkciji');
}

type NewsDto = {
  id: string;
  title: string;
  authorName?: string;
  publishAt?: string;
  imageUrl?: string;
};

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const id = params.id;
  let n: NewsDto | null = null;
  try {
    const res = await fetch(`${API}/api/news/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      n = json?.data ?? null;
    }
  } catch {}

  const url = `${SITE}/news/${id}`;
  const title = n ? `${n.title} · Vest` : 'Vest · MMA Balkan';
  const description = n ? `Vest: ${n.title}${n.authorName ? ` — ${n.authorName}` : ''}.` : 'Vesti sa MMA Balkana.';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      siteName: 'MMA Balkan',
      locale: 'sr_RS',
      images: n?.imageUrl ? [{ url: n.imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: n?.imageUrl ? [n.imageUrl] : undefined,
    },
  };
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
