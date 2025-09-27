'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Clock, User, Eye, Share2, Bookmark, TrendingUp, Zap, Target, Activity, Filter, Search } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { GlitchText, AnimatedCounter, NeuralSelect } from '@/components/ui/NeuralComponents';

// Mock data za vesti
const mockNews = [
  {
    id: '1',
    title: 'Aleksandar Rakić spreman za revanš: "Ovaj put neću napraviti istu greška"',
    excerpt: 'Srpski borac u ekskluzivnom intervjuu otkriva detalje svoje pripreme za borbu protiv Jan Błachowicza i kako planira da povrati titulu.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Intervjui',
    author: 'Marko Petrović',
    publishDate: '2025-09-26T10:30:00Z',
    views: 15420,
    likes: 892,
    image: '/news/rakic-interview.jpg',
    featured: true,
    trending: true
  },
  {
    id: '2',
    title: 'Nova MMA promocija stiže u Zagreb: Croatian Fighting Championship najavljuje spektakl',
    excerpt: 'CFC donosi revoluciju u hrvatski MMA sa najboljim regionalnim borcima i internacionalnim zvezdam u glavnim borbama.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Organizacije',
    author: 'Ana Kovač',
    publishDate: '2025-09-25T14:15:00Z',
    views: 8930,
    likes: 456,
    image: '/news/cfc-announcement.jpg',
    featured: false,
    trending: true
  },
  {
    id: '3',
    title: 'Analiza: Kako je Stipe Miočić promenio landscape heavyweight divizije',
    excerpt: 'Retrospektiva karijere hrvatske legende i njen uticaj na razvoj MMA scene na Balkanu i u svetu.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Analize',
    author: 'Stefan Nikolić',
    publishDate: '2025-09-24T09:45:00Z',
    views: 12340,
    likes: 678,
    image: '/news/miocic-legacy.jpg',
    featured: true,
    trending: false
  },
  {
    id: '4',
    title: 'Roberto Soldić potpisao sa UFC-om: Ekskluzivne fotografije sa ceremonije',
    excerpt: 'Hrvatski welterweight šampion zvanično se pridružuje najjačoj MMA promociji na svetu. Evo šta možemo očekivati.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Transfer',
    author: 'Nikola Jovanović',
    publishDate: '2025-09-23T16:20:00Z',
    views: 23450,
    likes: 1234,
    image: '/news/soldic-ufc.jpg',
    featured: false,
    trending: true
  },
  {
    id: '5',
    title: 'Ženske MMA na Balkanu: Nova generacija borki osvaja svetsku scenu',
    excerpt: 'Sve više balkanskih borki uspešno se takmiči na međunarodnom nivou. Analiza fenomena i prognoze za budućnost.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Women MMA',
    author: 'Milica Stojanović',
    publishDate: '2025-09-22T11:10:00Z',
    views: 7890,
    likes: 345,
    image: '/news/women-mma.jpg',
    featured: false,
    trending: false
  }
];

const categories = ['Sve', 'Intervjui', 'Organizacije', 'Analize', 'Transfer', 'Women MMA', 'Training', 'Events'];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Sve');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');

  const filteredNews = mockNews
    .filter(article => 
      (selectedCategory === 'Sve' || article.category === selectedCategory) &&
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Intervjui': 'text-green-400',
      'Organizacije': 'text-blue-400',
      'Analize': 'text-purple-400',
      'Transfer': 'text-orange-400',
      'Women MMA': 'text-pink-400',
      'Training': 'text-yellow-400',
      'Events': 'text-red-400'
    };
    return colors[category] || 'text-gray-400';
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Pre ${diffDays} ${diffDays === 1 ? 'dan' : 'dana'}`;
    if (diffHours > 0) return `Pre ${diffHours} ${diffHours === 1 ? 'sat' : 'sati'}`;
    return 'Upravo sada';
  };

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra-Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>
        
        {/* Floating News Elements */}
        <div className="absolute top-20 right-12 opacity-10">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.3, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            <Newspaper className="w-44 h-44 text-orange-500" />
          </motion.div>
        </div>
        <div className="absolute bottom-16 left-12 opacity-10">
          <motion.div
            animate={{ rotate: -360, x: [-15, 15, -15] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            <TrendingUp className="w-40 h-40 text-yellow-500" />
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
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-red-600/10 rounded-3xl blur-xl" />
              
              <motion.div
                className="relative"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(249, 115, 22, 0.5)',
                    '0 0 40px rgba(249, 115, 22, 0.8)',
                    '0 0 20px rgba(249, 115, 22, 0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GlitchText
                  text="📰 BALKAN MMA NEWS MATRIX 📰"
                  className="text-5xl font-bold mb-6"
                />
              </motion.div>
              
              <motion.p 
                className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Neural news agregator sa najsvežijim informacijama iz sveta Balkanske MMA scene.
                Ekskluzivni intervjui, analize i breaking news u real-time-u.
              </motion.p>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: <Newspaper className="w-8 h-8" />, value: filteredNews.length, label: "Aktuelnih vesti", color: "#f97316" },
                  { icon: <TrendingUp className="w-8 h-8" />, value: filteredNews.filter(n => n.trending).length, label: "Trending sada", color: "#ef4444" },
                  { icon: <Eye className="w-8 h-8" />, value: Math.floor(mockNews.reduce((sum, n) => sum + n.views, 0) / 1000), label: "K pregleda", color: "#3b82f6" },
                  { icon: <User className="w-8 h-8" />, value: 47, label: "Aktivnih autora", color: "#10b981" }
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
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
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
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-red-500/5" />
                <CyberGrid />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Target className="w-6 h-6 mr-3 text-orange-500" />
                      News Intelligence System
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
                      <span className="text-orange-400 text-sm font-medium">LIVE FEED</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Neural Search */}
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-orange-400/30">
                        <label className="flex items-center text-sm font-medium text-orange-400 mb-2">
                          <Search className="w-4 h-4 mr-2" />
                          Neural Search
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Pretražuj vesti..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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

                    {/* Category Filter */}
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-red-400/30">
                        <label className="flex items-center text-sm font-medium text-red-400 mb-2">
                          <Filter className="w-4 h-4 mr-2" />
                          News Category
                        </label>
                        <NeuralSelect
                          value={selectedCategory}
                          onChange={(value) => setSelectedCategory(value)}
                          options={categories.map(cat => ({ value: cat, label: cat }))}
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
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative glass-card p-4 border border-yellow-400/30">
                        <label className="flex items-center text-sm font-medium text-yellow-400 mb-2">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Priority Matrix
                        </label>
                        <NeuralSelect
                          value={sortBy}
                          onChange={(value) => setSortBy(value as any)}
                          options={[
                            { value: 'date', label: 'Chronological' },
                            { value: 'views', label: 'Popularity Index' },
                            { value: 'likes', label: 'Engagement Score' }
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
                        News agregat rezultat: 
                      </span>
                      <span className="text-orange-400 font-bold text-xl">
                        <AnimatedCounter value={filteredNews.length} />
                      </span>
                      <span className="text-gray-400">članaka</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Featured Article */}
            {filteredNews.find(article => article.featured) && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <div className="text-center mb-8">
                  <motion.h3 
                    className="text-3xl font-bold text-white mb-2 flex items-center justify-center"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(249, 115, 22, 0.5)',
                        '0 0 20px rgba(249, 115, 22, 0.8)',
                        '0 0 10px rgba(249, 115, 22, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-8 h-8 mr-3 text-orange-500" />
                    FEATURED STORY
                    <Zap className="w-8 h-8 ml-3 text-orange-500" />
                  </motion.h3>
                  <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
                </div>

                {(() => {
                  const featured = filteredNews.find(article => article.featured)!;
                  return (
                    <motion.div
                      className="glass-card p-8 relative overflow-hidden group"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CyberGrid />
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                          <div>
                            {/* Category & Trending Badge */}
                            <div className="flex items-center space-x-3 mb-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-800/50 border ${getCategoryColor(featured.category)}`}>
                                {featured.category}
                              </span>
                              {featured.trending && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 border border-red-500/30 text-red-400">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  TRENDING
                                </span>
                              )}
                            </div>
                            
                            {/* Title */}
                            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                              {featured.title}
                            </h2>
                            
                            {/* Excerpt */}
                            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                              {featured.excerpt}
                            </p>
                            
                            {/* Meta Info */}
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-1" />
                                  {featured.author}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {formatTimeAgo(featured.publishDate)}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {featured.views.toLocaleString()}
                                </div>
                                <div className="flex items-center text-red-400">
                                  ❤️ {featured.likes}
                                </div>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex space-x-3">
                              <Button variant="neon" className="relative overflow-hidden group">
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 opacity-20"
                                  animate={{
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                  }}
                                />
                                <span className="relative z-10 font-semibold">Pročitaj ceo članak</span>
                              </Button>
                              <Button variant="outline" size="sm">
                                <Share2 className="w-4 h-4 mr-2" />
                                Podeli
                              </Button>
                              <Button variant="outline" size="sm">
                                <Bookmark className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Placeholder for image */}
                          <div className="relative">
                            <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                              <CyberGrid />
                              <div className="relative z-10 text-6xl">📰</div>
                              <div className="absolute inset-0 border border-orange-400/30 rounded-xl" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </motion.div>
            )}

            {/* News Grid */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <div className="text-center mb-8">
                <motion.h3 
                  className="text-3xl font-bold text-white mb-2 flex items-center justify-center"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(249, 115, 22, 0.5)',
                      '0 0 20px rgba(249, 115, 22, 0.8)',
                      '0 0 10px rgba(249, 115, 22, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Newspaper className="w-8 h-8 mr-3 text-orange-500" />
                  LATEST INTEL
                  <Newspaper className="w-8 h-8 ml-3 text-orange-500" />
                </motion.h3>
                <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.filter(article => !article.featured).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 30, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 1.7 + index * 0.1,
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
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-red-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-0 border border-transparent group-hover:border-orange-400/30 rounded-2xl transition-colors duration-500" />
                    
                    {/* Article Card */}
                    <div className="glass-card p-6 relative overflow-hidden transform transition-all duration-300 group-hover:scale-[1.02] h-full flex flex-col">
                      <CyberGrid />
                      
                      <div className="relative z-10 flex-1 flex flex-col">
                        {/* Category & Trending */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-800/50 border ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </span>
                          {article.trending && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 border border-red-500/30 text-red-400">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              HOT
                            </span>
                          )}
                        </div>
                        
                        {/* Image Placeholder */}
                        <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                          <CyberGrid />
                          <div className="relative z-10 text-3xl">📰</div>
                          <div className="absolute inset-0 border border-orange-400/20 rounded-lg" />
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-2 flex-1">
                          {article.title}
                        </h3>
                        
                        {/* Excerpt */}
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                          {article.excerpt}
                        </p>
                        
                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(article.publishDate)}
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {article.views.toLocaleString()}
                            </div>
                            <div className="flex items-center text-red-400">
                              ❤️ {article.likes}
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button variant="neon" size="sm" className="flex-1 text-xs">
                            Pročitaj
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bookmark className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Neural Scan Lines */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                      animate={{
                        background: [
                          'linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.1) 50%, transparent 100%)',
                          'linear-gradient(90deg, transparent 50%, rgba(249, 115, 22, 0.1) 100%, transparent 150%)'
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
            {filteredNews.length === 0 && (
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
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-20" />
                      <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                        <Newspaper className="w-8 h-8 text-orange-500" />
                      </div>
                    </motion.div>
                    
                    <GlitchText
                      text="NEWS FEED EMPTY"
                      className="text-2xl font-bold mb-4"
                    />
                    
                    <p className="text-gray-400 text-lg mb-8">
                      Neural agregator nije pronašao vesti sa zadatim filterima
                    </p>
                    
                    <Button 
                      variant="neon" 
                      onClick={() => {
                        setSelectedCategory('Sve');
                        setSearchTerm('');
                        setSortBy('date');
                      }}
                      className="relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-20"
                        whileHover={{ opacity: 0.4 }}
                      />
                      <span className="relative z-10 font-semibold">Resetuj news filtere</span>
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