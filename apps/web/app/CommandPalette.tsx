"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Item = { label: string; href: string; k?: string };

const ITEMS: Item[] = [
  { label: 'Vesti', href: '/news', k: 'v' },
  { label: 'Događaji', href: '/events', k: 'd' },
  { label: 'Borci', href: '/fighters', k: 'b' },
  { label: 'Uživo', href: '/live', k: 'u' },
  { label: 'Forum', href: '/forum', k: 'f' },
  { label: 'Početna', href: '/', k: 'p' },
];

export default function CommandPalette(){
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && (e.key.toLowerCase()==='k')) { e.preventDefault(); setOpen(o=>!o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ITEMS;
    return ITEMS.filter(i => i.label.toLowerCase().includes(s) || i.k===s);
  }, [q]);

  const go = (href: string) => {
    setOpen(false);
    setQ('');
    router.push(href);
  };

  if (!open) return null;
  return (
    <div className="backdrop" onClick={()=>setOpen(false)}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <input autoFocus className="input" placeholder="Traži sekcije (npr. vesti)…" value={q} onChange={e=>setQ(e.target.value)} />
          <span className="kbd">Ctrl</span><span className="kbd">K</span>
        </div>
        <div style={{marginTop:10, maxHeight:300, overflow:'auto'}}>
          {filtered.map((i)=> (
            <button key={i.href} className="list-item btn-ghost" style={{width:'100%',textAlign:'left',padding:'10px 8px',borderRadius:10}} onClick={()=>go(i.href)}>
              <strong>{i.label}</strong> <span className="muted">{i.k ? ` • tipka: ${i.k}` : ''}</span>
            </button>
          ))}
          {filtered.length===0 && <div className="muted" style={{padding:'8px 0'}}>Nema rezultata.</div>}
        </div>
      </div>
    </div>
  );
}
