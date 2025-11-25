'use client';

import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { Button } from '@/components/ui/button';
import { useFighter } from '@/hooks/useFighter';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Activity, Sword, Shield, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useFighterHistory, useFighterUpcoming } from '@/hooks/useFights';
import { MethodBadge } from '@/components/fights/MethodBadge';
import { prettyStance, prettyWeightClass } from '@/lib/utils';
import { ShareButton } from '@/components/ui/share-button';
import Link from 'next/link';
import { usePrefetch } from '@/lib/prefetch';
import { WatchlistButton } from '@/components/ui/watchlist-button';
import { JsonLd } from '@/components/seo/JsonLd';

export default function FighterDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { data: f, isLoading } = useFighter(id);
  const { data: history = [], isLoading: loadingHistory } = useFighterHistory(id);
  const { data: upcoming = [], isLoading: loadingUpcoming } = useFighterUpcoming(id);
  const prefetch = usePrefetch();

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>

        <div className="relative z-10 px-6 py-8 max-w-6xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Nazad
            </Button>
            <ShareButton title="Podeli profil borca" />
            {id ? <WatchlistButton entity={{ type: 'fighter', id }} /> : null}
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8 relative overflow-hidden"
          >
            <CyberGrid />
            <div className="relative z-10">
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-7 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ) : f ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {f.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white">{f.name}{f.nickname ? ` "${f.nickname}"` : ''}</h1>
                    <div className="text-gray-300 text-sm flex items-center gap-3 mt-1">
                      <MapPin className="w-4 h-4 text-blue-400" /> {f.country}
                      <span>•</span>
                      <Sword className="w-4 h-4 text-red-400" /> {prettyWeightClass(String(f.weightClass))}
                      {f.stance ? (<><span>•</span><Shield className="w-4 h-4 text-green-400" /> {prettyStance(String(f.stance))}</>) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Nije pronađen borac.</div>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)
            ) : f ? (
              <>
                <div className="glass-card p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{f.wins}-{f.losses}-{f.draws}</div>
                  <div className="text-gray-400 text-sm mt-1">Profesionalni skor</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5" /> {f.koTkoWins ?? 0} / {f.submissionWins ?? 0} / {f.decisionWins ?? 0}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">KO / SUB / DEC pobede</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5" /> {f.isActive ? 'Aktivan' : 'Neaktivan'}
                  </div>
                  <div className="text-gray-400 text-xs mt-1 flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" /> Poslednja borba: {f.lastFight ? new Date(f.lastFight).toLocaleDateString('sr-RS') : '—'}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Bio and physicals */}
          {!isLoading && f && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-3">Fizičke karakteristike</h2>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                  <div>Visina: <span className="text-white font-medium">{f.heightCm ? `${f.heightCm} cm` : '—'}</span></div>
                  <div>Težina: <span className="text-white font-medium">{f.weightKg ? `${f.weightKg} kg` : '—'}</span></div>
                  <div>Raspon ruku: <span className="text-white font-medium">{f.reachCm ? `${f.reachCm} cm` : '—'}</span></div>
                  <div>Država: <span className="text-white font-medium">{f.country}</span></div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-3">Karijera</h2>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                  <div>Debi: <span className="text-white font-medium">—</span></div>
                  <div>Organizacije: <span className="text-white font-medium">—</span></div>
                  <div>Rejting: <span className="text-white font-medium">—</span></div>
                  <div>Aktivnost: <span className="text-white font-medium">{f.isActive ? 'Aktivan' : 'Neaktivan'}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Fights */}
          {!isLoading && f && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-white font-semibold mb-3">Naredne borbe</h2>
                <div className="glass-card p-4">
                  {loadingUpcoming ? (
                    <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8" />)}</div>
                  ) : upcoming.length ? (
                    <ul className="divide-y divide-white/5">
                      {upcoming.map((fi) => (
                        <li key={fi.id} className="py-2 flex items-center justify-between text-sm text-gray-200">
                          <span className="text-white">
                            {fi.redFighter?.id ? (
                              <Link href={`/fighters/${fi.redFighter.id}`} className="hover:text-orange-300" onMouseEnter={() => prefetch(`/fighters/${fi.redFighter!.id}`)}>{fi.redFighter.name}</Link>
                            ) : 'Biće objavljeno'}
                            <span className="text-gray-400"> vs </span>
                            {fi.blueFighter?.id ? (
                              <Link href={`/fighters/${fi.blueFighter.id}`} className="hover:text-orange-300" onMouseEnter={() => prefetch(`/fighters/${fi.blueFighter!.id}`)}>{fi.blueFighter.name}</Link>
                            ) : 'Biće objavljeno'}
                          </span>
                          <span className="text-xs text-gray-400">{fi.weightClass ? prettyWeightClass(String(fi.weightClass)) : 'Bez kategorije'}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-400 text-sm">Nema zakazanih borbi.</div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-white font-semibold mb-3">Istorija borbi</h2>
                <div className="glass-card p-4">
                  {loadingHistory ? (
                    <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8" />)}</div>
                  ) : history.length ? (
                    <ul className="divide-y divide-white/5">
                      {history.map((fi) => (
                        <li key={fi.id} className="py-2 flex items-center justify-between text-sm text-gray-200">
                          <span className="text-white">{fi.redFighter?.name} <span className="text-gray-400">vs</span> {fi.blueFighter?.name}</span>
                          <span className="text-xs text-gray-300 inline-flex items-center gap-2">
                            <MethodBadge method={fi.method || null} />
                            <span className="text-gray-400">{fi.round ? `R${fi.round}` : ''} {fi.time ?? ''}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-400 text-sm">Nema zabeleženih borbi.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* SEO: Person JSON-LD */}
      {!isLoading && f ? (
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: f.name,
          nationality: f.country,
          athlete: true,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        }} />
      ) : null}
    </Layout>
  );
}

