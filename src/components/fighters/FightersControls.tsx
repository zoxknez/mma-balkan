'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface FightersControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedWeightClass: string;
  setSelectedWeightClass: (weightClass: string) => void;
  sortBy: 'rank' | 'name' | 'wins';
  setSortBy: (sort: 'rank' | 'name' | 'wins') => void;
  weightClasses: string[];
}

export const FightersControls = ({
  searchQuery,
  setSearchQuery,
  selectedWeightClass,
  setSelectedWeightClass,
  sortBy,
  setSortBy,
  weightClasses
}: FightersControlsProps) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          data-testid="fighters-search"
          type="text"
          placeholder="Pretraži borce..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
        />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
        <div className="relative min-w-[160px]">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            data-testid="weight-filter"
            value={selectedWeightClass}
            onChange={(e) => setSelectedWeightClass(e.target.value)}
            className="w-full pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white appearance-none focus:outline-none focus:border-green-500 cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <option value="all">Sve kategorije</option>
            {weightClasses.map(wc => (
              <option key={wc} value={wc}>{wc}</option>
            ))}
          </select>
        </div>

        <div className="relative min-w-[160px]">
          <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            data-testid="sort-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rank' | 'name' | 'wins')}
            className="w-full pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white appearance-none focus:outline-none focus:border-green-500 cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <option value="rank">Po rangu</option>
            <option value="name">Po imenu</option>
            <option value="wins">Po pobjedama</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};
