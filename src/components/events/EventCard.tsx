'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CyberGrid } from '@/components/effects/ParticleSystem';

export interface EventCardProps {
  event: {
    id: string;
    name: string;
    city: string;
    mainEvent?: string | null;
    status: 'upcoming' | 'live' | 'completed' | 'cancelled';
    fights: number;
    attendees?: number | null;
    date: string;
    time: string;
  };
  index: number;
  onPrefetch: (id: string) => void;
}

export const EventCard = ({ event, index, onPrefetch }: EventCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400';
      case 'live': return 'text-red-500';
      case 'completed': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 border-blue-500/30';
      case 'live': return 'bg-red-500/20 border-red-500/30';
      case 'completed': return 'bg-green-500/20 border-green-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <motion.div
      data-testid="event-card"
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.2 + index * 0.1,
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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="absolute inset-0 border border-transparent group-hover:border-purple-400/30 rounded-2xl transition-colors duration-500" />
      
      {/* Event Card */}
      <div className="glass-card p-6 relative overflow-hidden transform transition-all duration-300 group-hover:scale-[1.02]">
        <CyberGrid />
        
        <div className="relative z-10">
          {/* Značka statusa */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getStatusBg(event.status)}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${event.status === 'live' ? 'animate-pulse bg-red-500' : ''} ${event.status === 'upcoming' ? 'bg-blue-500' : ''} ${event.status === 'completed' ? 'bg-green-500' : ''}`} />
            <span className={getStatusColor(event.status)}>
              {event.status === 'live' ? 'UŽIVO' : event.status === 'upcoming' ? 'NADOLAZEĆI' : 'ZAVRŠEN'}
            </span>
          </div>
          
          {/* Event Name */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
            {event.name}
          </h3>
          
          {/* Glavna borba */}
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-purple-400/20">
            <div className="text-xs text-purple-400 font-medium mb-1">GLAVNA BORBA</div>
            <div className="text-white font-semibold">{event.mainEvent || 'TBA'}</div>
          </div>
          
          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-purple-400" />
              <span>{new Date(event.date).toLocaleDateString('sr-RS')} u {event.time}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="w-4 h-4 mr-2 text-blue-400" />
              <span>{event.city}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2 text-green-400" />
              <span>{(event.attendees ?? 0).toLocaleString()} gledalaca</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{event.fights}</div>
              <div className="text-xs text-gray-400">Borbi</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {event.status === 'live' ? 'UŽIVO' : event.status === 'upcoming' ? 'USKORO' : 'ZAVRŠEN'}
              </div>
              <div className="text-xs text-gray-400">Status</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            {event.status === 'live' && (
              <Button variant="neon" size="sm" className="flex-1 relative overflow-hidden group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-600 opacity-20"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10 font-semibold">Gledaj uživo</span>
              </Button>
            )}
            
            {event.status === 'upcoming' && (
              <Button variant="neon" size="sm" className="flex-1">
                Kupi karte
              </Button>
            )}
            
            <Link href={`/events/${event.id}`} className="flex-1" onMouseEnter={() => onPrefetch(event.id)}>
              <Button variant="outline" size="sm" className="w-full">Detalji</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Neural Scan Lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        animate={{
          background: [
            'linear-gradient(90deg, transparent 0%, rgba(147, 51, 234, 0.1) 50%, transparent 100%)',
            'linear-gradient(90deg, transparent 50%, rgba(147, 51, 234, 0.1) 100%, transparent 150%)'
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
