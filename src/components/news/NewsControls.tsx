'use client';

import { motion } from 'framer-motion';
import { Target, Search, Filter, TrendingUp, Activity } from 'lucide-react';
import { SelectMenu, AnimatedCounter } from '@/components/ui/UIPrimitives';
import { CyberGrid } from '@/components/effects/ParticleSystem';
import { SortOption } from './types';

interface NewsControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  categories: string[];
  totalResults: number;
}

export function NewsControls({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
  totalResults
}: NewsControlsProps) {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="glass-card p-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-red-500/5" />
        <CyberGrid />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Target className="w-6 h-6 mr-3 text-orange-500" />
              Sistem za vesti
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
              <span className="text-orange-400 text-sm font-medium">UŽIVO</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pretraga */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-card p-4 border border-orange-400/30">
                <label className="flex items-center text-sm font-medium text-orange-400 mb-2">
                  <Search className="w-4 h-4 mr-2" />
                  Pretraga
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pretražuj vesti..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-gray-900/50 border border-orange-400/50 rounded-lg pl-4 pr-10 py-3 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all backdrop-blur-sm"
                  />
                  <motion.div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    animate={{ rotate: searchTerm ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Search className="w-5 h-5 text-orange-400" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Filter kategorija */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-card p-4 border border-red-400/30">
                <label className="flex items-center text-sm font-medium text-red-400 mb-2">
                  <Filter className="w-4 h-4 mr-2" />
                  Kategorija
                </label>
                <SelectMenu
                  value={selectedCategory}
                  onChange={onCategoryChange}
                  options={categories.map(cat => ({ value: cat, label: cat }))}
                  className="w-full"
                />
              </div>
            </motion.div>

            {/* Sortiranje */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-card p-4 border border-yellow-400/30">
                <label className="flex items-center text-sm font-medium text-yellow-400 mb-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Prioritet
                </label>
                <SelectMenu
                  value={sortBy}
                  onChange={(value) => onSortChange(value as SortOption)}
                  options={[
                    { value: 'date', label: 'Hronološki' },
                    { value: 'views', label: 'Po pregledima' },
                    { value: 'likes', label: 'Po sviđanjima' }
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
            <div className="inline-flex items-center space-x-2 glass-card px-6 py-3 border border-orange-400/30">
              <Activity className="w-5 h-5 text-orange-400" />
              <span className="text-white font-medium">
                Ukupno pronađenih vesti:
              </span>
              <span className="text-orange-400 font-bold text-xl">
                <AnimatedCounter value={totalResults} />
              </span>
              <span className="text-gray-400">članaka</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
