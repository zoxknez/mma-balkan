'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Newspaper, TrendingUp, Settings } from 'lucide-react';

interface AdminTabsProps {
  selectedTab: 'overview' | 'users' | 'content' | 'analytics' | 'settings';
  setSelectedTab: (tab: 'overview' | 'users' | 'content' | 'analytics' | 'settings') => void;
}

export const AdminTabs = ({ selectedTab, setSelectedTab }: AdminTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Pregled', icon: BarChart3 },
    { id: 'users', label: 'Korisnici', icon: Users },
    { id: 'content', label: 'Sadržaj', icon: Newspaper },
    { id: 'analytics', label: 'Analitika', icon: TrendingUp },
    { id: 'settings', label: 'Podešavanja', icon: Settings },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as 'overview' | 'users' | 'content' | 'analytics' | 'settings')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors min-w-[120px] ${
              selectedTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
