'use client';

import { Layout } from '@/components/layout';
import { JsonLd } from '@/components/seo/JsonLd';
import { Event, Fighter, News, Fight } from '@/lib/types';
import { HeroSection } from './sections/HeroSection';
import { FeaturedEventSection } from './sections/FeaturedEventSection';
import { QuickStatsSection } from './sections/QuickStatsSection';
import { TrendingFightersSection } from './sections/TrendingFightersSection';
import { LatestNewsSection } from './sections/LatestNewsSection';
import { LiveActivitySection } from './sections/LiveActivitySection';

interface HomeClientProps {
  featuredEvent: Event & { fights?: Fight[] };
  trendingFighters: Fighter[];
  latestNews: News[];
}

export function HomeClient({ featuredEvent, trendingFighters, latestNews }: HomeClientProps) {
  return (
    <Layout>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        name: featuredEvent.name,
        sport: 'Mixed Martial Arts',
        startDate: featuredEvent.startAt.toString(),
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: featuredEvent.venue || 'TBA',
          address: {
            '@type': 'PostalAddress',
            addressLocality: featuredEvent.city,
            addressCountry: featuredEvent.country
          }
        },
        organizer: { '@type': 'Organization', name: 'MMA Balkan' }
      }} />
      
      <HeroSection featuredEvent={featuredEvent} />
      <FeaturedEventSection featuredEvent={featuredEvent} />
      <QuickStatsSection />
      <TrendingFightersSection trendingFighters={trendingFighters} />
      <LatestNewsSection latestNews={latestNews} />
      <LiveActivitySection />

    </Layout>
  );
}
