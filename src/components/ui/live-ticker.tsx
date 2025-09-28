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
  // Errors are silently ignored in UI; could be surfaced to a toast if desired
  const [, setError] = useState<string | null>(null);
  const api = useMemo(() => process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003", []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${api}/api/events/live`, { cache: "no-store" });
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
    const id = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [api]);

  if (!events.length) return null;

  return (
    <div className="w-full border-b border-red-500/20 bg-black/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          LIVE
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
