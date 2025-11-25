'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { BarChart, AnimatedCounter } from '@/components/data-viz/Charts';
import { useRealtimeFighters, useRealtimeEvents } from '@/lib/realtime';
import { userGrowthData } from '../data';

export const AnalyticsTab = () => {
  // Real-time data
  const fightersData = useRealtimeFighters();
  const eventsData = useRealtimeEvents();

  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      <InteractiveCard
        title="Rast Korisnika"
        description="Mesečni rast broja korisnika"
        className="p-6"
      >
        <BarChart
          data={userGrowthData}
          width={800}
          height={300}
          showValues
        />
      </InteractiveCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InteractiveCard
          title="Real-time Borci"
          description="Live ažuriranja boraca"
          className="p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status konekcije:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                fightersData.connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {fightersData.connectionStatus === 'connected' ? 'Povezan' : 'Nije povezan'}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={fightersData.fighters.length} />
            </div>
            <p className="text-gray-400">Boraca učitano</p>
          </div>
        </InteractiveCard>

        <InteractiveCard
          title="Real-time Događaji"
          description="Live ažuriranja događaja"
          className="p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status konekcije:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                eventsData.connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {eventsData.connectionStatus === 'connected' ? 'Povezan' : 'Nije povezan'}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={eventsData.events.length} />
            </div>
            <p className="text-gray-400">Događaja učitano</p>
          </div>
        </InteractiveCard>
      </div>
    </motion.div>
  );
};
