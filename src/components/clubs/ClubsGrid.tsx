'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UiClub } from './types';
import { ClubCard } from './ClubCard';

interface ClubsGridProps {
  clubs: UiClub[];
  isLoading: boolean;
  pagination: { page: number; totalPages: number } | null;
  page: number;
  setPage: (page: number | ((p: number) => number)) => void;
  prefetch: (url: string) => void;
}

export const ClubsGrid = ({ clubs, isLoading, pagination, page, setPage, prefetch }: ClubsGridProps) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.3 }}
    >
      <div className="text-center mb-8">
        <motion.h3 
          className="text-3xl font-bold text-white mb-2 flex items-center justify-center"
          animate={{
            textShadow: [
              '0 0 10px rgba(34, 211, 238, 0.5)',
              '0 0 20px rgba(34, 211, 238, 0.8)',
              '0 0 10px rgba(34, 211, 238, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-8 h-8 mr-3 text-cyan-500" />
          ELITNE AKADEMIJE
          <Zap className="w-8 h-8 ml-3 text-cyan-500" />
        </motion.h3>
        <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <div key={`sk-${i}`} className="glass-card p-8">
            <Skeleton className="h-6 w-20 mb-4" />
            <Skeleton className="h-7 w-64 mb-2" />
            <Skeleton className="h-4 w-40 mb-6" />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        ))}
        {!isLoading && clubs.map((club, index) => (
          <ClubCard key={club.id} club={club} index={index} prefetch={prefetch} />
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8 gap-4">
        <Button variant="outline" size="sm" disabled={isLoading || page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
          Prethodna
        </Button>
        <span className="text-gray-300 text-sm">
          Strana {pagination?.page ?? page} / {pagination?.totalPages ?? '—'}
        </span>
        <Button variant="outline" size="sm" disabled={isLoading || (pagination ? page >= pagination.totalPages : false)} onClick={() => setPage(p => p + 1)}>
          Sledeća
        </Button>
      </div>
    </motion.div>
  );
};
