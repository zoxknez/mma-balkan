import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = ['', '/fighters', '/events', '/news', '/clubs', '/community'].map((p) => ({
    url: `${base}${p || '/'}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: p === '' ? 1 : 0.7,
  }));

  try {
    const [fightersRes, eventsRes, newsRes, clubsRes] = await Promise.all([
      fetch(`${api}/api/fighters?page=1&limit=1000`, { next: { revalidate: 3600 } }).then(r => r.json()).catch(() => null),
      fetch(`${api}/api/events?page=1&limit=1000`, { next: { revalidate: 3600 } }).then(r => r.json()).catch(() => null),
      fetch(`${api}/api/news?page=1&limit=1000`, { next: { revalidate: 3600 } }).then(r => r.json()).catch(() => null),
      fetch(`${api}/api/clubs?page=1&limit=1000`, { next: { revalidate: 3600 } }).then(r => r.json()).catch(() => null),
    ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [];
    if (fightersRes?.data) {
      for (const f of fightersRes.data as Array<{ id: string; updatedAt?: string }>) {
        dynamicRoutes.push({ url: `${base}/fighters/${f.id}`, lastModified: f.updatedAt ?? now, changeFrequency: 'weekly', priority: 0.6 });
      }
    }
    if (eventsRes?.data) {
      for (const e of eventsRes.data as Array<{ id: string; updatedAt?: string }>) {
        dynamicRoutes.push({ url: `${base}/events/${e.id}`, lastModified: e.updatedAt ?? now, changeFrequency: 'hourly', priority: 0.8 });
      }
    }
    if (newsRes?.data) {
      for (const n of newsRes.data as Array<{ id: string; updatedAt?: string }>) {
        dynamicRoutes.push({ url: `${base}/news/${n.id}`, lastModified: n.updatedAt ?? now, changeFrequency: 'daily', priority: 0.7 });
      }
    }
    if (clubsRes?.data) {
      for (const c of clubsRes.data as Array<{ id: string; updatedAt?: string }>) {
        dynamicRoutes.push({ url: `${base}/clubs/${c.id}`, lastModified: c.updatedAt ?? now, changeFrequency: 'monthly', priority: 0.4 });
      }
    }

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
