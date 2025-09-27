'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Trophy, Zap, Target, Activity, Filter } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { GlitchText, AnimatedCounter, NeuralSelect } from '@/components/ui/NeuralComponents';
import { QuantumStatBar } from '@/components/ui/QuantumStats';

// Mock data za događaje
const mockEvents = [
  {
    id: '1',
    name: 'SBC 45: Rakić vs Błachowicz II',
    date: '2025-12-15',
    time: '20:00',
    venue: 'Stark Arena',
    city: 'Beograd',
    country: 'Srbija',
    mainEvent: 'Aleksandar Rakić vs Jan Błachowicz',
    status: 'upcoming',
    ticketsAvailable: true,
    fights: 12,
    attendees: 18500
  },
  {
    id: '2',
    name: 'FNC 28: Balkan Storm',
    date: '2025-11-20',
    time: '19:30',
    venue: 'Zagreb Arena',
    city: 'Zagreb',
    country: 'Hrvatska',
    mainEvent: 'Roberto Soldić vs Dricus Du Plessis',
    status: 'live',
    ticketsAvailable: false,
    fights: 10,
    attendees: 15000
  },
  {
    id: '3',
    name: 'ONE Championship: Balkan Warriors',
    date: '2025-10-12',
    time: '21:00',
    venue: 'Boris Trajkovski Arena',
    city: 'Skopje',
    country: 'Severna Makedonija',
    mainEvent: 'Darko Stošić vs Anatoly Malykhin',
    status: 'completed',
    ticketsAvailable: false,
    fights: 8,
    attendees: 12000
  }
];

export default function EventsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'venue'>('date');

  const filteredEvents = mockEvents
    .filter(event => filterStatus === 'all' || event.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'venue':
          return a.venue.localeCompare(b.venue);
        default:
          return 0;
      }
    });

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
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra-Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>
        
        {/* Floating Event Elements */}
        <div className="absolute top-24 left-8 opacity-10">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <Calendar className="w-40 h-40 text-purple-500" />
          </motion.div>
        </div>
        <div className="absolute bottom-24 right-8 opacity-10">
          <motion.div
            animate={{ rotate: -360, y: [-10, 10, -10] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Trophy className="w-36 h-36 text-blue-500" />
          </motion.div>
        </div>
        
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Ultra-Futuristic Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center relative"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10 rounded-3xl blur-xl" />
              
              <motion.div
                className="relative"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(147, 51, 234, 0.5)',
                    '0 0 40px rgba(147, 51, 234, 0.8)',
                    '0 0 20px rgba(147, 51, 234, 0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GlitchText
                  text="📅 BALKAN COMBAT EVENTS 📅"
                  className="text-5xl font-bold mb-6"
                />
              </motion.div>
              
              <motion.p 
                className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Neural kalendar najvažnijih MMA događaja na Balkanu.
                Live praćenje, analize i ekskluzivne informacije.
              </motion.p>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: <Calendar className="w-8 h-8" />, value: filteredEvents.length, label: "Događaja", color: "#8b5cf6" },
                  { icon: <Activity className="w-8 h-8" />, value: filteredEvents.filter(e => e.status === 'live').length, label: "Live sada", color: "#ef4444" },
                  { icon: <Trophy className="w-8 h-8" />, value: filteredEvents.filter(e => e.status === 'upcoming').length, label: "Nadolazeći", color: "#3b82f6" },
                  { icon: <Users className="w-8 h-8" />, value: mockEvents.reduce((sum, e) => sum + e.attendees, 0), label: "Ukupno gledalaca", color: "#10b981" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-white mb-2 flex justify-center" style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Ultra-Futuristic Control Panel */}
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
                      Event Control Matrix
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                      <span className="text-purple-400 text-sm font-medium">LIVE TRACKING</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Filter */}
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-purple-400/30">
                        <label className="flex items-center text-sm font-medium text-purple-400 mb-2">
                          <Filter className="w-4 h-4 mr-2" />
                          Event Status
                        </label>
                        <NeuralSelect
                          value={filterStatus}
                          onChange={(value) => setFilterStatus(value as any)}
                          options={[
                            { value: 'all', label: 'Svi događaji' },
                            { value: 'upcoming', label: 'Nadolazeći' },
                            { value: 'live', label: 'Live sada' },
                            { value: 'completed', label: 'Završeni' }
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
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-blue-400/30">
                        <label className="flex items-center text-sm font-medium text-blue-400 mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          Sort Protocol
                        </label>
                        <NeuralSelect
                          value={sortBy}
                          onChange={(value) => setSortBy(value as any)}
                          options={[
                            { value: 'date', label: 'Chronological' },
                            { value: 'name', label: 'Alpha Protocol' },
                            { value: 'venue', label: 'Location Matrix' }
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
                        Neural scan rezultat: 
                      </span>
                      <span className="text-purple-400 font-bold text-xl">
                        <AnimatedCounter value={filteredEvents.length} />
                      </span>
                      <span className="text-gray-400">događaja</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Ultra-Combat Events Grid */}
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
                      '0 0 10px rgba(147, 51, 234, 0.5)',
                      '0 0 20px rgba(147, 51, 234, 0.8)',
                      '0 0 10px rgba(147, 51, 234, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-8 h-8 mr-3 text-purple-500" />
                  COMBAT CALENDAR
                  <Zap className="w-8 h-8 ml-3 text-purple-500" />
                </motion.h3>
                <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
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
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-0 border border-transparent group-hover:border-purple-400/30 rounded-2xl transition-colors duration-500" />
                    
                    {/* Event Card */}
                    <div className="glass-card p-6 relative overflow-hidden transform transition-all duration-300 group-hover:scale-[1.02]">
                      <CyberGrid />
                      
                      <div className="relative z-10">
                        {/* Status Badge */}
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getStatusBg(event.status)}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${event.status === 'live' ? 'animate-pulse bg-red-500' : ''} ${event.status === 'upcoming' ? 'bg-blue-500' : ''} ${event.status === 'completed' ? 'bg-green-500' : ''}`} />
                          <span className={getStatusColor(event.status)}>
                            {event.status === 'live' ? 'LIVE SADA' : event.status === 'upcoming' ? 'NADOLAZEĆI' : 'ZAVRŠEN'}
                          </span>
                        </div>
                        
                        {/* Event Name */}
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                          {event.name}
                        </h3>
                        
                        {/* Main Event */}
                        <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-purple-400/20">
                          <div className="text-xs text-purple-400 font-medium mb-1">MAIN EVENT</div>
                          <div className="text-white font-semibold">{event.mainEvent}</div>
                        </div>
                        
                        {/* Event Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                            <span>{new Date(event.date).toLocaleDateString('sr-RS')} u {event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                            <span>{event.venue}, {event.city}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Users className="w-4 h-4 mr-2 text-green-400" />
                            <span>{event.attendees.toLocaleString()} gledalaca</span>
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
                              {event.status === 'live' ? 'LIVE' : event.status === 'upcoming' ? 'SOON' : 'DONE'}
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
                              <span className="relative z-10 font-semibold">Gledaj LIVE</span>
                            </Button>
                          )}
                          
                          {event.status === 'upcoming' && event.ticketsAvailable && (
                            <Button variant="neon" size="sm" className="flex-1">
                              Kupi karte
                            </Button>
                          )}
                          
                          <Button variant="outline" size="sm" className="flex-1">
                            Detalji
                          </Button>
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
                ))}
              </div>
            </motion.div>

            {/* No Results */}
            {filteredEvents.length === 0 && (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="glass-card p-12 max-w-lg mx-auto relative overflow-hidden">
                  <CyberGrid />
                  <div className="relative z-10">
                    <motion.div
                      className="w-20 h-20 mx-auto mb-6 relative"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20" />
                      <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-purple-500" />
                      </div>
                    </motion.div>
                    
                    <GlitchText
                      text="EVENT MATRIX EMPTY"
                      className="text-2xl font-bold mb-4"
                    />
                    
                    <p className="text-gray-400 text-lg mb-8">
                      Neural scan nije pronašao događaje sa zadatim filterima
                    </p>
                    
                    <Button 
                      variant="neon" 
                      onClick={() => {
                        setFilterStatus('all');
                        setSortBy('date');
                      }}
                      className="relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 opacity-20"
                        whileHover={{ opacity: 0.4 }}
                      />
                      <span className="relative z-10 font-semibold">Resetuj neural filtere</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}