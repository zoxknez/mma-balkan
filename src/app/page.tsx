import { HomeClient } from '@/components/home/HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MMA Balkan — Početna',
  description: 'Najnovije vesti, rezultati i statistike sa Balkanske MMA scene.',
};

async function getData() {
  const API_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3003';
  
  try {
    // Fetch in parallel
    const [eventRes, fightersRes, newsRes] = await Promise.allSettled([
      fetch(`${API_URL}/api/events/featured`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/api/fighters/trending`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/news/latest?limit=3`, { next: { revalidate: 300 } })
    ]);

    const featuredEvent = eventRes.status === 'fulfilled' && eventRes.value.ok 
      ? (await eventRes.value.json()).data 
      : { 
          id: 'mock-event', 
          name: 'SBC 45: Rakić vs. Błachowicz II', 
          startAt: '2025-12-15T19:00:00+01:00',
          city: 'Beograd',
          country: 'Srbija',
          venue: 'Stark Arena'
        };

    const trendingFighters = fightersRes.status === 'fulfilled' && fightersRes.value.ok
      ? (await fightersRes.value.json()).data
      : [
          { name: 'Miloš Terzić', wins: 12, losses: 2, draws: 0, country: 'Srbija' },
          { name: 'Ana Bajić', wins: 8, losses: 1, draws: 0, country: 'Srbija' },
          { name: 'Marko Petrović', wins: 15, losses: 4, draws: 1, country: 'Crna Gora' }
        ];

    const latestNews = newsRes.status === 'fulfilled' && newsRes.value.ok
      ? (await newsRes.value.json()).data
      : [
          {
            title: "Rakić spreman za revanš protiv Błachowicza",
            excerpt: "Aleksandar Rakić završio je intenzivnu pripremu u Austriji...",
            publishAt: new Date().toISOString(),
            category: "Najave"
          },
          {
            title: "Nova MMA promocija stiže u Zagreb",
            excerpt: "Croatian Fighting Championship najavljuje spektakularni turnir...",
            publishAt: new Date().toISOString(),
            category: "Organizacije"
          },
          {
            title: "Jovana Jędrzejczyk planira povratak",
            excerpt: "Poljska legenda razmišlja o povratku u oktagon...",
            publishAt: new Date().toISOString(),
            category: "Borci"
          }
        ];

    return { featuredEvent, trendingFighters, latestNews };
  } catch (error) {
    console.error('Error fetching home data:', error);
    // Return fallback data
    return {
      featuredEvent: { 
        id: 'mock-event', 
        name: 'SBC 45: Rakić vs. Błachowicz II', 
        startAt: '2025-12-15T19:00:00+01:00',
        city: 'Beograd',
        country: 'Srbija',
        venue: 'Stark Arena'
      },
      trendingFighters: [],
      latestNews: []
    };
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <HomeClient 
      featuredEvent={data.featuredEvent}
      trendingFighters={data.trendingFighters}
      latestNews={data.latestNews}
    />
  );
}