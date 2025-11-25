'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Search, Filter, TrendingUp } from 'lucide-react';
import { SelectMenu } from '@/components/ui/UIPrimitives';
import { CyberGrid } from '@/components/effects/ParticleSystem';
import { SortOption } from './types';

interface CommunityControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

export const CommunityControls = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy
}: CommunityControlsProps) => {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
    >
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-purple-500/5" />
        <CyberGrid />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Target className="w-6 h-6 mr-3 text-pink-500" />
              Kontrola feeda
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
              <span className="text-pink-400 text-sm font-medium">UŽIVO</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Neural Search */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-card p-4 border border-pink-400/30">
                <label className="flex items-center text-sm font-medium text-pink-400 mb-2">
                  <Search className="w-4 h-4 mr-2" />
                  Pretraga
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pretražuj postove..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900/50 border border-pink-400/50 rounded-lg pl-4 pr-10 py-3 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all backdrop-blur-sm"
                  />
                  <motion.div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    animate={{ rotate: searchTerm ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Search className="w-5 h-5 text-pink-400" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Post Type Filter */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-card p-4 border border-purple-400/30">
                <label className="flex items-center text-sm font-medium text-purple-400 mb-2">
                  <Filter className="w-4 h-4 mr-2" />
                  Vrsta sadržaja
                </label>
                <SelectMenu
                  value={selectedType}
                  onChange={(value) => setSelectedType(value)}
                  options={[
                    { value: 'Sve', label: 'Sve' },
                    { value: 'post', label: '💬 Postovi' },
                    { value: 'analysis', label: '📊 Analize' },
                    { value: 'tip', label: '💡 Saveti' },
                    { value: 'announcement', label: '📢 Objave' },
                    { value: 'workout', label: '💪 Treninzi' }
                  ]}
                  className="w-full"
                />
              </div>
            </motion.div>

            {/* Sort Algorithm */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-card p-4 border border-red-400/30">
                <label className="flex items-center text-sm font-medium text-red-400 mb-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Sortiranje
                </label>
                <SelectMenu
                  value={sortBy}
                  onChange={(value) => setSortBy(value as SortOption)}
                  options={[
                    { value: 'timestamp', label: 'Najnovije' },
                    { value: 'likes', label: 'Po lajkovima' },
                    { value: 'comments', label: 'Po komentarima' }
                  ]}
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
