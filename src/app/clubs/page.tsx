'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { useClubs } from '@/hooks/useClubs';
import { useRouter, usePathname } from 'next/navigation';
import { usePrefetch } from '@/lib/prefetch';
import { ClubsHeader } from '@/components/clubs/ClubsHeader';
import { ClubsStats } from '@/components/clubs/ClubsStats';
import { ClubsControls } from '@/components/clubs/ClubsControls';
import { ClubsGrid } from '@/components/clubs/ClubsGrid';
import { NoResults } from '@/components/clubs/NoResults';
import { UiClub, SortOption } from '@/components/clubs/types';

export default function ClubsPage() {
  const prefetch = usePrefetch();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCountry, setSelectedCountry] = useState('Sve');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Sve');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const { data: apiClubs, pagination, isLoading } = useClubs({
    page,
    limit,
    search: searchTerm || undefined,
    country: selectedCountry === 'Sve' ? undefined : selectedCountry,
  } as Parameters<typeof useClubs>[0]);

  type ApiClub = { id: string; name: string; city: string; country: string; members?: number | null };
  const clubs: UiClub[] = ((apiClubs as ApiClub[]) || []).map((c) => ({ id: c.id, name: c.name, city: c.city, country: c.country, members: c.members ?? null }));

  const filteredClubs = clubs
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return (b.members ?? 0) - (a.members ?? 0);
        case 'rating':
          return 0; // backend nema rating za sada
        case 'founded':
          return 0; // backend nema founded za sada
        default:
          return 0;
      }
    });

  // Initialize state from URL (client-only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    const country = params.get('country') || 'Sve';
    const sort = (params.get('sort') as SortOption | null) || 'rating';
    const p = Number(params.get('page') || '1') || 1;
    setSearchTerm(q);
    setSelectedCountry(country);
    setSortBy(sort);
    setPage(p);
  }, []);

  // Sync state to URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (searchTerm) sp.set('q', searchTerm);
    if (selectedCountry !== 'Sve') sp.set('country', selectedCountry);
    if (sortBy !== 'rating') sp.set('sort', sortBy);
    if (page > 1) sp.set('page', String(page));
    router.replace(`${pathname}?${sp.toString()}`);
  }, [searchTerm, selectedCountry, sortBy, page, router, pathname]);

  // Scroll to top on page change
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <Layout>
      <div className='min-h-screen relative overflow-hidden'>
        {/* Ultra-Futuristic Background */}
        <div className='absolute inset-0 bg-gradient-to-br from-cyan-900 via-gray-900 to-black'>
          <ParticleSystem className='absolute inset-0' />
          <CyberGrid />
        </div>
        
        {/* Floating Club Elements */}
        <div className='absolute top-16 left-16 opacity-10'>
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.4, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            <Shield className='w-48 h-48 text-cyan-500' />
          </motion.div>
        </div>
        <div className='absolute bottom-20 right-16 opacity-10'>
          <motion.div
            animate={{ rotate: -360, y: [-20, 20, -20] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <Users className='w-44 h-44 text-blue-500' />
          </motion.div>
        </div>
        
        <div className='relative z-10 px-6 py-8'>
          <div className='max-w-7xl mx-auto'>
            <ClubsHeader />
            
            <ClubsStats clubs={clubs} filteredCount={filteredClubs.length} />

            <ClubsControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={setSelectedSpecialty}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filteredCount={filteredClubs.length}
            />

            {filteredClubs.length > 0 || isLoading ? (
              <ClubsGrid 
                clubs={filteredClubs} 
                isLoading={isLoading} 
                pagination={pagination || null} 
                page={page} 
                setPage={setPage} 
                prefetch={prefetch}
              />
            ) : (
              <NoResults 
                onReset={() => {
                  setSelectedCountry('Sve');
                  setSelectedSpecialty('Sve');
                  setSearchTerm('');
                  setSortBy('rating');
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
