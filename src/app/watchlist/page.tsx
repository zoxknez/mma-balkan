"use client";

import { Layout } from '@/components/layout';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/components/ui/watchlist-button';
import { useFighter } from '@/hooks/useFighter';
import { useEvent } from '@/hooks/useEvent';
import { useNewsItem } from '@/hooks/useNews';
import { useClub } from '@/hooks/useClub';
import { BookmarkCheck, BookmarkX, Calendar, Newspaper, Users, MapPin } from 'lucide-react';
import { usePrefetch } from '@/lib/prefetch';

type Item = { type: 'fighter' | 'event' | 'news' | 'club'; id: string };

function FighterRow({ id, onRemove }: { id: string; onRemove: () => void }) {
  const { data } = useFighter(id);
  const prefetch = usePrefetch();
  if (!data) return null;
  return (
    <li className="flex items-center justify-between py-2">
      <Link href={`/fighters/${id}`} className="text-white hover:text-green-400" onMouseEnter={() => prefetch(`/fighters/${id}`)}>{data.name}</Link>
      <div className="text-xs text-gray-400">{data.country} • {data.weightClass}</div>
      <Button size="sm" variant="outline" onClick={onRemove}><BookmarkX className="w-4 h-4 mr-1"/>Ukloni</Button>
    </li>
  );
}
function EventRow({ id, onRemove }: { id: string; onRemove: () => void }) {
  const { data } = useEvent(id);
  const prefetch = usePrefetch();
  if (!data) return null;
  return (
    <li className="flex items-center justify-between py-2">
      <Link href={`/events/${id}`} className="text-white hover:text-purple-400" onMouseEnter={() => prefetch(`/events/${id}`)}>{data.name}</Link>
      <div className="text-xs text-gray-400 flex items-center gap-2"><Calendar className="w-3 h-3"/>{new Date(data.startAt).toLocaleString('sr-RS')}</div>
      <Button size="sm" variant="outline" onClick={onRemove}><BookmarkX className="w-4 h-4 mr-1"/>Ukloni</Button>
    </li>
  );
}
function NewsRow({ id, onRemove }: { id: string; onRemove: () => void }) {
  const { data } = useNewsItem(id);
  const prefetch = usePrefetch();
  if (!data) return null;
  return (
    <li className="flex items-center justify-between py-2">
      <Link href={`/news/${id}`} className="text-white hover:text-orange-400" onMouseEnter={() => prefetch(`/news/${id}`)}>{data.title}</Link>
      <div className="text-xs text-gray-400 flex items-center gap-2"><Newspaper className="w-3 h-3"/>{new Date(data.publishAt).toLocaleDateString('sr-RS')}</div>
      <Button size="sm" variant="outline" onClick={onRemove}><BookmarkX className="w-4 h-4 mr-1"/>Ukloni</Button>
    </li>
  );
}
function ClubRow({ id, onRemove }: { id: string; onRemove: () => void }) {
  const { data } = useClub(id);
  const prefetch = usePrefetch();
  if (!data) return null;
  return (
    <li className="flex items-center justify-between py-2">
      <Link href={`/clubs/${id}`} className="text-white hover:text-cyan-400" onMouseEnter={() => prefetch(`/clubs/${id}`)}>{data.name}</Link>
      <div className="text-xs text-gray-400 flex items-center gap-2"><MapPin className="w-3 h-3"/>{data.city}, {data.country}</div>
      <Button size="sm" variant="outline" onClick={onRemove}><BookmarkX className="w-4 h-4 mr-1"/>Ukloni</Button>
    </li>
  );
}

export default function WatchlistPage() {
  const { list, toggle } = useWatchlist();
  const remove = (item: Item) => toggle(item);
  const byType = (t: Item['type']) => list.filter(i => i.type === t);

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>

        <div className="relative z-10 px-6 py-8 max-w-6xl mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <BookmarkCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Moja Watchlista</h1>
          </div>

          {list.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-gray-300 mb-4">Niste sačuvali nijednu stavku. Posetite detalje boraca, događaja, vesti ili klubova i kliknite „Sačuvaj”.</p>
              <Link href="/fighters"><Button variant="neon">Istraži borce</Button></Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-green-400"/> Borci</h2>
                <ul className="divide-y divide-white/5">
                  {byType('fighter').map((i) => (
                    <FighterRow key={`f-${i.id}`} id={i.id} onRemove={() => remove(i)} />
                  ))}
                  {byType('fighter').length === 0 && <li className="text-sm text-gray-400 py-2">Nema sačuvanih boraca.</li>}
                </ul>
              </div>
              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400"/> Događaji</h2>
                <ul className="divide-y divide-white/5">
                  {byType('event').map((i) => (
                    <EventRow key={`e-${i.id}`} id={i.id} onRemove={() => remove(i)} />
                  ))}
                  {byType('event').length === 0 && <li className="text-sm text-gray-400 py-2">Nema sačuvanih događaja.</li>}
                </ul>
              </div>
              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-3 flex items-center gap-2"><Newspaper className="w-4 h-4 text-orange-400"/> Vesti</h2>
                <ul className="divide-y divide-white/5">
                  {byType('news').map((i) => (
                    <NewsRow key={`n-${i.id}`} id={i.id} onRemove={() => remove(i)} />
                  ))}
                  {byType('news').length === 0 && <li className="text-sm text-gray-400 py-2">Nema sačuvanih vesti.</li>}
                </ul>
              </div>
              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400"/> Klubovi</h2>
                <ul className="divide-y divide-white/5">
                  {byType('club').map((i) => (
                    <ClubRow key={`c-${i.id}`} id={i.id} onRemove={() => remove(i)} />
                  ))}
                  {byType('club').length === 0 && <li className="text-sm text-gray-400 py-2">Nema sačuvanih klubova.</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
