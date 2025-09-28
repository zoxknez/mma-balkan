"use client";
import { useEffect, useState } from 'react';
import { Button } from './button';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';

type Entity = { type: 'fighter' | 'event' | 'news' | 'club'; id: string };

const KEY = 'mmabalkan_watchlist_v1';

function load(): Entity[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Entity[]) : [];
  } catch {
    return [];
  }
}
function save(list: Entity[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export function useWatchlist() {
  const [list, setList] = useState<Entity[]>([]);
  useEffect(() => { setList(load()); }, []);
  const has = (e: Entity) => list.some(x => x.type === e.type && x.id === e.id);
  const toggle = (e: Entity) => {
    setList(prev => {
      const exists = prev.some(x => x.type === e.type && x.id === e.id);
      const next = exists ? prev.filter(x => !(x.type === e.type && x.id === e.id)) : [...prev, e];
      save(next);
      return next;
    });
  };
  return { list, has, toggle };
}

export function WatchlistButton({ entity }: { entity: Entity }) {
  const { has, toggle } = useWatchlist();
  const active = has(entity);
  return (
    <Button variant={active ? 'neon' : 'outline'} size="sm" onClick={() => toggle(entity)} aria-pressed={active}>
      {active ? <BookmarkCheck className="w-4 h-4 mr-1" /> : <BookmarkPlus className="w-4 h-4 mr-1" />}
      {active ? 'U listi' : 'Sačuvaj'}
    </Button>
  );
}
