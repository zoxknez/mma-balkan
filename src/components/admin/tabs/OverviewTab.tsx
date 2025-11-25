'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { AnimatedCounter, LineChart, DonutChart } from '@/components/data-viz/Charts';
import { adminStats, performanceData, revenueData, recentActivities, systemAlerts } from '../data';

export const OverviewTab = () => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InteractiveCard
          title="Ukupno Korisnika"
          className="text-center"
        >
          <div className="text-3xl font-bold text-blue-400 mb-2">
            <AnimatedCounter value={adminStats.totalUsers} />
          </div>
          <p className="text-gray-400">Registrovano</p>
        </InteractiveCard>

        <InteractiveCard
          title="Aktivni Korisnici"
          className="text-center"
        >
          <div className="text-3xl font-bold text-green-400 mb-2">
            <AnimatedCounter value={adminStats.activeUsers} />
          </div>
          <p className="text-gray-400">Online</p>
        </InteractiveCard>

        <InteractiveCard
          title="Ukupno Boraca"
          className="text-center"
        >
          <div className="text-3xl font-bold text-purple-400 mb-2">
            <AnimatedCounter value={adminStats.totalFighters} />
          </div>
          <p className="text-gray-400">U bazi</p>
        </InteractiveCard>

        <InteractiveCard
          title="Mesečni Prihod"
          className="text-center"
        >
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            <AnimatedCounter value={adminStats.revenue} prefix="€" />
          </div>
          <p className="text-gray-400">Ovaj mesec</p>
        </InteractiveCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InteractiveCard
          title="Performanse Platforme"
          description="Mesečni trend performansi"
          className="p-6"
        >
          <LineChart
            data={performanceData}
            width={400}
            height={250}
            showGrid
            showDots
            color="#00ff88"
          />
        </InteractiveCard>

        <InteractiveCard
          title="Prihodi po Kategorijama"
          description="Raspodela prihoda"
          className="p-6"
        >
          <DonutChart
            data={revenueData}
            size={250}
            showLabels
            showValues
          />
        </InteractiveCard>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InteractiveCard
          title="Nedavne Aktivnosti"
          description="Poslednje akcije korisnika"
          className="p-6"
        >
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-400' :
                  activity.status === 'warning' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-gray-400 text-xs">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </InteractiveCard>

        <InteractiveCard
          title="Sistemska Upozorenja"
          description="Status sistema"
          className="p-6"
        >
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                alert.resolved ? 'bg-gray-800' : 'bg-red-900/20 border border-red-500/20'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  alert.type === 'error' ? 'bg-red-400' :
                  alert.type === 'warning' ? 'bg-yellow-400' :
                  alert.type === 'info' ? 'bg-blue-400' :
                  'bg-green-400'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm">{alert.message}</p>
                  <p className="text-gray-400 text-xs">{alert.time}</p>
                </div>
                {alert.resolved && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
            ))}
          </div>
        </InteractiveCard>
      </div>
    </motion.div>
  );
};
