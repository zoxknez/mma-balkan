"use client";
import { cn, prettyFinishMethod } from '@/lib/utils';
import { Trophy, Zap, CircleSlash, Activity } from 'lucide-react';

export function MethodBadge({ method }: { method?: string | null }) {
  const m = (method || '').toUpperCase();
  const cfg =
    m.includes('KO') || m.includes('TKO')
      ? { color: 'text-red-400 border-red-500/30 bg-red-500/10', Icon: Zap, label: method }
      : m.includes('SUB')
      ? { color: 'text-green-400 border-green-500/30 bg-green-500/10', Icon: Activity, label: method }
      : m.includes('DEC')
      ? { color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10', Icon: Trophy, label: method }
      : m.includes('NC')
      ? { color: 'text-gray-400 border-gray-500/30 bg-gray-500/10', Icon: CircleSlash, label: method }
  : { color: 'text-blue-400 border-blue-500/30 bg-blue-500/10', Icon: Activity, label: method || 'Ishod' };

  const { color, Icon, label } = cfg;
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border', color)}>
      <Icon className="w-3.5 h-3.5" />
      {prettyFinishMethod(String(label))}
    </span>
  );
}
