'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Heart, Share2, TrendingUp, Hash, Zap, Target, Activity, Filter, Search, Send, MessageSquare } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { GlitchText, AnimatedCounter, NeuralSelect } from '@/components/ui/NeuralComponents';

// Mock data za community posts
const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Stefan Marković',
      username: '@stefan_mma',
      avatar: '🥊',
      verified: true,
      level: 'Elite Fighter'
    },
    content: 'Upravo završena brutalna training sesija za nadolazeći meč! 💪 5 rundi sparinga sa @marko_heavyweight - ovaj čovek stvarno ne da da se predišem! Hvala na odličnoj pripremi braćo! 🔥 #SrbijanMMA #Training',
    timestamp: '2025-09-27T14:30:00Z',
    likes: 342,
    comments: 47,
    shares: 23,
    tags: ['Training', 'Sparring', 'Preparation'],
    type: 'post',
    trending: true,
    media: null
  },
  {
    id: '2',
    author: {
      name: 'Ana Petrović',
      username: '@ana_analyst',
      avatar: '📊',
      verified: false,
      level: 'MMA Analyst'
    },
    content: 'Detaljana analiza Rakić vs Błachowicz revanša 🧠📈 Ključni faktori:\n\n1️⃣ Rakićeva poboljšana anti-wrestling igra\n2️⃣ Błachowiczova iskustva u title fightovima\n3️⃣ Cardio faktor - ko će bolje izdržati 5 rundi?\n\nMoja predikcija: Rakić via decision 48-47 💯',
    timestamp: '2025-09-27T12:15:00Z',
    likes: 189,
    comments: 62,
    shares: 34,
    tags: ['Analysis', 'Prediction', 'Rakic', 'Blachowicz'],
    type: 'analysis',
    trending: true,
    media: 'analysis_chart.jpg'
  },
  {
    id: '3',
    author: {
      name: 'Marko Božović',
      username: '@marko_coach',
      avatar: '🏃‍♂️',
      verified: true,
      level: 'Head Coach'
    },
    content: 'Tip dana za sve koji treniraju MMA 🥋\n\nNikad ne podcenjujte važnost mobility rada! 15 minuta dynamic stretching-a pre treninga može značajno smanjiti rizik od povrede i poboljšati performanse.\n\n✅ Hip circles\n✅ Leg swings  \n✅ Arm rotations\n✅ Neck rolls\n\nTrenirajte pametno, ne samo naporno! 🧠💪',
    timestamp: '2025-09-27T10:45:00Z',
    likes: 156,
    comments: 28,
    shares: 45,
    tags: ['Training Tips', 'Injury Prevention', 'Mobility'],
    type: 'tip',
    trending: false,
    media: null
  },
  {
    id: '4',
    author: {
      name: 'Milica Jovanović',
      username: '@milica_wmma',
      avatar: '👑',
      verified: true,
      level: 'Pro Fighter'
    },
    content: 'Ponosna što predstavljam ženske MMA na Balkanu! 🇷🇸👸 Juče potpisala sa @onechampionship za borbu u januaru! Dreams do come true when you work hard and believe in yourself! 💫\n\nHvala svima koji me podržavaju na ovom putu! ❤️ #WomenInMMA #OneChampionship #Dreams',
    timestamp: '2025-09-27T09:20:00Z',
    likes: 567,
    comments: 89,
    shares: 78,
    tags: ['Women MMA', 'One Championship', 'Dreams', 'Success'],
    type: 'announcement',
    trending: true,
    media: 'contract_signing.jpg'
  },
  {
    id: '5',
    author: {
      name: 'Nikola Trainer',
      username: '@nikola_s_c',
      avatar: '💪',
      verified: false,
      level: 'Strength Coach'
    },
    content: 'Workout Wednesday! 🔥 Danas radimo explosive power za MMA:\n\n🏋️‍♂️ Deadlifts 5x3 @ 85%\n🤸‍♂️ Box jumps 4x8\n⚡ Med ball slams 3x15\n🏃‍♂️ Sprint intervals 8x30s\n\nKo je speman da se znoji? Drop 💦 u komentarima!',
    timestamp: '2025-09-26T16:00:00Z',
    likes: 234,
    comments: 41,
    shares: 29,
    tags: ['Workout', 'Strength Training', 'Power'],
    type: 'workout',
    trending: false,
    media: 'workout_video.mp4'
  }
];

// const postTypes = ['Sve', 'post', 'analysis', 'tip', 'announcement', 'workout'];

export default function CommunityPage() {
  const [selectedType, setSelectedType] = useState('Sve');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'likes' | 'comments'>('timestamp');
  const [newPost, setNewPost] = useState('');

  const filteredPosts = mockPosts
    .filter(post => 
      (selectedType === 'Sve' || post.type === selectedType) &&
      (post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
       post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'likes':
          return b.likes - a.likes;
        case 'comments':
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      'post': <MessageCircle className="w-4 h-4" />,
      'analysis': <TrendingUp className="w-4 h-4" />,
      'tip': <Target className="w-4 h-4" />,
      'announcement': <Zap className="w-4 h-4" />,
      'workout': <Activity className="w-4 h-4" />
    };
    return icons[type] || <MessageCircle className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'post': 'text-blue-400',
      'analysis': 'text-purple-400',
      'tip': 'text-green-400',
      'announcement': 'text-yellow-400',
      'workout': 'text-red-400'
    };
    return colors[type] || 'text-gray-400';
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Pre ${diffDays}d`;
    if (diffHours > 0) return `Pre ${diffHours}h`;
    return 'Sada';
  };

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra-Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>
        
        {/* Floating Community Elements */}
        <div className="absolute top-12 right-8 opacity-10">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.5, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            <MessageCircle className="w-52 h-52 text-pink-500" />
          </motion.div>
        </div>
        <div className="absolute bottom-12 left-8 opacity-10">
          <motion.div
            animate={{ rotate: -360, x: [-25, 25, -25] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            <Users className="w-48 h-48 text-purple-500" />
          </motion.div>
        </div>
        
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Ultra-Futuristic Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center relative"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-transparent to-purple-600/10 rounded-3xl blur-xl" />
              
              <motion.div
                className="relative"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(236, 72, 153, 0.5)',
                    '0 0 40px rgba(236, 72, 153, 0.8)',
                    '0 0 20px rgba(236, 72, 153, 0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GlitchText
                  text="💬 BALKAN MMA COMMUNITY HUB 💬"
                  className="text-5xl font-bold mb-6"
                />
              </motion.div>
              
              <motion.p 
                className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Neural social network za Balkansku MMA zajednicu.
                Deli iskustva, analize i povezuj se sa borcima iz regiona.
              </motion.p>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: <Users className="w-8 h-8" />, value: 15247, label: "Aktivnih članova", color: "#ec4899" },
                  { icon: <MessageCircle className="w-8 h-8" />, value: filteredPosts.length, label: "Live postova", color: "#8b5cf6" },
                  { icon: <Heart className="w-8 h-8" />, value: mockPosts.reduce((sum, p) => sum + p.likes, 0), label: "Ukupno lajkova", color: "#ef4444" },
                  { icon: <TrendingUp className="w-8 h-8" />, value: mockPosts.filter(p => p.trending).length, label: "Trending sada", color: "#f59e0b" }
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
                    <div className="text-3xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Post Creation */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="glass-card p-6 relative overflow-hidden">
                <CyberGrid />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      U
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Podeli sa zajednicom</h3>
                      <p className="text-gray-400 text-sm">Šta imaš na umu, borče?</p>
                    </div>
                  </div>
                  
                  <div className="relative mb-4">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Napiši nešto o MMA-u, treningu, ili podeli svoje iskustvo..."
                      className="w-full bg-gray-800/50 border border-pink-400/30 rounded-xl p-4 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all backdrop-blur-sm resize-none h-24"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        📷 Media
                      </Button>
                      <Button variant="outline" size="sm">
                        🏷️ Tag
                      </Button>
                    </div>
                    <Button variant="neon" disabled={!newPost.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Podeli
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Control Panel */}
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
                      Community Intelligence
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
                      <span className="text-pink-400 text-sm font-medium">LIVE FEED</span>
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
                          Social Search
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
                          Content Type
                        </label>
                        <NeuralSelect
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
                          Feed Algorithm
                        </label>
                        <NeuralSelect
                          value={sortBy}
                          onChange={(value) => setSortBy(value as 'timestamp' | 'likes' | 'comments')}
                          options={[
                            { value: 'timestamp', label: 'Latest First' },
                            { value: 'likes', label: 'Most Liked' },
                            { value: 'comments', label: 'Most Discussed' }
                          ]}
                          className="w-full"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Posts Feed */}
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
                      '0 0 10px rgba(236, 72, 153, 0.5)',
                      '0 0 20px rgba(236, 72, 153, 0.8)',
                      '0 0 10px rgba(236, 72, 153, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-8 h-8 mr-3 text-pink-500" />
                  COMMUNITY FEED
                  <Zap className="w-8 h-8 ml-3 text-pink-500" />
                </motion.h3>
                <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full" />
              </div>
              
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 1.7 + index * 0.1,
                      type: "spring",
                      stiffness: 100 
                    }}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="relative group"
                  >
                    {/* Holographic Frame */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-0 border border-transparent group-hover:border-pink-400/30 rounded-2xl transition-colors duration-500" />
                    
                    {/* Post Card */}
                    <div className="glass-card p-6 relative overflow-hidden transform transition-all duration-300 group-hover:scale-[1.01]">
                      <CyberGrid />
                      
                      <div className="relative z-10">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            {/* Avatar */}
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                              {post.author.avatar}
                            </div>
                            
                            {/* Author Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-white font-semibold group-hover:text-pink-400 transition-colors">
                                  {post.author.name}
                                </h4>
                                {post.author.verified && (
                                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    ✓
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <span>{post.author.username}</span>
                                <span>•</span>
                                <span className="text-purple-400">{post.author.level}</span>
                                <span>•</span>
                                <span>{formatTimeAgo(post.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Post Type & Trending */}
                          <div className="flex items-center space-x-2">
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800/50 border ${getTypeColor(post.type)}`}>
                              {getTypeIcon(post.type)}
                              <span className="ml-1 capitalize">{post.type}</span>
                            </div>
                            {post.trending && (
                              <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 border border-red-500/30 text-red-400">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                HOT
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Post Content */}
                        <div className="mb-4">
                          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {post.content}
                          </p>
                        </div>
                        
                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-xs font-medium text-pink-300"
                              >
                                <Hash className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Media Placeholder */}
                        {post.media && (
                          <div className="mb-4">
                            <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                              <CyberGrid />
                              <div className="relative z-10 text-4xl">🎬</div>
                              <div className="absolute inset-0 border border-pink-400/20 rounded-lg" />
                            </div>
                          </div>
                        )}
                        
                        {/* Post Stats & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                          <div className="flex items-center space-x-6">
                            <motion.button
                              className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors group"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="p-2 rounded-full group-hover:bg-red-400/10 transition-colors">
                                <Heart className="w-5 h-5" />
                              </div>
                              <span className="font-medium">{post.likes}</span>
                            </motion.button>
                            
                            <motion.button
                              className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors group"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                                <MessageSquare className="w-5 h-5" />
                              </div>
                              <span className="font-medium">{post.comments}</span>
                            </motion.button>
                            
                            <motion.button
                              className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors group"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                                <Share2 className="w-5 h-5" />
                              </div>
                              <span className="font-medium">{post.shares}</span>
                            </motion.button>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            Odgovori
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Neural Scan Lines */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                      animate={{
                        background: [
                          'linear-gradient(90deg, transparent 0%, rgba(236, 72, 153, 0.1) 50%, transparent 100%)',
                          'linear-gradient(90deg, transparent 50%, rgba(236, 72, 153, 0.1) 100%, transparent 150%)'
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

            {/* Load More */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
            >
              <Button variant="neon" size="lg" className="relative overflow-hidden group px-12 py-4">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-20"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10 font-bold text-lg">Učitaj više postova</span>
              </Button>
            </motion.div>

            {/* No Results */}
            {filteredPosts.length === 0 && (
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
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20" />
                      <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-pink-500" />
                      </div>
                    </motion.div>
                    
                    <GlitchText
                      text="COMMUNITY FEED EMPTY"
                      className="text-2xl font-bold mb-4"
                    />
                    
                    <p className="text-gray-400 text-lg mb-8">
                      Neural feed je prazan sa zadatim filterima
                    </p>
                    
                    <Button 
                      variant="neon" 
                      onClick={() => {
                        setSelectedType('Sve');
                        setSearchTerm('');
                        setSortBy('timestamp');
                      }}
                      className="relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 opacity-20"
                        whileHover={{ opacity: 0.4 }}
                      />
                      <span className="relative z-10 font-semibold">Resetuj community filtere</span>
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