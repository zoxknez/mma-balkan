'use client';

import { motion } from 'framer-motion';
import { Zap, TrendingUp, User, Clock, Eye, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CyberGrid } from '@/components/effects/ParticleSystem';
import Link from 'next/link';
import { NewsArticle } from './types';

interface FeaturedArticleProps {
  article: NewsArticle;
  getCategoryColor: (category: string) => string;
  formatTimeAgo: (dateString: string) => string;
  onPrefetch: (url: string) => void;
}

export function FeaturedArticle({ article, getCategoryColor, formatTimeAgo, onPrefetch }: FeaturedArticleProps) {
  return (
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
          ISTAKNUTA PRIČA
          <Zap className="w-8 h-8 ml-3 text-orange-500" />
        </motion.h3>
        <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
      </div>

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
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-800/50 border ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
                {article.trending && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 border border-red-500/30 text-red-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    U TRENDU
                  </span>
                )}
              </div>
              
              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                {article.title}
              </h2>
              
              {/* Excerpt */}
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {article.excerpt}
              </p>
              
              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimeAgo(article.publishDate)}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {article.views.toLocaleString()}
                  </div>
                  <div className="flex items-center text-red-400">
                    ❤️ {article.likes}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3">
                <Link href={`/news/${article.id}`} onMouseEnter={() => onPrefetch(`/news/${article.id}`)}>
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
                </Link>
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
    </motion.div>
  );
}
