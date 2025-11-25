'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { OverviewTab } from '@/components/admin/tabs/OverviewTab';
import { UsersTab } from '@/components/admin/tabs/UsersTab';
import { AnalyticsTab } from '@/components/admin/tabs/AnalyticsTab';
import { ContentTab } from '@/components/admin/tabs/ContentTab';
import { SettingsTab } from '@/components/admin/tabs/SettingsTab';

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content' | 'analytics' | 'settings'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminHeader />
        
        <AdminTabs 
          selectedTab={selectedTab} 
          setSelectedTab={setSelectedTab} 
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {selectedTab === 'overview' && <OverviewTab />}
            {selectedTab === 'users' && <UsersTab />}
            {selectedTab === 'content' && <ContentTab />}
            {selectedTab === 'analytics' && <AnalyticsTab />}
            {selectedTab === 'settings' && <SettingsTab />}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
