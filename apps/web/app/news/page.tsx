import NewsList from './NewsList';
import Link from 'next/link';
import { Section } from '../ui';
import { Suspense } from 'react';
import Pagination from '../Pagination';
import { headers } from 'next/headers';
import Tabs from '../Tabs';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function NewsPage({ searchParams }: Props) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const lang = (searchParams?.lang as string) || 'sr-Latn';
  const limit = Number(searchParams?.limit ?? 20) || 20;
  const src = (searchParams?.source as string) || '';
  const mkQuery = (p: number, l = lang, s = src) => `?page=${p}&limit=${limit}&lang=${encodeURIComponent(l)}${s ? `&source=${encodeURIComponent(s)}` : ''}`;
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  const proto = (h.get('x-forwarded-proto') || 'http').split(',')[0];
  const base = `${proto}://${host}`;
  const [dataRes, metaRes] = await Promise.all([
    fetch(`${base}/api/news?lang=${encodeURIComponent(lang)}&page=${page}&limit=${limit}${src ? `&source=${encodeURIComponent(src)}` : ''}`, { cache: 'no-store' }),
    fetch(`${base}/api/news/meta`, { cache: 'no-store' }),
  ]);
  if (!dataRes.ok) throw new Error('Failed to load news');
  const data = await dataRes.json();
  const meta = metaRes.ok ? await metaRes.json() : { sources: [] };
  const items = data.items as Array<{ id: string; url: string; title: string; titleOriginal: string; source: string; publishedAt: string | Date; }>;
  const total = data.total as number;
  const hasNext = page * limit < total;
  return (
    <Section title="📰 MMA Vesti" right={<div style={{display:'flex',gap:12, alignItems:'center'}}>
      <div className="hide-sm">Jezik: <Link href={mkQuery(page, 'sr-Latn')}>🇷🇸 SR</Link>{' | '}<Link href={mkQuery(page, 'en')}>🇺🇸 EN</Link></div>
    </div>}>
      <Tabs
        sticky
        items={[{ label: '📰 Sve vesti', href: `/news${mkQuery(1, lang, '')}`, active: src === '' }, ...(meta.sources || []).map((s: string) => ({
          label: `${s.includes('ufc') || s.includes('UFC') ? '🏆' : s.includes('mma') || s.includes('MMA') ? '🥊' : '📰'} ${s}`,
          href: `/news${mkQuery(1, lang, s)}`,
          active: src === s,
        }))]}
        right={<div className="show-sm" style={{display:'flex',gap:8, alignItems:'center'}}>
          <span className="muted">Jezik:</span>
          <Link className={lang==='sr-Latn'?'chip':''} href={mkQuery(page, 'sr-Latn')}>🇷🇸 SR</Link>
          <Link className={lang==='en'?'chip':''} href={mkQuery(page, 'en')}>🇺🇸 EN</Link>
        </div>}
      />
      <Suspense fallback={<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12}}>
        {Array.from({length:8}).map((_,i)=> (
          <div key={i} className="card" style={{padding:0,overflow:'hidden',display:'grid',gridTemplateRows:'140px auto'}}>
            <div className="skeleton" style={{height:140}} />
            <div style={{padding:'12px 14px'}}>
              <div className="skeleton" style={{height:16,width:'80%',borderRadius:8}} />
              <div className="skeleton" style={{height:12,width:'60%',borderRadius:8,marginTop:8}} />
            </div>
          </div>
        ))}
      </div>}>
        <NewsList items={items} />
      </Suspense>
      <Pagination page={page} hasNext={hasNext} makeHref={(p)=>mkQuery(p)} />
    </Section>
  );
}
