"use client";
import { useEffect } from 'react';
import HolographicCard from '../HolographicCard';

export default function NewsList({ items }: { items: Array<{ id: string; url: string; title: string; titleOriginal: string; source: string; publishedAt: string | Date; }> }) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
      {items.map((n) => {
        const date = new Date(n.publishedAt).toLocaleString('sr-RS');
        const hostname = (() => { try { return new URL(n.url).hostname.replace('www.',''); } catch { return n.source; } })();
        const img = `/api/og-image?url=${encodeURIComponent(n.url)}`;
        return (
          <HolographicCard key={n.id} intensity={0.7}>
            <a href={n.url} target="_blank" rel="noreferrer" style={{display:'grid',gap:16,textDecoration:'none',color:'inherit'}}>
              <div style={{position:'relative',height:160,background:'linear-gradient(135deg,rgba(124,77,255,0.1),rgba(233,30,99,0.1))',borderRadius:12,overflow:'hidden'}}>
                <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.8}} onError={(e:any)=>{e.currentTarget.style.display='none'}} />
                <div style={{position:'absolute',top:12,right:12}}>
                  <span className="badge" style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.1)'}}>{hostname}</span>
                </div>
              </div>
              <div>
                <div style={{ fontWeight:600, marginBottom:8, fontSize:16, lineHeight:1.3 }}>{n.title}</div>
                <div className="muted" style={{fontSize:13,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span>{date}</span>
                  <span className="badge">{n.source}</span>
                </div>
              </div>
            </a>
          </HolographicCard>
        );
      })}
    </div>
  );
}
