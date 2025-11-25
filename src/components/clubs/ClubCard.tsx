'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Phone, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CyberGrid } from '@/components/effects/ParticleSystem';
import { AnimatedCounter } from '@/components/ui/UIPrimitives';
import Link from 'next/link';
import { UiClub } from './types';

interface ClubCardProps {
  club: UiClub;
  index: number;
  prefetch: (url: string) => void;
}

export const ClubCard = ({ club, index, prefetch }: ClubCardProps) => {
  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Srbija': '🇷🇸',
      'Hrvatska': '🇭🇷',
      'Severna Makedonija': '🇲🇰',
      'Bosna i Hercegovina': '🇧🇦',
      'Crna Gora': '🇲🇪',
      'Slovenija': '🇸🇮'
    };
    return flags[country] || '🏴';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: 1.5 + index * 0.2,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ 
        y: -10, 
        rotateY: 2,
        transition: { duration: 0.2 }
      }}
      className="relative group"
    >
      {/* Holographic Frame */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="absolute inset-0 border border-transparent group-hover:border-cyan-400/30 rounded-2xl transition-colors duration-500" />
      
      {/* Club Card */}
      <div className="glass-card p-8 relative overflow-hidden transform transition-all duration-300 group-hover:scale-[1.02]">
        <CyberGrid />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {/* Featured Badge (not available yet) */}
              
              {/* Club Name */}
              <Link href={`/clubs/${club.id}`} className="inline-block" onMouseEnter={() => prefetch(`/clubs/${club.id}`)}>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {club.name}
                </h3>
              </Link>
              
              {/* Location */}
              <div className="flex items-center text-gray-300 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                <span>{getCountryFlag(club.country)} {club.city}, {club.country}</span>
              </div>
              
              {/* Founded & Rating placeholders */}
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Osnovan —</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-bold">Prosečna ocena —</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description placeholder */}
          <p className="text-gray-300 mb-6 leading-relaxed">Opis će uskoro biti dostupan.</p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                <AnimatedCounter value={club.members ?? 0} />
              </div>
              <div className="text-xs text-gray-400">Članova</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">0</div>
              <div className="text-xs text-gray-400">Šampiona</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">0</div>
              <div className="text-xs text-gray-400">Trenera</div>
            </div>
          </div>
          
          {/* Specialties placeholder */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-cyan-400 mb-3">SPECIJALNOSTI:</h4>
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">—</div>
          </div>
          
          {/* Facilities placeholder */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-blue-400 mb-3">OBJEKTI:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">—</div>
          </div>
          
          {/* Achievements placeholder */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-yellow-400 mb-3">DOSTIGNUĆA:</h4>
            <div className="text-xs text-gray-400">—</div>
          </div>
          
          {/* Contact & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center">
                <Phone className="w-3 h-3 mr-2" />
                Kontakt uskoro
              </div>
              <div className="flex items-center">
                <Mail className="w-3 h-3 mr-2" />
                Email uskoro
              </div>
              <div className="flex items-center">
                <Globe className="w-3 h-3 mr-2" />
                Web uskoro
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="neon" size="sm" className="w-full relative overflow-hidden group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10 font-semibold">Kontaktiraj klub</span>
              </Button>
              <Link href={`/clubs/${club.id}`} className="block" onMouseEnter={() => prefetch(`/clubs/${club.id}`)}>
                <Button variant="outline" size="sm" className="w-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  Detalji
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Neural Scan Lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        animate={{
          background: [
            'linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.1) 50%, transparent 100%)',
            'linear-gradient(90deg, transparent 50%, rgba(34, 211, 238, 0.1) 100%, transparent 150%)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
      />
    </motion.div>
  );
};
