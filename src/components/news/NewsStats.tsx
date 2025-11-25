'use client';

import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, Eye, User } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/UIPrimitives';
import { NewsStatsData } from './types';

interface NewsStatsProps {
  stats: NewsStatsData;
}

export function NewsStats({ stats }: NewsStatsProps) {
  const statItems = [
    { icon: <Newspaper className="w-8 h-8" />, value: stats.totalNews, label: "Aktuelnih vesti", color: "#f97316" },
    { icon: <TrendingUp className="w-8 h-8" />, value: stats.trendingCount, label: "U trendu", color: "#ef4444" },
    { icon: <Eye className="w-8 h-8" />, value: Math.floor(stats.totalViews / 1000), label: "K pregleda", color: "#3b82f6" },
    { icon: <User className="w-8 h-8" />, value: stats.activeAuthors, label: "Aktivnih autora", color: "#10b981" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto -mt-6 mb-12">
      {statItems.map((stat, index) => (
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
  );
}
