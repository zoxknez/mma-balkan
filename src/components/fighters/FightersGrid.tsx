'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FighterCard } from './fighter-card';
import { Fighter } from '@/lib/types';

interface FightersGridProps {
  fighters: Fighter[];
  isLoading: boolean;
}

export const FightersGrid = ({ fighters, isLoading }: FightersGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[400px] bg-slate-800/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {!isLoading && fighters.map((fighter) => (
          <FighterCard 
            key={fighter.id} 
            fighter={fighter} 
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
