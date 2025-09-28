'use client';

import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEvent } from '@/hooks/useEvent';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Activity, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useEventFights } from '@/hooks/useFights';
import { MethodBadge } from '@/components/fights/MethodBadge';
import { ShareButton } from '@/components/ui/share-button';
import { usePrefetch } from '@/lib/prefetch';
import { Countdown } from '@/components/ui/countdown';
import { WatchlistButton } from '../../../components/ui/watchlist-button';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildICS, downloadICS } from '@/lib/ics';
import { prettyEventStatus } from '@/lib/utils';

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { data: e, isLoading } = useEvent(id);
  const { data: fights = [], isLoading: loadingFights } = useEventFights(id);
  const prefetch = usePrefetch();

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>

        <div className="relative z-10 px-6 py-8 max-w-6xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Nazad
            </Button>
            <ShareButton title="Podeli događaj" />
            {id ? (
              <WatchlistButton entity={{ type: 'event', id }} />
            ) : null}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8 relative overflow-hidden"
          >
            <CyberGrid />
            <div className="relative z-10">
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-7 w-64 mb-2" />
                </div>
              ) : e ? (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{e.name}</h1>
                    <div className="text-gray-300 text-sm space-y-1">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" /> {new Date(e.startAt).toLocaleString('sr-RS')}</div>
                      <div>
                        <Countdown startAt={e.startAt} />
                      </div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /> {e.city}, {e.country}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-2 border "
                      style={{ borderColor: 'rgba(147, 51, 234, 0.4)' }}>
                      <span className={
                        e.status === 'LIVE' ? 'text-red-400' : e.status === 'COMPLETED' ? 'text-green-400' : 'text-blue-400'
                      }>
                        {prettyEventStatus(e.status)}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs">{e.fightsCount} borbi</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Događaj nije pronađen.</div>
              )}
            </div>
          </motion.div>

          {!isLoading && e && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-2"><Users className="w-5 h-5" /> {(e.attendees ?? 0).toLocaleString()} gledalaca</div>
                <div className="text-gray-400 text-xs mt-1">Predikcija posete</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-2"><Trophy className="w-5 h-5" /> Glavna borba</div>
                <div className="text-white text-sm mt-1">{e.mainEvent ? e.mainEvent : 'Biće objavljeno'}</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 flex items-center justify-center gap-2"><Activity className="w-5 h-5" /> Status</div>
                <div className="text-white text-sm mt-1">{e.status}</div>
              </div>
            </div>
          )}

          {!isLoading && e && (
            <div className="mt-8 flex gap-3">
              {e.status === 'LIVE' && (
                <Button variant="neon" className="relative overflow-hidden">
                  <Zap className="w-4 h-4 mr-2" /> Gledaj uživo
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  const start = new Date(e.startAt);
                  const ics = buildICS({
                    uid: `event-${e.id}@mmabalkan`,
                    title: e.name,
                    description: `MMA događaj — ${e.name}`,
                    location: `${e.city}, ${e.country}`,
                    start,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  });
                  downloadICS(`${e.name.replace(/\s+/g, '_')}.ics`, ics);
                }}
              >
                Dodaj u kalendar
              </Button>
              <Link href="/events" className="inline-flex">
                <Button variant="outline">Nazad na događaje</Button>
              </Link>
            </div>
          )}

          {/* Fight Card */}
          <div className="mt-10">
            <h2 className="text-white font-semibold mb-3">Karta borbi</h2>
            <div className="glass-card p-4">
              {loadingFights ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              ) : fights.length ? (
                <ul className="divide-y divide-white/5">
                  {/* Glavni program */}
                  {fights.filter(f => f.section === 'MAIN').map((f) => (
                    <li key={f.id} className="py-3 flex items-center justify-between">
                      <div className="text-sm text-gray-200">
                        <span className="text-gray-400 mr-2">#{f.orderNo}</span>
                        <span className="text-orange-300">{f.weightClass ?? 'Bez kategorije'}</span>
                      </div>
                      <div className="flex-1 text-center text-white font-medium">
                        {f.redFighter?.id ? (
                          <Link className="hover:text-orange-300 transition-colors" href={`/fighters/${f.redFighter.id}`} onMouseEnter={() => prefetch(`/fighters/${f.redFighter!.id}`)}>{f.redFighter.name}</Link>
                        ) : (
                          <span>Biće objavljeno</span>
                        )}
                        <span className="text-gray-400 mx-1">protiv</span>
                        {f.blueFighter?.id ? (
                          <Link className="hover:text-orange-300 transition-colors" href={`/fighters/${f.blueFighter.id}`} onMouseEnter={() => prefetch(`/fighters/${f.blueFighter!.id}`)}>{f.blueFighter.name}</Link>
                        ) : (
                          <span>Biće objavljeno</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-300 w-40 text-right">
                        {f.status === 'COMPLETED' ? (
                          <div className="flex items-center justify-end gap-2">
                            <MethodBadge method={f.method} />
                            <span className="text-gray-400">{f.round ? `R${f.round}` : ''} {f.time ?? ''}</span>
                          </div>
                        ) : (
                          <span className="text-blue-400">{f.status === 'LIVE' ? 'Uživo' : f.status === 'SCHEDULED' ? 'Zakazana' : f.status}</span>
                        )}
                      </div>
                    </li>
                  ))}
                  {/* Uvodni program */}
                  <li className="py-2 text-xs uppercase tracking-wider text-gray-400">Uvodni program</li>
                  {/* Uvodne borbe */}
                  {fights.filter(f => f.section !== 'MAIN').map((f) => (
                    <li key={f.id} className="py-3 flex items-center justify-between">
                      <div className="text-sm text-gray-200">
                        <span className="text-gray-400 mr-2">#{f.orderNo}</span>
                        <span className="text-orange-300">{f.weightClass ?? 'Bez kategorije'}</span>
                      </div>
                      <div className="flex-1 text-center text-white font-medium">
                        {f.redFighter?.id ? (
                          <Link className="hover:text-orange-300 transition-colors" href={`/fighters/${f.redFighter.id}`}>{f.redFighter.name}</Link>
                        ) : (
                          <span>Biće objavljeno</span>
                        )}
                        <span className="text-gray-400 mx-1">protiv</span>
                        {f.blueFighter?.id ? (
                          <Link className="hover:text-orange-300 transition-colors" href={`/fighters/${f.blueFighter.id}`}>{f.blueFighter.name}</Link>
                        ) : (
                          <span>Biće objavljeno</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-300 w-40 text-right">
                        {f.status === 'COMPLETED' ? (
                          <div className="flex items-center justify-end gap-2">
                            <MethodBadge method={f.method} />
                            <span className="text-gray-400">{f.round ? `R${f.round}` : ''} {f.time ?? ''}</span>
                          </div>
                        ) : (
                          <span className="text-blue-400">{f.status === 'LIVE' ? 'Uživo' : f.status === 'SCHEDULED' ? 'Zakazana' : f.status}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm">Nema unetih borbi za ovaj događaj.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* SEO: JSON-LD for SportsEvent */}
      {!isLoading && e ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'SportsEvent',
            name: e.name,
            startDate: e.startAt,
            eventStatus: e.status,
            location: {
              '@type': 'Place',
              name: `${e.city}, ${e.country}`,
              address: `${e.city}, ${e.country}`,
            },
          }}
        />
      ) : null}
    </Layout>
  );
}
