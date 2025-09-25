import { prisma } from '@mmasrb/db';
import Link from 'next/link';
import { Section, Card } from '../ui';
import Pagination from '../Pagination';
import Tabs from '../Tabs';

type Props = { searchParams?: { [k: string]: string | string[] | undefined } };

export default async function FightersPage({ searchParams }: Props) {
  const q = ((searchParams?.q as string) || '').trim();
  const country = ((searchParams?.country as string) || '').trim();
  const page = Math.max(1, Number(searchParams?.page ?? 1) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams?.limit ?? 24) || 24));
  const skip = (page - 1) * limit;

  // Build filters
  const where: any = {};
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
      { nickname: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (country) where.country = country;

  const [fighters, total, countries] = await Promise.all([
    (prisma as any).fighter.findMany({
      where,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      skip,
      take: limit,
    }),
    (prisma as any).fighter.count({ where }),
    (prisma as any).fighter.findMany({ distinct: ['country'], select: { country: true } }),
  ]);
  const countryOptions = countries.map((c: any) => c.country).filter(Boolean).sort((a: string,b: string)=>a.localeCompare(b));
  const hasNext = page * limit < total;
  const mkHref = (p: number) => `?page=${p}&limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ''}${country ? `&country=${encodeURIComponent(country)}` : ''}`;

  return (
    <Section title="🥊 MMA Borci" right={
      <form method="get" action="/fighters" style={{display:'flex', gap:8, alignItems:'center'}}>
        <input className="input" name="q" placeholder="Pretraga (ime, prezime, nadimak)" defaultValue={q} style={{width:260}} />
        <select className="input" name="country" defaultValue={country} style={{width:160}}>
          <option value="">Sve države</option>
          {countryOptions.map((c: string) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="hidden" name="limit" value={limit} />
        <button className="btn">Primeni</button>
      </form>
    }>
      <Tabs
        sticky
        items={[
          { label: '🌍 Svi', href: '/fighters', active: !country },
          ...countryOptions.slice(0, 6).map((c: string) => ({
            label: `${c === 'Serbia' ? '🇷🇸' : c === 'Croatia' ? '🇭🇷' : c === 'Bosnia and Herzegovina' ? '🇧🇦' : c === 'Montenegro' ? '🇲🇪' : '🌍'} ${c}`,
            href: `/fighters?country=${encodeURIComponent(c)}`,
            active: country === c,
          })),
        ]}
      />
      {(q || country) && (
        <div className="sticky-bar" style={{marginBottom:12}}>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            <span className="muted" style={{marginRight:6}}>Filteri:</span>
            {q && <span className="chip">Pretraga: {q}</span>}
            {country && <span className="chip">Država: {country}</span>}
            <Link href="/fighters" className="btn-ghost" style={{marginLeft:'auto'}}>Ukloni filtere</Link>
          </div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))',gap:12}}>
        {fighters.map((f: any) => (
          <Card key={f.id}>
            <div style={{display:'grid',gridTemplateColumns:'56px 1fr',gap:10,alignItems:'center'}}>
              <div style={{width:56,height:56,borderRadius:12,background:'rgba(255,255,255,.04)',display:'grid',placeItems:'center',fontWeight:700}}>
                {(f.firstName?.[0]||'').slice(0,1)}{(f.lastName?.[0]||'').slice(0,1)}
              </div>
              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:8}}>
                  <div style={{fontWeight:700}}>
                    <Link href={`/fighters/${f.id}`}>{f.firstName} {f.lastName}</Link>
                  </div>
                  {f.country && <span className="badge">{f.country}</span>}
                </div>
                {f.nickname && <div className="muted" style={{marginTop:4}}>“{f.nickname}”</div>}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Pagination page={page} hasNext={hasNext} makeHref={mkHref} />
    </Section>
  );
}
