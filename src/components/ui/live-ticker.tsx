"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

type LiveEvent = {
  id: string;
  name: string;
  startAt: string;
  city?: string;
  country?: string;
};

export function LiveTicker() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [, setError] = useState<string | null>(null);
  // U dev koristimo relativne rute (Next rewrites), u prod apsolutni ako je postavljen
  const base = useMemo(() => (process.env.NODE_ENV === 'development' ? '' : (process.env['NEXT_PUBLIC_API_URL'] || '')), []);

  useEffect(() => {
    let mounted = true;
    let es: EventSource | null = null;
    let pollId: ReturnType<typeof setInterval> | null = null;

    const withTimeout = async <T,>(p: Promise<T>, ms = 3000): Promise<T> => {
      return await Promise.race([
        p,
        new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)) as Promise<T>,
      ]);
    };

    const healthCheck = async () => {
      try {
        const res = await withTimeout(fetch(`${base}/healthz`, { cache: 'no-store' }), 2000);
        return res.ok;
      } catch {
        return false;
      }
    };

    const startPolling = () => {
      const load = async () => {
        try {
          const res = await fetch(`${base}/api/events/live`, { cache: 'no-store' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          if (mounted) {
            setEvents(Array.isArray(json?.data) ? json.data : []);
            setError(null);
          }
        } catch (e) {
          if (mounted) setError((e as Error).message);
        }
      };
      load();
      pollId = setInterval(load, 30000);
    };

    const startSSE = () => {
      try {
        // Preferiraj dedicated SSE endpoint
        es = new EventSource(`${base}/api/events/live/stream`);
      es.addEventListener('hello', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data) as { data?: LiveEvent[] };
          if (mounted && payload?.data) setEvents(payload.data);
        } catch {}
      });
      es.addEventListener('tick', () => { /* heartbeat */ });
      es.onerror = () => {
        // Tihi fallback bez spamovanja konzole
        setError('SSE error');
        es?.close();
        // U dev okruženju pokušaj direktnu konekciju na backend ako proxy padne
        if (process.env.NODE_ENV === 'development') {
          try {
            const direct = new EventSource(`http://127.0.0.1:3003/api/events/live/stream`);
            direct.addEventListener('hello', (e: MessageEvent) => {
              try {
                const payload = JSON.parse(e.data) as { data?: LiveEvent[] };
                if (mounted && payload?.data) setEvents(payload.data);
              } catch {}
            });
            direct.addEventListener('tick', () => {});
            direct.onerror = () => {
              direct.close();
              startPolling();
            };
            es = direct;
            return;
          } catch {}
        }
        startPolling();
      };
      } catch {
        startPolling();
      }
    };

    // prvo health check, pa SSE ili odmah polling
    healthCheck().then((ok) => {
      if (!mounted) return;
      if (ok) startSSE(); else startPolling();
    });

    return () => {
      mounted = false;
      es?.close();
      if (pollId) clearInterval(pollId);
    };
  }, [base]);

  if (!events.length) return null;

  return (
    <div className="w-full border-b border-red-500/20 bg-black/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          UŽIVO
          <Zap className="w-4 h-4" />
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="whitespace-nowrap animate-[ticker_30s_linear_infinite]">
            {events.map((e, idx) => (
              <span key={e.id} className="inline-flex items-center text-gray-200 mr-8">
                <Link prefetch href={`/events/${e.id}`} className="hover:text-orange-300">
                  {e.name}
                </Link>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-gray-400">{new Date(e.startAt).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}</span>
                {idx < events.length - 1 && <span className="mx-4 text-gray-600">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
