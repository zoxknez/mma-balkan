'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useActivity } from '@/hooks/useActivity';

const LiveActivityTight = dynamic(() => import('@/components/ui/LiveActivityTight').then(mod => ({ default: mod.LiveActivityTight })), {
  loading: () => <div className="h-64 animate-pulse bg-gray-800/30 rounded-2xl" />,
});

export function LiveActivitySection() {
  const activity = useActivity();

  return (
    <motion.div
      data-testid="live-activity"
      className="mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {activity.length ? (
          <LiveActivityTight items={activity} />
        ) : (
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-gray-400">
            Trenutno nema novih aktivnosti.
          </div>
        )}
      </div>
    </motion.div>
  );
}
