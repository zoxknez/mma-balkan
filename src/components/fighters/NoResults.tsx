'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export const NoResults = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <div className="bg-slate-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Nema pronađenih boraca</h3>
      <p className="text-gray-400">Pokušajte promijeniti kriterije pretrage</p>
    </motion.div>
  );
};
