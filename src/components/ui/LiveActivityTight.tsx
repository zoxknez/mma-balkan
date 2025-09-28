'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export type Activity = {
  id: string;
  user: string;      // "Stefan M."
  action: string;    // "postavio predikciju za Rakić vs Błachowicz"
  timeAgo: string;   // "upravo sada"
  timeISO?: string;  // new Date().toISOString()
};

const initials = (name: string) =>
  name.trim().split(/\s+/).map(p => p[0]?.toUpperCase()).join('').slice(0, 2) || 'U';

const hueFromString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h; // 0–359
};

export function LiveActivityTight({ items }: { items: Activity[] }) {
  return (
    <section className="px-4">
      {/* SUZENO: max-w-2xl (po želji 3xl) */}
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] shadow-sm overflow-hidden">
        {/* header – kompaktan */}
        <div className="flex items-center justify-between px-4 py-3 md:px-5 md:py-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-base md:text-lg font-bold text-white">Aktivnost uživo</h2>
          </div>
          <Button variant="outline" size="sm" className="px-3 py-1 text-xs md:text-sm">
            Prikaži sve
          </Button>
        </div>

        {/* lista – kompaktni redovi + suptilan divider */}
        <ul role="feed" aria-busy="false" className="divide-y divide-white/5">
          {items.map((it, i) => {
            const hue = hueFromString(it.user);
            return (
              <li key={it.id} role="article" aria-label={`${it.user} ${it.action}`}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="group relative flex items-start gap-3 px-4 py-3 md:px-5 md:py-3.5"
                >
                  {/* avatar 32px, čist gradijent */}
                  <div
                    className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white shadow-sm"
                    style={{
                      background: `linear-gradient(135deg,
                        hsl(${hue} 85% 55% / .95),
                        hsl(${(hue + 40) % 360} 85% 60% / .95))`,
                    }}
                    aria-hidden
                  >
                    {initials(it.user)}
                  </div>

                  {/* tekst */}
                  <div className="flex-1">
                    <p className="text-[13px] md:text-sm leading-tight text-white">
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
                      <span className="mt-1 block text-[11px] leading-none text-gray-400/80">{it.timeAgo}</span>
                    )}
                  </div>

                  {/* suptilan hover highlight bez “balona” */}
                  <span className="pointer-events-none absolute inset-0 rounded-none bg-white/[0.035] opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
