import { prisma } from '@mmasrb/db';
import Link from 'next/link';
import { Section, Card, List, Item, MetaRow } from '../ui';
import Pagination from '../Pagination';
import Tabs from '../Tabs';

type Props = { searchParams?: { [k: string]: string | string[] | undefined } };

export default async function EventsPage({ searchParams }: Props) {
  const org = (searchParams?.org as string) || '';
  const from = (searchParams?.from as string) || '';
  const to = (searchParams?.to as string) || '';
  const upcoming = (searchParams?.upcoming as string) === '1';
  const page = Math.max(1, Number(searchParams?.page ?? 1) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams?.limit ?? 20) || 20));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (org) where.organizationId = org;
  const nowISO = new Date().toISOString();
  if (from) where.startsAt = { ...(where.startsAt || {}), gte: new Date(from) };
  if (to) where.startsAt = { ...(where.startsAt || {}), lte: new Date(to) };
  if (upcoming && !from) where.startsAt = { ...(where.startsAt || {}), gte: new Date(nowISO) };

  const [events, total, orgs] = await Promise.all([
    (prisma as any).event.findMany({
      where,
      orderBy: { startsAt: 'asc' },
      include: { organization: true, bouts: true },
      skip,
      take: limit,
    }),
    (prisma as any).event.count({ where }),
    (prisma as any).organization.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ]);
  const hasNext = page * limit < total;
  const mkHref = (p: number) => `?page=${p}&limit=${limit}${org ? `&org=${encodeURIComponent(org)}` : ''}${from ? `&from=${encodeURIComponent(from)}` : ''}${to ? `&to=${encodeURIComponent(to)}` : ''}${upcoming ? `&upcoming=1` : ''}`;

  const chips = [
    org && { label: 'Organizacija', value: (orgs.find((o: any)=>o.id===org)?.name || org) },
    from && { label: 'Od', value: from },
    to && { label: 'Do', value: to },
    upcoming && { label: 'Tip', value: 'Samo budući' },
  ].filter(Boolean) as Array<{label:string;value:string}>;

  return (
    <Section title="🏟️ MMA Događaji" right={
      <form method="get" action="/events" style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
        <select className="input" name="org" defaultValue={org} style={{width:220}}>
          <option value="">Sve organizacije</option>
          {orgs.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <input className="input" type="date" name="from" defaultValue={from} />
        <input className="input" type="date" name="to" defaultValue={to} />
        <label style={{display:'flex',alignItems:'center',gap:6}}>
          <input type="checkbox" name="upcoming" value="1" defaultChecked={upcoming} />
          <span className="muted">Samo budući</span>
        </label>
        <input type="hidden" name="limit" value={limit} />
        <button className="btn">Primeni</button>
      </form>
    }>
      <Tabs
        sticky
        items={[
          { label: '🏆 Sve', href: '/events', active: !upcoming && !from && !to },
          { label: '🔥 Budući', href: '/events?upcoming=1', active: upcoming },
          { label: '📚 Prošli', href: `/events?to=${encodeURIComponent(new Date().toISOString())}` , active: Boolean(to && new Date(to).getTime() <= Date.now()) },
        ]}
      />
      {chips.length > 0 && (
        <div className="sticky-bar" style={{marginBottom:12}}>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            <span className="muted" style={{marginRight:6}}>Filteri:</span>
            {chips.map((c, i) => (
              <span key={i} className="chip">{c.label}: {c.value}</span>
            ))}
            <Link href="/events" className="btn-ghost" style={{marginLeft:'auto'}}>Ukloni filtere</Link>
          </div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
        {events.map((e: any) => (
          <div key={e.id} className="card" style={{padding:14,display:'grid',gap:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
              <div style={{fontWeight:700}}>{e.name}</div>
              <span className="badge">{e.organization.name}</span>
            </div>
            <div className="muted">{new Date(e.startsAt).toLocaleString('sr-RS')}</div>
            <div className="muted">Borbe: {e.bouts.length}</div>
            <div style={{display:'flex',gap:8,marginTop:4}}>
              <Link href={`/events/${e.id}`} className="btn btn-primary">Detalji</Link>
              <Link href={`/events/${e.id}`} className="btn">Predikcije</Link>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} hasNext={hasNext} makeHref={mkHref} />
    </Section>
  );
}
