'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, Target, Zap, Shield, Trophy, Users, Sword, Activity } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FighterCard } from '@/components/fighters/fighter-card';
import { Fighter, WeightClass, FightingStance } from '@/lib/types';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { GlitchText, AnimatedCounter, NeuralSelect } from '@/components/ui/NeuralComponents';
import { QuantumStatBar } from '@/components/ui/QuantumStats';

// Mock data - u realnoj aplikaciji bi ovo dolazilo iz API-ja
const mockFighters: Fighter[] = [
  {
    id: '1',
    name: 'Aleksandar Rakić',
    nickname: 'Rocket',
    country: 'Srbija',
    countryCode: 'RS',
    birthDate: new Date('1992-02-06'),
    height: 193,
    weight: 93,
    weightClass: WeightClass.LIGHT_HEAVYWEIGHT,
    reach: 198,
    stance: FightingStance.ORTHODOX,
    wins: 14,
    losses: 3,
    draws: 0,
    koTkoWins: 9,
    submissionWins: 1,
    decisionWins: 4,
    isActive: true,
    lastFight: new Date('2024-03-02'),
    ranking: {
      position: 4,
      organization: 'UFC',
      weightClass: WeightClass.LIGHT_HEAVYWEIGHT
    }
  },
  {
    id: '2',
    name: 'Miloš Terzić',
    country: 'Srbija',
    countryCode: 'RS',
    birthDate: new Date('1995-07-15'),
    height: 180,
    weight: 77,
    weightClass: WeightClass.WELTERWEIGHT,
    stance: FightingStance.SOUTHPAW,
    wins: 12,
    losses: 2,
    draws: 0,
    koTkoWins: 7,
    submissionWins: 3,
    decisionWins: 2,
    isActive: true,
    lastFight: new Date('2024-05-18')
  },
  {
    id: '3',
    name: 'Ana Bajić',
    nickname: 'Lightning',
    country: 'Srbija',
    countryCode: 'RS',
    birthDate: new Date('1998-11-22'),
    height: 165,
    weight: 57,
    weightClass: WeightClass.FLYWEIGHT,
    stance: FightingStance.ORTHODOX,
    wins: 8,
    losses: 1,
    draws: 0,
    koTkoWins: 3,
    submissionWins: 2,
    decisionWins: 3,
    isActive: true,
    lastFight: new Date('2024-04-10')
  }
];

export default function FightersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeightClass, setSelectedWeightClass] = useState<WeightClass | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'wins' | 'ranking'>('name');

  const filteredFighters = mockFighters
    .filter(fighter => {
      const matchesSearch = fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (fighter.nickname && fighter.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesWeightClass = selectedWeightClass === 'all' || fighter.weightClass === selectedWeightClass;
      return matchesSearch && matchesWeightClass;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'wins':
          return b.wins - a.wins;
        case 'ranking':
          if (a.ranking && b.ranking) {
            return a.ranking.position - b.ranking.position;
          }
          return a.ranking ? -1 : 1;
        default:
          return 0;
      }
    });

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra-Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-850 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>
        
        {/* Floating Combat Elements */}
        <div className="absolute top-20 left-10 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sword className="w-32 h-32 text-red-500" />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-28 h-28 text-blue-500" />
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
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10 rounded-3xl blur-xl" />
              
              <motion.div
                className="relative"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(239, 68, 68, 0.5)',
                    '0 0 40px rgba(239, 68, 68, 0.8)',
                    '0 0 20px rgba(239, 68, 68, 0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GlitchText
                  text="⚔️ BALKAN WARRIORS DATABASE ⚔️"
                  className="text-5xl font-bold mb-6"
                />
              </motion.div>
              
              <motion.p 
                className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Kompletna neural baza najelitijijih MMA boraca sa Balkana.
                Analiza, statistike i real-time praćenje performansi.
              </motion.p>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: <Users className="w-8 h-8" />, value: filteredFighters.length, label: "Aktivnih boraca", color: "#ef4444" },
                  { icon: <Trophy className="w-8 h-8" />, value: 47, label: "Šampiona", color: "#f59e0b" },
                  { icon: <Target className="w-8 h-8" />, value: 89, label: "Accuracy %", color: "#10b981" },
                  { icon: <Activity className="w-8 h-8" />, value: 156, label: "Live mečeva", color: "#8b5cf6" }
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
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
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
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5" />
                <CyberGrid />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Target className="w-6 h-6 mr-3 text-red-500" />
                      Neural Combat Analysis
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-sm font-medium">LIVE DATABASE</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Quantum Search */}
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-green-400/30">
                        <label className="flex items-center text-sm font-medium text-green-400 mb-2">
                          <Search className="w-4 h-4 mr-2" />
                          Quantum Search
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Analiza borca..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900/50 border border-green-400/50 rounded-lg pl-4 pr-10 py-3 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all backdrop-blur-sm"
                          />
                          <motion.div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            animate={{ rotate: searchTerm ? 360 : 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Search className="w-5 h-5 text-green-400" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Weight Class Selector */}
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-blue-400/30">
                        <label className="flex items-center text-sm font-medium text-blue-400 mb-2">
                          <Filter className="w-4 h-4 mr-2" />
                          Combat Class
                        </label>
                        <NeuralSelect
                          value={selectedWeightClass}
                          onChange={(value) => setSelectedWeightClass(value as WeightClass | 'all')}
                          options={[
                            { value: 'all', label: 'Sve kategorije' },
                            ...Object.values(WeightClass).map(wc => ({ value: wc, label: wc }))
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
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-red-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-purple-400/30">
                        <label className="flex items-center text-sm font-medium text-purple-400 mb-2">
                          <SortAsc className="w-4 h-4 mr-2" />
                          Sort Algorithm
                        </label>
                        <NeuralSelect
                          value={sortBy}
                          onChange={(value) => setSortBy(value as 'name' | 'wins' | 'ranking')}
                          options={[
                            { value: 'name', label: 'Alpha Protocol' },
                            { value: 'wins', label: 'Victory Matrix' },
                            { value: 'ranking', label: 'Neural Ranking' }
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
                    <div className="inline-flex items-center space-x-2 glass-card px-6 py-3 border border-green-400/30">
                      <Activity className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">
                        Analiza rezultata: 
                      </span>
                      <span className="text-green-400 font-bold text-xl">
                        <AnimatedCounter value={filteredFighters.length} />
                      </span>
                      <span className="text-gray-400">boraca</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-gray-300">
              Pronađeno {filteredFighters.length} boraca
            </p>
          </motion.div>

          {/* Ultra-Combat Warriors Grid */}
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
                    '0 0 10px rgba(239, 68, 68, 0.5)',
                    '0 0 20px rgba(239, 68, 68, 0.8)',
                    '0 0 10px rgba(239, 68, 68, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-8 h-8 mr-3 text-red-500" />
                ACTIVE WARRIORS
                <Zap className="w-8 h-8 ml-3 text-red-500" />
              </motion.h3>
              <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFighters.map((fighter, index) => (
                <motion.div
                  key={fighter.id}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1.5 + index * 0.1,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ 
                    y: -10, 
                    rotateY: 5,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  {/* Holographic Frame */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute inset-0 border border-transparent group-hover:border-red-400/30 rounded-2xl transition-colors duration-500" />
                  
                  {/* Enhanced Fighter Card */}
                  <div className="relative transform transition-all duration-300 group-hover:scale-105">
                    <FighterCard
                      fighter={fighter}
                      onFollow={(id) => console.log('Follow fighter:', id)}
                      showStats={true}
                    />
                  </div>
                  
                  {/* Rank Indicator */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-gray-900 z-20"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  >
                    {index + 1}
                  </motion.div>
                  
                  {/* Neural Scan Lines */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                    animate={{
                      background: [
                        'linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.1) 50%, transparent 100%)',
                        'linear-gradient(90deg, transparent 50%, rgba(239, 68, 68, 0.1) 100%, transparent 150%)'
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

          {/* Ultra-Futuristic Load More */}
          {filteredFighters.length > 0 && (
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <div className="glass-card p-8 max-w-md mx-auto relative overflow-hidden">
                <CyberGrid />
                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center justify-center">
                    <Activity className="w-6 h-6 mr-2 text-green-400" />
                    Neural Expansion
                  </h4>
                  <Button 
                    variant="neon" 
                    size="lg"
                    className="relative overflow-hidden group px-8 py-4"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-500 via-blue-500 to-purple-600 opacity-20"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <span className="relative z-10 font-bold text-lg">Učitaj više boraca</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Neural No Results */}
          {filteredFighters.length === 0 && (
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
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 rounded-full opacity-20" />
                    <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-red-500" />
                    </div>
                  </motion.div>
                  
                  <GlitchText
                    text="NEURAL SCAN COMPLETE"
                    className="text-2xl font-bold mb-4"
                  />
                  
                  <p className="text-gray-400 text-lg mb-8">
                    Quantum search nije pronašao borce sa zadatim parametrima
                  </p>
                  
                  <div className="space-y-4">
                    <Button 
                      variant="neon" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedWeightClass('all');
                        setSortBy('name');
                      }}
                      className="w-full relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-20"
                        whileHover={{ opacity: 0.4 }}
                      />
                      <span className="relative z-10 font-semibold">Resetuj neural filtere</span>
                    </Button>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSearchTerm('')}
                        className="text-xs"
                      >
                        Clear Search
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedWeightClass('all')}
                        className="text-xs"
                      >
                        All Classes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSortBy('name')}
                        className="text-xs"
                      >
                        Alpha Sort
                      </Button>
                    </div>
                  </div>
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