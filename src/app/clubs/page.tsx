'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Trophy, Star, Phone, Mail, Globe, Shield, Zap, Target, Activity, Filter, Search } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { GlitchText, AnimatedCounter, NeuralSelect } from '@/components/ui/NeuralComponents';
import { QuantumStatBar } from '@/components/ui/QuantumStats';

// Mock data za klubove
const mockClubs = [
  {
    id: '1',
    name: 'Fight Zone Belgrade',
    city: 'Beograd',
    country: 'Srbija',
    founded: 2015,
    members: 250,
    coaches: 8,
    champions: 12,
    specialties: ['MMA', 'Muay Thai', 'Brazilian Jiu Jitsu', 'Wrestling'],
    rating: 4.9,
    description: 'Jedan od najuspešnijih MMA klubova na Balkanu sa preko 50 profesionalnih boraca.',
    facilities: ['Professional Octagon', 'Cardio Zone', 'Strength Training', 'Recovery Center'],
    contact: {
      phone: '+381 11 123 4567',
      email: 'info@fightzone.rs',
      website: 'www.fightzone.rs'
    },
    achievements: ['SBC Team Champions 2024', 'Best Gym Balkans 2023'],
    featured: true
  },
  {
    id: '2',
    name: 'Croatian Top Team',
    city: 'Zagreb',
    country: 'Hrvatska',
    founded: 2012,
    members: 180,
    coaches: 6,
    champions: 8,
    specialties: ['MMA', 'Boxing', 'Kickboxing', 'Grappling'],
    rating: 4.7,
    description: 'Renomirani klub sa jakim fokusop na striking tehnike i kondicionu pripremu.',
    facilities: ['2 Training Rings', 'Modern Gym', 'Sauna', 'Nutrition Center'],
    contact: {
      phone: '+385 1 234 567',
      email: 'contact@ctt.hr',
      website: 'www.croatiantopteam.hr'
    },
    achievements: ['FNC Gym of the Year 2023', '15 Pro Fighters Developed'],
    featured: false
  },
  {
    id: '3',
    name: 'Macedonian Warriors',
    city: 'Skopje',
    country: 'Severna Makedonija',
    founded: 2018,
    members: 120,
    coaches: 5,
    champions: 6,
    specialties: ['MMA', 'Karate', 'Wrestling', 'Boxing'],
    rating: 4.6,
    description: 'Mladi i ambiciozan klub sa brzim rastom i odličnim rezultatima.',
    facilities: ['Training Cage', 'Fitness Area', 'Locker Rooms'],
    contact: {
      phone: '+389 2 345 678',
      email: 'info@macedonianwarriors.mk',
      website: 'www.macedonianwarriors.mk'
    },
    achievements: ['Rising Stars Award 2024', '3 ONE Championship Fighters'],
    featured: false
  },
  {
    id: '4',
    name: 'Bosnian Lions MMA',
    city: 'Sarajevo',
    country: 'Bosna i Hercegovina',
    founded: 2016,
    members: 200,
    coaches: 7,
    champions: 10,
    specialties: ['MMA', 'Muay Thai', 'Wrestling', 'Submission Grappling'],
    rating: 4.8,
    description: 'Klub poznat po svojoj jačoj ground game školi i odličnim grapplerima.',
    facilities: ['Mat Area', 'Boxing Ring', 'Weight Room', 'Recovery Pool'],
    contact: {
      phone: '+387 33 456 789',
      email: 'contact@bosnianlions.ba',
      website: 'www.bosnianlions.ba'
    },
    achievements: ['Best Grappling Program 2023', 'UFC Fighter Development'],
    featured: true
  }
];

const countries = ['Sve', 'Srbija', 'Hrvatska', 'Severna Makedonija', 'Bosna i Hercegovina', 'Crna Gora', 'Slovenija'];
const specialties = ['Sve', 'MMA', 'Boxing', 'Muay Thai', 'Brazilian Jiu Jitsu', 'Wrestling', 'Kickboxing'];

export default function ClubsPage() {
  const [selectedCountry, setSelectedCountry] = useState('Sve');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Sve');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'rating' | 'founded'>('rating');

  const filteredClubs = mockClubs
    .filter(club => 
      (selectedCountry === 'Sve' || club.country === selectedCountry) &&
      (selectedSpecialty === 'Sve' || club.specialties.includes(selectedSpecialty)) &&
      (club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       club.city.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return b.members - a.members;
        case 'rating':
          return b.rating - a.rating;
        case 'founded':
          return b.founded - a.founded;
        default:
          return 0;
      }
    });

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
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra-Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>
        
        {/* Floating Club Elements */}
        <div className="absolute top-16 left-16 opacity-10">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.4, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-48 h-48 text-cyan-500" />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-16 opacity-10">
          <motion.div
            animate={{ rotate: -360, y: [-20, 20, -20] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <Users className="w-44 h-44 text-blue-500" />
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
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-transparent to-blue-600/10 rounded-3xl blur-xl" />
              
              <motion.div
                className="relative"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(34, 211, 238, 0.5)',
                    '0 0 40px rgba(34, 211, 238, 0.8)',
                    '0 0 20px rgba(34, 211, 238, 0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GlitchText
                  text="🥋 BALKAN COMBAT ACADEMIES 🥋"
                  className="text-5xl font-bold mb-6"
                />
              </motion.div>
              
              <motion.p 
                className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Neural mapa najelitijih MMA klubova i akademija na Balkanu.
                Pronađi svoju battlefield akademiju i pridruži se legendi.
              </motion.p>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: <Shield className="w-8 h-8" />, value: filteredClubs.length, label: "Aktivnih klubova", color: "#22d3ee" },
                  { icon: <Users className="w-8 h-8" />, value: mockClubs.reduce((sum, c) => sum + c.members, 0), label: "Ukupnih članova", color: "#3b82f6" },
                  { icon: <Trophy className="w-8 h-8" />, value: mockClubs.reduce((sum, c) => sum + c.champions, 0), label: "Šampiona", color: "#f59e0b" },
                  { icon: <Target className="w-8 h-8" />, value: Math.round(mockClubs.reduce((sum, c) => sum + c.rating, 0) / mockClubs.length * 10), label: "Avg Rating", color: "#10b981" }
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
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
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
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5" />
                <CyberGrid />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Target className="w-6 h-6 mr-3 text-cyan-500" />
                      Academy Locator System
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                      <span className="text-cyan-400 text-sm font-medium">LIVE MAP</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Neural Search */}
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-cyan-400/30">
                        <label className="flex items-center text-sm font-medium text-cyan-400 mb-2">
                          <Search className="w-4 h-4 mr-2" />
                          Academy Search
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Pretražuj klubove..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900/50 border border-cyan-400/50 rounded-lg pl-4 pr-10 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm"
                          />
                          <motion.div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            animate={{ rotate: searchTerm ? 360 : 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Search className="w-5 h-5 text-cyan-400" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Country Filter */}
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-blue-400/30">
                        <label className="flex items-center text-sm font-medium text-blue-400 mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          Region Filter
                        </label>
                        <NeuralSelect
                          value={selectedCountry}
                          onChange={(value) => setSelectedCountry(value)}
                          options={countries.map(country => ({ 
                            value: country, 
                            label: country === 'Sve' ? country : `${getCountryFlag(country)} ${country}` 
                          }))}
                          className="w-full"
                        />
                      </div>
                    </motion.div>

                    {/* Specialty Filter */}
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-purple-400/30">
                        <label className="flex items-center text-sm font-medium text-purple-400 mb-2">
                          <Filter className="w-4 h-4 mr-2" />
                          Combat Style
                        </label>
                        <NeuralSelect
                          value={selectedSpecialty}
                          onChange={(value) => setSelectedSpecialty(value)}
                          options={specialties.map(spec => ({ value: spec, label: spec }))}
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
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-green-400/30">
                        <label className="flex items-center text-sm font-medium text-green-400 mb-2">
                          <Trophy className="w-4 h-4 mr-2" />
                          Rank Protocol
                        </label>
                        <NeuralSelect
                          value={sortBy}
                          onChange={(value) => setSortBy(value as any)}
                          options={[
                            { value: 'rating', label: 'Elite Rating' },
                            { value: 'members', label: 'Member Count' },
                            { value: 'name', label: 'Alpha Sort' },
                            { value: 'founded', label: 'Establishment' }
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
                    <div className="inline-flex items-center space-x-2 glass-card px-6 py-3 border border-cyan-400/30">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-medium">
                        Academy scan rezultat: 
                      </span>
                      <span className="text-cyan-400 font-bold text-xl">
                        <AnimatedCounter value={filteredClubs.length} />
                      </span>
                      <span className="text-gray-400">klubova</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Ultra-Combat Clubs Grid */}
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
                  ELITE ACADEMIES
                  <Zap className="w-8 h-8 ml-3 text-cyan-500" />
                </motion.h3>
                <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredClubs.map((club, index) => (
                  <motion.div
                    key={club.id}
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
                            {/* Featured Badge */}
                            {club.featured && (
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 mb-3">
                                <Star className="w-3 h-3 mr-1" />
                                FEATURED
                              </div>
                            )}
                            
                            {/* Club Name */}
                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                              {club.name}
                            </h3>
                            
                            {/* Location */}
                            <div className="flex items-center text-gray-300 mb-2">
                              <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                              <span>{getCountryFlag(club.country)} {club.city}, {club.country}</span>
                            </div>
                            
                            {/* Founded & Rating */}
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>Osnovan {club.founded}</span>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                                <span className="text-yellow-400 font-bold">{club.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-300 mb-6 leading-relaxed">
                          {club.description}
                        </p>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-cyan-400 mb-1">
                              <AnimatedCounter value={club.members} />
                            </div>
                            <div className="text-xs text-gray-400">Članova</div>
                          </div>
                          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-1">
                              <AnimatedCounter value={club.champions} />
                            </div>
                            <div className="text-xs text-gray-400">Šampiona</div>
                          </div>
                          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-400 mb-1">
                              <AnimatedCounter value={club.coaches} />
                            </div>
                            <div className="text-xs text-gray-400">Trenera</div>
                          </div>
                        </div>
                        
                        {/* Specialties */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-cyan-400 mb-3">SPECIALNOSTI:</h4>
                          <div className="flex flex-wrap gap-2">
                            {club.specialties.map((specialty, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs font-medium text-cyan-300"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Facilities */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-blue-400 mb-3">OBJEKTI:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {club.facilities.map((facility, idx) => (
                              <div key={idx} className="flex items-center text-xs text-gray-300">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                                {facility}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Achievements */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-yellow-400 mb-3">DOSTIGNUĆA:</h4>
                          {club.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-start text-xs text-gray-300 mb-1">
                              <Trophy className="w-3 h-3 mr-2 text-yellow-400 mt-0.5" />
                              {achievement}
                            </div>
                          ))}
                        </div>
                        
                        {/* Contact & Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-xs text-gray-400">
                              <Phone className="w-3 h-3 mr-2" />
                              {club.contact.phone}
                            </div>
                            <div className="flex items-center text-xs text-gray-400">
                              <Mail className="w-3 h-3 mr-2" />
                              {club.contact.email}
                            </div>
                            <div className="flex items-center text-xs text-gray-400">
                              <Globe className="w-3 h-3 mr-2" />
                              {club.contact.website}
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
                            <Button variant="outline" size="sm" className="w-full">
                              <MapPin className="w-4 h-4 mr-2" />
                              Lokacija
                            </Button>
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
                ))}
              </div>
            </motion.div>

            {/* No Results */}
            {filteredClubs.length === 0 && (
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
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20" />
                      <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-cyan-500" />
                      </div>
                    </motion.div>
                    
                    <GlitchText
                      text="ACADEMY MATRIX EMPTY"
                      className="text-2xl font-bold mb-4"
                    />
                    
                    <p className="text-gray-400 text-lg mb-8">
                      Neural scan nije pronašao klubove sa zadatim filterima
                    </p>
                    
                    <Button 
                      variant="neon" 
                      onClick={() => {
                        setSelectedCountry('Sve');
                        setSelectedSpecialty('Sve');
                        setSearchTerm('');
                        setSortBy('rating');
                      }}
                      className="relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20"
                        whileHover={{ opacity: 0.4 }}
                      />
                      <span className="relative z-10 font-semibold">Resetuj academy filtere</span>
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