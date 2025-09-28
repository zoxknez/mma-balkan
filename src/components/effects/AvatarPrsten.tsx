'use client';
import { memo } from 'react';

function initials(name: string) {
  return name.trim().split(/\s+/).map(n => n[0]?.toUpperCase()).join('').slice(0,3) || 'MM';
}

type Props = { name: string; wins: number; losses: number; className?: string };

const AvatarPrsten = memo(function Avatar({ name, wins, losses, className }: Props) {
  return (
    <div className={`relative w-32 h-32 md:w-40 md:h-40 mx-auto ${className ?? ''}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/15 to-cyan-500/15 border border-emerald-400/35 holo-ring will-change-[opacity]" />
      <div className="absolute inset-2 rounded-full border border-cyan-400/25 opacity-80" />
      <div className="pointer-events-none absolute -inset-1 rounded-full holo-halo ring-1 ring-emerald-400/25" />
      <div className="absolute inset-4 rounded-full bg-gray-900/80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-extrabold text-white leading-none">{initials(name)}</div>
          <div className="mt-1 text-[11px] font-bold text-emerald-400">{wins}-{losses}</div>
        </div>
      </div>
    </div>
  );
});

export default AvatarPrsten;
