'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Search, MapPin, Filter, Trophy, Activity } from 'lucide-react';
import { SelectMenu, AnimatedCounter } from '@/components/ui/UIPrimitives';
import { CyberGrid } from '@/components/effects/ParticleSystem';
import { SortOption, countries, specialties } from './types';

interface ClubsControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  filteredCount: number;
}

export const ClubsControls = ({
  searchTerm,
  setSearchTerm,
  selectedCountry,
  setSelectedCountry,
  selectedSpecialty,
  setSelectedSpecialty,
  sortBy,
  setSortBy,
  filteredCount
}: ClubsControlsProps) => {
  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Srbija': '',
      'Hrvatska': '',
      'Severna Makedonija': '',
      'Bosna i Hercegovina': '',
      'Crna Gora': '',
      'Slovenija': ''
    };
    return flags[country] || '';
  };

  return (
    <motion.div
      className='mb-12'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <div className='glass-card p-8 relative overflow-hidden'>
        {/* Background Effects */}
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5' />
        <CyberGrid />
        
        <div className='relative z-10'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-white flex items-center'>
              <Target className='w-6 h-6 mr-3 text-cyan-500' />
              Sistem za klubove
            </h2>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-cyan-400 rounded-full animate-pulse' />
              <span className='text-cyan-400 text-sm font-medium'>UŽIVO</span>
            </div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Neural Search */}
            <motion.div 
              className='relative group'
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className='absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='relative glass-card p-4 border border-cyan-400/30'>
                <label className='flex items-center text-sm font-medium text-cyan-400 mb-2'>
                  <Search className='w-4 h-4 mr-2' />
                  Pretraga
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Pretražuj klubove...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full bg-gray-900/50 border border-cyan-400/50 rounded-lg pl-4 pr-10 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm'
                  />
                  <motion.div
                    className='absolute right-3 top-1/2 transform -translate-y-1/2'
                    animate={{ rotate: searchTerm ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Search className='w-5 h-5 text-cyan-400' />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Country Filter */}
            <motion.div 
              className='relative group'
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className='absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='relative glass-card p-4 border border-blue-400/30'>
                <label className='flex items-center text-sm font-medium text-blue-400 mb-2'>
                  <MapPin className='w-4 h-4 mr-2' />
                  Region
                </label>
                <SelectMenu
                  value={selectedCountry}
                  onChange={(value) => setSelectedCountry(value)}
                  options={countries.map(country => ({ 
                    value: country, 
                                        label: country === 'Sve' ? country : `${getCountryFlag(country)} ${country}`  
                  }))}
                  className='w-full'
                />
              </div>
            </motion.div>

            {/* Specialty Filter */}
            <motion.div 
              className='relative group'
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className='absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='relative glass-card p-4 border border-purple-400/30'>
                <label className='flex items-center text-sm font-medium text-purple-400 mb-2'>
                  <Filter className='w-4 h-4 mr-2' />
                  Disciplina
                </label>
                <SelectMenu
                  value={selectedSpecialty}
                  onChange={(value) => setSelectedSpecialty(value)}
                  options={specialties.map(spec => ({ value: spec, label: spec }))}
                  className='w-full'
                />
              </div>
            </motion.div>

            {/* Sort Algorithm */}
            <motion.div 
              className='relative group'
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className='absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='relative glass-card p-4 border border-green-400/30'>
                <label className='flex items-center text-sm font-medium text-green-400 mb-2'>
                  <Trophy className='w-4 h-4 mr-2' />
                  Sortiranje
                </label>
                <SelectMenu
                  value={sortBy}
                  onChange={(value) => setSortBy(value as SortOption)}
                  options={[
                    { value: 'rating', label: 'Po rejtingu' },
                    { value: 'members', label: 'Po članovima' },
                    { value: 'name', label: 'Po nazivu' },
                    { value: 'founded', label: 'Po osnivanju' }
                  ]}
                  className='w-full'
                />
              </div>
            </motion.div>
          </div>
          
          {/* Results Counter */}
          <motion.div 
            className='mt-6 text-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className='inline-flex items-center space-x-2 glass-card px-6 py-3 border border-cyan-400/30'>
              <Activity className='w-5 h-5 text-cyan-400' />
              <span className='text-white font-medium'>
                Ukupno pronađenih klubova:
              </span>
              <span className='text-cyan-400 font-bold text-xl'>
                <AnimatedCounter value={filteredCount} />
              </span>
              <span className='text-gray-400'>klubova</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
