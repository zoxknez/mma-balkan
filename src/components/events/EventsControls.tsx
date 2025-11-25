'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Filter, Calendar, Activity } from 'lucide-react';
import { SelectMenu, AnimatedCounter } from '@/components/ui/UIPrimitives';
import { CyberGrid } from '@/components/effects/ParticleSystem';

interface EventsControlsProps {
  filterStatus: 'all' | 'upcoming' | 'live' | 'completed';
  setFilterStatus: (status: 'all' | 'upcoming' | 'live' | 'completed') => void;
  sortBy: 'date' | 'name' | 'venue';
  setSortBy: (sort: 'date' | 'name' | 'venue') => void;
  resultsCount: number;
}

export const EventsControls = ({
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  resultsCount
}: EventsControlsProps) => {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="glass-card p-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
        <CyberGrid />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Target className="w-6 h-6 mr-3 text-purple-500" />
              Kontrola događaja
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-purple-400 text-sm font-medium">UŽIVO</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Filter */}
            <motion.div 
              data-testid="filter-status"
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-card p-4 border border-purple-400/30">
                <label className="flex items-center text-sm font-medium text-purple-400 mb-2">
                  <Filter className="w-4 h-4 mr-2" />
                  Status događaja
                </label>
                <SelectMenu
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value as 'all' | 'upcoming' | 'live' | 'completed')}
                  options={[
                    { value: 'all', label: 'Svi događaji' },
                    { value: 'upcoming', label: 'Nadolazeći' },
                    { value: 'live', label: 'Uživo' },
                    { value: 'completed', label: 'Završeni' }
                  ]}
                  className="w-full"
                />
              </div>
            </motion.div>

            {/* Sort Algorithm */}
            <motion.div 
              data-testid="sort-dropdown"
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-card p-4 border border-blue-400/30">
                <label className="flex items-center text-sm font-medium text-blue-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Sortiranje
                </label>
                <SelectMenu
                  value={sortBy}
                  onChange={(value) => setSortBy(value as 'date' | 'name' | 'venue')}
                  options={[
                    { value: 'date', label: 'Hronološki' },
                    { value: 'name', label: 'Po nazivu' },
                    { value: 'venue', label: 'Po gradu' }
                  ]}
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
          
          {/* Results Counter */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="inline-flex items-center space-x-2 glass-card px-6 py-3 border border-purple-400/30">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">
                Broj pronađenih događaja: 
              </span>
              <span className="text-purple-400 font-bold text-xl">
                <AnimatedCounter value={resultsCount} />
              </span>
              <span className="text-gray-400">događaja</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
