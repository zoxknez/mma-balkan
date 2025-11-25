'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, MapPin } from 'lucide-react';

export function QuickStatsSection() {
  return (
    <div data-testid="stats-section" className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 px-6">
      {[
        { icon: Users, label: 'Aktivnih boraca', value: '1,247', color: 'text-green-400' },
        { icon: Calendar, label: 'Događaja mesečno', value: '47', color: 'text-blue-400' },
        { icon: MapPin, label: 'Klubova u bazi', value: '284', color: 'text-purple-400' },
        { icon: Trophy, label: 'Praćenih titula', value: '23', color: 'text-pink-400' }
      ].map((stat, index) => (
        <motion.div 
          data-testid="stat-card"
          key={index}
          className="glass-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
        >
          <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
          <div className={`text-2xl font-bold ${stat.color} mb-1`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-300">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
