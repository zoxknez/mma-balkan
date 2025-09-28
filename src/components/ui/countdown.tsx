"use client";
import { useEffect, useMemo, useState } from 'react';

function format(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [
    d > 0 ? `${d}d` : null,
    `${h.toString().padStart(2, '0')}h`,
    `${m.toString().padStart(2, '0')}m`,
    `${sec.toString().padStart(2, '0')}s`,
  ].filter(Boolean);
  return parts.join(' ');
}

export function Countdown({ startAt }: { startAt: string }) {
  const target = useMemo(() => new Date(startAt).getTime(), [startAt]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = target - now;
  if (!isFinite(target)) return null;
  const isPast = diff <= 0;
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      {isPast ? (
        <span className="text-red-400">LIVE / STARTED</span>
      ) : (
        <>
          <span className="text-gray-400">Počinje za:</span>
          <span className="text-purple-400 font-semibold">{format(diff)}</span>
        </>
      )}
    </div>
  );
}
