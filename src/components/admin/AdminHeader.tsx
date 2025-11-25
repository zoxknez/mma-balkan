'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export const AdminHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Upravljanje MMA Balkan platformom
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Osveži</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
