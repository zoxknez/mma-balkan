'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export type Activity = {
  id: string;
  user: string;       // npr. "Stefan M."
  action: string;     // npr. "postavio predikciju za Rakić vs Błachowicz"
  timeAgo: string;    // npr. "upravo sada"
  timeISO?: string;   // npr. new Date().toISOString()
  hue?: number;       // 0-360 (opciono)
};

export function LiveActivity({ items }: { items: Activity[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        {/* header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg md:text-xl font-bold text-white">Aktivnost uživo</h2>
          </div>
          <Button variant="outline" size="sm" className="px-3 py-1 text-xs md:text-sm">
            Prikaži sve
          </Button>
        </div>

        {/* uži centralni stub */}
        <ul role="feed" aria-busy="false" className="mx-auto max-w-3xl space-y-2">
          {items.map((it, i) => (
            <li key={it.id} role="article" aria-label={`${it.user} ${it.action}`}>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="group relative rounded-xl px-4 py-3"
              >
                {/* hover podloga */}
                <span className="pointer-events-none absolute inset-0 rounded-xl bg-white/[0.04] opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative z-10 flex items-center justify-center gap-3 text-center">
                  {/* avatar 28–32px */}
                  <div
                    className="mt-0.5 grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white shadow"
                    style={{
                      background: `linear-gradient(135deg,
                        hsl(${it.hue ?? 170} 85% 55% / .95),
                        hsl(${(it.hue ?? 170) + 40} 85% 60% / .95))`,
                    }}
                    aria-hidden
                  >
                    {it.user.charAt(0)}
                  </div>

                  {/* tekst */}
                  <div className="max-w-[52ch]">
                    <p className="text-sm leading-tight text-white">
                      <span className="font-semibold text-emerald-400">{it.user}</span>{' '}
                      <span className="text-gray-400">{it.action}</span>
                    </p>
                    {it.timeISO ? (
                      <time
                        className="mt-1 block text-[11px] leading-none text-gray-400/80"
                        dateTime={it.timeISO}
                      >
                        {it.timeAgo}
                      </time>
                    ) : (
                      <span className="mt-1 block text-[11px] leading-none text-gray-400/80">
                        {it.timeAgo}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
