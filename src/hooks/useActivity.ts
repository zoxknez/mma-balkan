"use client";
import { useEffect, useMemo, useState } from 'react';

export type ActivityItem = {
  id: string;
  user: string;
  action: string;
  timeAgo: string;
  timeISO?: string;
};

export function useActivity() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const base = useMemo(() => (process.env.NODE_ENV === 'development' ? '' : (process.env.NEXT_PUBLIC_API_URL || '')), []);

  useEffect(() => {
    let mounted = true;
    let es: EventSource | null = null;
    let pollId: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      const load = async () => {
        try {
          const res = await fetch(`${base}/api/activity/recent`, { cache: 'no-store' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          if (mounted && Array.isArray(json?.data)) setItems(json.data);
        } catch {}
      };
      load();
      pollId = setInterval(load, 30000);
    };

    try {
      es = new EventSource(`${base}/api/activity/stream`);
      es.addEventListener('hello', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data) as { data?: ActivityItem[] };
          if (mounted && payload?.data) setItems(payload.data);
        } catch {}
      });
      es.addEventListener('activity', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data) as { data?: ActivityItem };
          if (mounted && payload?.data) setItems(prev => [payload.data!, ...prev].slice(0, 20));
        } catch {}
      });
      es.onerror = () => {
        es?.close();
        if (process.env.NODE_ENV === 'development') {
          try {
            const direct = new EventSource(`http://127.0.0.1:3003/api/activity/stream`);
            direct.addEventListener('hello', (e: MessageEvent) => {
              try {
                const payload = JSON.parse(e.data) as { data?: ActivityItem[] };
                if (mounted && payload?.data) setItems(payload.data);
              } catch {}
            });
            direct.addEventListener('activity', (e: MessageEvent) => {
              try {
                const payload = JSON.parse(e.data) as { data?: ActivityItem };
                if (mounted && payload?.data) setItems(prev => [payload.data!, ...prev].slice(0, 20));
              } catch {}
            });
            direct.onerror = () => { direct.close(); startPolling(); };
            es = direct;
            return;
          } catch {}
        }
        startPolling();
      };
    } catch {
      startPolling();
    }

    return () => {
      mounted = false;
      es?.close();
      if (pollId) clearInterval(pollId);
    };
  }, [base]);

  return items;
}
