"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Trophy, Star, Phone, Mail, Globe, Shield, Zap, Target, Activity, Filter, Search } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { GlitchText, AnimatedCounter, NeuralSelect } from '@/components/ui/NeuralComponents';
import { useClubs } from '@/hooks/useClubs';
// import { QuantumStatBar } from '@/components/ui/QuantumStats';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePrefetch } from '@/lib/prefetch';

type UiClub = { id: string; name: string; city: string; country: string; members?: number | null };

const countries = ['Sve', 'Srbija', 'Hrvatska', 'Severna Makedonija', 'Bosna i Hercegovina', 'Crna Gora', 'Slovenija'];
const specialties = ['Sve', 'MMA', 'Boxing', 'Muay Thai', 'Brazilian Jiu Jitsu', 'Wrestling', 'Kickboxing'];

export default function ClubsPage() {
  const prefetch = usePrefetch();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCountry, setSelectedCountry] = useState('Sve');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Sve');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'rating' | 'founded'>('rating');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const { data: apiClubs, pagination, isLoading } = useClubs({
    page,
    limit,
    search: searchTerm || undefined,
    country: selectedCountry === 'Sve' ? undefined : selectedCountry,
    city: undefined,
  } as Parameters<typeof useClubs>[0]);

  type ApiClub = { id: string; name: string; city: string; country: string; members?: number | null };
  const clubs: UiClub[] = ((apiClubs as ApiClub[]) || []).map((c) => ({ id: c.id, name: c.name, city: c.city, country: c.country, members: c.members ?? null }));

  const filteredClubs = clubs
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return (b.members ?? 0) - (a.members ?? 0);
        case 'rating':
          return 0; // backend nema rating za sada
        case 'founded':
          return 0; // backend nema founded za sada
        default:
          return 0;
      }
    });

  // Initialize state from URL (client-only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    const country = params.get('country') || 'Sve';
    const sort = (params.get('sort') as 'name' | 'members' | 'rating' | 'founded' | null) || 'rating';
    const p = Number(params.get('page') || '1') || 1;
    setSearchTerm(q);
    setSelectedCountry(country);
    setSortBy(sort);
    setPage(p);
  }, []);

  // Sync state to URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (searchTerm) sp.set('q', searchTerm);
    if (selectedCountry !== 'Sve') sp.set('country', selectedCountry);
    if (sortBy !== 'rating') sp.set('sort', sortBy);
    if (page > 1) sp.set('page', String(page));
    router.replace(`${pathname}?${sp.toString()}`);
  }, [searchTerm, selectedCountry, sortBy, page, router, pathname]);

  // Scroll to top on page change
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

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
                  { icon: <Users className="w-8 h-8" />, value: clubs.reduce((sum, c) => sum + (c.members ?? 0), 0), label: "Ukupnih članova", color: "#3b82f6" },
                  { icon: <Trophy className="w-8 h-8" />, value: 0, label: "Šampiona", color: "#f59e0b" },
                  { icon: <Target className="w-8 h-8" />, value: 10, label: "Avg Rating", color: "#10b981" }
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
                          onChange={(value) => setSortBy(value as 'name' | 'members' | 'rating' | 'founded')}
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
                {isLoading && Array.from({ length: 4 }).map((_, i) => (
                  <div key={`sk-${i}`} className="glass-card p-8">
                    <Skeleton className="h-6 w-20 mb-4" />
                    <Skeleton className="h-7 w-64 mb-2" />
                    <Skeleton className="h-4 w-40 mb-6" />
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>
                ))}
                {!isLoading && filteredClubs.map((club, index) => (
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
                                <span className="text-yellow-400 font-bold">—</span>
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
                          <h4 className="text-sm font-medium text-cyan-400 mb-3">SPECIALNOSTI:</h4>
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
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-8 gap-4">
                <Button variant="outline" size="sm" disabled={isLoading || page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                  Prethodna
                </Button>
                <span className="text-gray-300 text-sm">
                  Strana {pagination?.page ?? page} / {pagination?.totalPages ?? '—'}
                </span>
                <Button variant="outline" size="sm" disabled={isLoading || (pagination ? page >= pagination.totalPages : false)} onClick={() => setPage(p => p + 1)}>
                  Sledeća
                </Button>
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