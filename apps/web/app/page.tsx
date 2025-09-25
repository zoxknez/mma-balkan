import Link from 'next/link';
import Reveal from './Reveal';
import HolographicCard from './HolographicCard';
import { prisma } from '@mmasrb/db';
import { headers } from 'next/headers';

export default async function HomePage() {
  // Stats from DB
  const [fightersTotal, eventsTotal, upcomingTotal, newsTotal] = await Promise.all([
    (prisma as any).fighter.count(),
    (prisma as any).event.count(),
    (prisma as any).event.count({ where: { startsAt: { gte: new Date() } } }),
    (prisma as any).newsItem.count?.() ?? 0,
  ]);
  // Trending news (server fetch)
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  const proto = (h.get('x-forwarded-proto') || 'http').split(',')[0];
  const base = `${proto}://${host}`;
  const newsRes = await fetch(`${base}/api/news?lang=sr-Latn&page=1&limit=10`, { cache:'no-store' });
  const trending = newsRes.ok ? (await newsRes.json()).items as Array<{id:string;url:string;title:string;source:string;publishedAt:string}> : [];
  return (
    <section className="hero" style={{padding:'48px 0 24px'}}>
      <div className="container" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:48,alignItems:'center',marginBottom:32}}>
        <Reveal>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
            <span style={{fontSize:32}}>🥊</span>
            <span className="badge" style={{background:'linear-gradient(135deg,#e91e63,#7c4dff)',color:'#fff',border:'none',padding:'4px 12px'}}>
              BALKAN MMA HUB
            </span>
          </div>
          <h1 style={{
            fontSize:56, 
            lineHeight:1.05, 
            margin:'0 0 16px',
            fontWeight:800,
            background:'linear-gradient(135deg, #f1f5f9 0%, #e91e63 40%, #7c4dff 100%)',
            WebkitBackgroundClip:'text',
            backgroundClip:'text',
            color:'transparent'
          }}>
            Sve o MMA sportu<br/>na jednom mestu
          </h1>
          <p className="muted" style={{fontSize:20, margin:'0 0 32px', lineHeight:1.5}}>
            Borci • Događaji • Predikcije • Analize • Forum<br/>
            Najkompletniji MMA portal na Balkanu 🇷🇸
          </p>
          <div style={{display:'flex', gap:16, flexWrap:'wrap'}}>
            <Link href="/news" className="btn btn-primary" style={{fontSize:16, padding:'16px 24px'}}>
              � Poslednje vesti
            </Link>
            <Link href="/events" className="btn" style={{fontSize:16, padding:'16px 24px'}}>
              🏟️ UFC i ONE FC
            </Link>
            <Link href="/fighters" className="btn" style={{fontSize:16, padding:'16px 24px'}}>
              🥊 Srpski borci
            </Link>
          </div>
        </Reveal>
        <div style={{display:'grid',gap:16}}>
          <HolographicCard intensity={1.2}>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16}}>
              <Reveal delay={100}>
                <div style={{textAlign:'center',padding:16}}>
                  <div style={{fontSize:32, marginBottom:8}}>🏆</div>
                  <div style={{fontWeight:700, marginBottom:4}}>UFC Rezultati</div>
                  <div className="muted" style={{fontSize:13}}>Live skorovi</div>
                </div>
              </Reveal>
              <Reveal delay={150}>
                <div style={{textAlign:'center',padding:16}}>
                  <div style={{fontSize:32, marginBottom:8}}>🥋</div>
                  <div style={{fontWeight:700, marginBottom:4}}>Balkan Borci</div>
                  <div className="muted" style={{fontSize:13}}>Profili i stats</div>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div style={{textAlign:'center',padding:16}}>
                  <div style={{fontSize:32, marginBottom:8}}>�</div>
                  <div style={{fontWeight:700, marginBottom:4}}>Fight Analiza</div>
                  <div className="muted" style={{fontSize:13}}>AI predikcije</div>
                </div>
              </Reveal>
              <Reveal delay={250}>
                <div style={{textAlign:'center',padding:16}}>
                  <div style={{fontSize:32, marginBottom:8}}>💬</div>
                  <div style={{fontWeight:700, marginBottom:4}}>MMA Forum</div>
                  <div className="muted" style={{fontSize:13}}>Diskusije fanova</div>
                </div>
              </Reveal>
            </div>
          </HolographicCard>
        </div>
      </div>
      <div className="container" style={{marginTop:48}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
          <HolographicCard className="stat" intensity={0.8}>
            <div style={{textAlign:'center'}}>
              <div className="label" style={{color:'var(--muted)',fontSize:14,marginBottom:8,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
                🥊 Borci
              </div>
              <div className="value" style={{fontSize:28,fontWeight:800,background:'linear-gradient(135deg,#7c4dff,#e91e63)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>{fightersTotal}</div>
            </div>
          </HolographicCard>
          <HolographicCard className="stat" intensity={0.8}>
            <div style={{textAlign:'center'}}>
              <div className="label" style={{color:'var(--muted)',fontSize:14,marginBottom:8,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
                🏟️ Događaji
              </div>
              <div className="value" style={{fontSize:28,fontWeight:800,background:'linear-gradient(135deg,#00e676,#7c4dff)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>{eventsTotal}</div>
            </div>
          </HolographicCard>
          <HolographicCard className="stat" intensity={0.8}>
            <div style={{textAlign:'center'}}>
              <div className="label" style={{color:'var(--muted)',fontSize:14,marginBottom:8,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
                🔥 Uskoro
              </div>
              <div className="value" style={{fontSize:28,fontWeight:800,background:'linear-gradient(135deg,#ff6d00,#e91e63)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>{upcomingTotal}</div>
            </div>
          </HolographicCard>
          <HolographicCard className="stat" intensity={0.8}>
            <div style={{textAlign:'center'}}>
              <div className="label" style={{color:'var(--muted)',fontSize:14,marginBottom:8,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
                📰 MMA Vesti
              </div>
              <div className="value" style={{fontSize:28,fontWeight:800,background:'linear-gradient(135deg,#e91e63,#00e676)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>{newsTotal}</div>
            </div>
          </HolographicCard>
        </div>
      </div>
      {trending.length>0 && (
        <div className="container" style={{marginTop:48}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:24}}>
            <h3 style={{margin:0,fontSize:24,fontWeight:700,display:'flex',alignItems:'center',gap:8}}>
              🔥 Trending MMA vesti
            </h3>
            <Link href="/news" className="btn">Sve MMA vesti →</Link>
          </div>
          <div className="h-scroll">
            <div className="h-track">
              {trending.map((n, i) => (
                <HolographicCard key={n.id} intensity={0.6} style={{width:320,minWidth:320}}>
                  <a href={n.url} target="_blank" rel="noreferrer" style={{display:'grid',gap:12,textDecoration:'none',color:'inherit'}}>
                    <div style={{fontWeight:600,fontSize:15,lineHeight:1.4}}>{n.title}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div className="muted" style={{fontSize:12}}>{new Date(n.publishedAt).toLocaleString('sr-RS')}</div>
                      <span className="badge">{n.source}</span>
                    </div>
                  </a>
                </HolographicCard>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
