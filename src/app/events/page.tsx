'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { useEvents } from '@/hooks/useEvents';
import { usePathname, useRouter } from 'next/navigation';
import { usePrefetch } from '@/lib/prefetch';
import { EventsHeader } from '@/components/events/EventsHeader';
import { EventsControls } from '@/components/events/EventsControls';
import { EventsGrid } from '@/components/events/EventsGrid';
import { NoEvents } from '@/components/events/NoEvents';
import { EventCardProps } from '@/components/events/EventCard';

type UiEvent = EventCardProps['event'];

export default function EventsPage() {
  const prefetch = usePrefetch();
  const router = useRouter();
  const pathname = usePathname();
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'venue'>('date');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  type BackendStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  const toBackendStatus = (s: typeof filterStatus): BackendStatus | undefined => {
    switch (s) {
      case 'live': return 'LIVE';
      case 'completed': return 'COMPLETED';
      case 'upcoming': return 'SCHEDULED';
      default: return undefined;
    }
  };

  const { data: apiEvents, isLoading, pagination } = useEvents({ page, limit, status: toBackendStatus(filterStatus) });

  const mapStatus = (s?: string): UiEvent['status'] => {
    switch (s) {
      case 'LIVE': return 'live';
      case 'COMPLETED': return 'completed';
      case 'CANCELLED': return 'cancelled';
      case 'UPCOMING':
      case 'SCHEDULED':
      default: return 'upcoming';
    }
  };

  type ApiEvent = { id: string; name: string; startAt?: string; status?: string; city: string; mainEvent?: string | null; fightsCount?: number; attendees?: number | null };
  const events: UiEvent[] = (apiEvents as ApiEvent[] || []).map((e) => {
    const d = e.startAt ? new Date(e.startAt) : new Date(NaN);
    const date = isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
    const time = isNaN(d.getTime()) ? '' : d.toISOString().slice(11, 16);
    return {
      id: e.id,
      name: e.name,
      city: e.city,
      mainEvent: e.mainEvent ?? null,
      status: mapStatus(e.status),
      fights: e.fightsCount ?? 0,
      attendees: e.attendees ?? null,
      date,
      time,
    };
  });

  const filteredEvents = events
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'venue':
          return a.city.localeCompare(b.city);
        default:
          return 0;
      }
    });

  // Initialize state from URL (client-only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = (params.get('status') as 'all' | 'upcoming' | 'live' | 'completed' | null) || 'all';
    const sort = (params.get('sort') as 'date' | 'name' | 'venue' | null) || 'date';
    const p = Number(params.get('page') || '1') || 1;
    setFilterStatus(status);
    setSortBy(sort);
    setPage(p);
  }, []);

  // Sync state to URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (filterStatus !== 'all') sp.set('status', filterStatus);
    if (sortBy !== 'date') sp.set('sort', sortBy);
    if (page > 1) sp.set('page', String(page));
    router.replace(`${pathname}?${sp.toString()}`);
  }, [filterStatus, sortBy, page, router, pathname]);

  // Scroll to top on page change
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra-Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>
        
        {/* Floating Event Elements */}
        <div className="absolute top-24 left-8 opacity-10">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <Calendar className="w-40 h-40 text-purple-500" />
          </motion.div>
        </div>
        <div className="absolute bottom-24 right-8 opacity-10">
          <motion.div
            animate={{ rotate: -360, y: [-10, 10, -10] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Trophy className="w-36 h-36 text-blue-500" />
          </motion.div>
        </div>
        
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <EventsHeader 
              totalEvents={filteredEvents.length}
              liveEvents={filteredEvents.filter(e => e.status === 'live').length}
              upcomingEvents={filteredEvents.filter(e => e.status === 'upcoming').length}
              totalAttendees={filteredEvents.reduce((sum, e) => sum + (e.attendees ?? 0), 0)}
            />

            <EventsControls
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              resultsCount={filteredEvents.length}
            />

            {filteredEvents.length > 0 || isLoading ? (
              <EventsGrid 
                events={filteredEvents} 
                isLoading={isLoading} 
                pagination={pagination}
                page={page}
                setPage={setPage}
                onPrefetch={(id) => prefetch(`/events/${id}`)}
              />
            ) : (
              <NoEvents 
                onReset={() => {
                  setFilterStatus('all');
                  setSortBy('date');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
