'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveCard } from '@/components/ui/interactive-card';

export const SettingsTab = () => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      <InteractiveCard
        title="Podešavanja"
        description="Uskoro..."
        className="p-6"
      >
        <p className="text-gray-400">Ova sekcija je u izradi.</p>
      </InteractiveCard>
    </motion.div>
  );
};
