'use client';

import { Layout } from '@/components/layout';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { useParams, useRouter } from 'next/navigation';
import { useClub } from '@/hooks/useClub';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Globe, Phone, Users, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MapEmbed } from '@/components/ui/map-embed';
import { WatchlistButton } from '@/components/ui/watchlist-button';

export default function ClubDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { data: club, isLoading } = useClub(id);

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>

        <div className="relative z-10 px-6 py-8 max-w-5xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Nazad
            </Button>
            {id ? <WatchlistButton entity={{ type: 'club', id }} /> : null}
          </div>

          <div className="glass-card p-6 relative overflow-hidden">
            <CyberGrid />
            <div className="relative z-10">
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-64" />
                </div>
              ) : club ? (
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{club.name}</h1>
                  <div className="text-gray-300 text-sm flex items-center gap-4 mb-6">
                    <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" /> {club.city}, {club.country}</span>
                    {club.members != null && (
                      <span className="inline-flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> {club.members} članova</span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card p-4">
                      <h2 className="text-white font-semibold mb-3">Kontakt</h2>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-cyan-400" />
                          {club.phone ? (
                            <a href={`tel:${club.phone}`} className="text-white hover:text-cyan-300 transition-colors">{club.phone}</a>
                          ) : '—'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          {club.website ? (
                            <a href={club.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-white hover:text-blue-300 transition-colors">
                              {club.website}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : '—'}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-400" />
                          <span>{club.address ?? '—'}</span>
                        </div>
                        {(() => {
                          const full = club.address || [club.name, club.city, club.country].filter(Boolean).join(', ');
                          const hasLoc = Boolean(full);
                          const mapsUrl = hasLoc ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}` : undefined;
                          return hasLoc ? (
                            <div className="pt-2">
                              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
                                <Button variant="outline" size="sm">Otvori u mapama</Button>
                              </a>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>
                    <div className="glass-card p-4">
                      <h2 className="text-white font-semibold mb-3">Opis</h2>
                      <p className="text-gray-300 text-sm">Informacije o klubu će uskoro biti dostupne.</p>
                    </div>
                    <div className="md:col-span-2 glass-card p-4">
                      <h2 className="text-white font-semibold mb-3">Mapa</h2>
                      {(() => {
                        const full = club.address || [club.name, club.city, club.country].filter(Boolean).join(', ');
                        return full ? <MapEmbed query={full} height={300} /> : <div className="text-gray-400 text-sm">Adresa nije dostupna.</div>;
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Klub nije pronađen.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
