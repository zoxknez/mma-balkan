'use client';

import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, User, Clock, Eye, Share2, Bookmark, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CyberGrid } from '@/components/effects/ParticleSystem';
import Link from 'next/link';
import { NewsArticle } from './types';

interface NewsGridProps {
  news: NewsArticle[];
  isLoading: boolean;
  getCategoryColor: (category: string) => string;
  formatTimeAgo: (dateString: string) => string;
  onPrefetch: (url: string) => void;
}

export function NewsGrid({ news, isLoading, getCategoryColor, formatTimeAgo, onPrefetch }: NewsGridProps) {
  return (
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
          NAJSKORIJE VESTI
          <Newspaper className="w-8 h-8 ml-3 text-orange-500" />
        </motion.h3>
        <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <div key={`sk-${i}`} className="glass-card p-6">
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-24" />
          </div>
        ))}
        {!isLoading && news.map((article, index) => (
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
                      U TRENDU
                    </span>
                  )}
                </div>
                
                {/* Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  <CyberGrid />
                  {article.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="relative z-10 text-3xl">📰</div>
                  )}
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
                    {article.sourceUrl && (
                      <a 
                        href={article.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-orange-400 hover:text-orange-300 flex items-center"
                        title="Izvor vesti"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
                  <Link href={`/news/${article.id}`} className="flex-1" onMouseEnter={() => onPrefetch(`/news/${article.id}`)}>
                    <Button variant="neon" size="sm" className="w-full text-xs">
                      Pročitaj
                    </Button>
                  </Link>
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
  );
}
