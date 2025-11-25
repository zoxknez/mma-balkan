'use client';

import { motion } from 'framer-motion';
import { GlitchText } from '@/components/ui/UIPrimitives';
import { News } from '@/lib/types';

interface LatestNewsSectionProps {
  latestNews: News[];
}

export function LatestNewsSection({ latestNews }: LatestNewsSectionProps) {
  return (
    <motion.div
      data-testid="latest-news"
      className="mb-16 px-6 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="text-center mb-12">
        <GlitchText 
          text="NAJNOVIJE VESTI" 
          className="text-4xl font-bold mb-4"
        />
        <p className="text-gray-300 text-lg">Pratite sve najbitnije iz sveta Balkanske MMA scene</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestNews.map((news: News, index: number) => (
          <motion.div
            key={index}
            data-testid="news-card"
            className="glass-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4 text-center group-hover:animate-bounce">
              📰
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">
                {news.category}
              </span>
              <span className="text-gray-400 text-sm">{new Date(news.publishAt).toLocaleDateString()}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
              {news.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {news.excerpt}
            </p>
            <div className="flex items-center text-green-400 text-sm font-semibold group-hover:translate-x-2 transition-transform">
              Pročitaj više →
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
