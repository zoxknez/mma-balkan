'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DonutChart, LineChart, BarChart, AnimatedCounter } from '@/components/data-viz/Charts';
import { AdvancedSearch } from '@/components/ui/advanced-search';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { DataTable } from '@/components/ui/data-table';
import { Modal } from '@/components/ui/modal';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

// Mock data for charts
const fighterStatsData = [
  { label: 'Pobede', value: 45, color: '#00ff88' },
  { label: 'Porazi', value: 12, color: '#ff4444' },
  { label: 'Nerešeno', value: 3, color: '#ffaa00' },
];

const performanceData = [
  { x: 'Jan', y: 85 },
  { x: 'Feb', y: 92 },
  { x: 'Mar', y: 78 },
  { x: 'Apr', y: 95 },
  { x: 'May', y: 88 },
  { x: 'Jun', y: 96 },
];

const weightClassData = [
  { category: 'Lightweight', value: 25 },
  { category: 'Welterweight', value: 18 },
  { category: 'Middleweight', value: 15 },
  { category: 'Heavyweight', value: 12 },
  { category: 'Featherweight', value: 20 },
];

const fightersData = [
  { id: 1, name: 'Marko Petrović', weightClass: 'Lightweight', record: '15-3-0', nationality: 'Srbija', wins: 15, losses: 3 },
  { id: 2, name: 'Ana Jovanović', weightClass: 'Featherweight', record: '12-2-1', nationality: 'Srbija', wins: 12, losses: 2 },
  { id: 3, name: 'Stefan Nikolić', weightClass: 'Welterweight', record: '18-5-0', nationality: 'Srbija', wins: 18, losses: 5 },
  { id: 4, name: 'Milica Stojanović', weightClass: 'Bantamweight', record: '8-1-0', nationality: 'Srbija', wins: 8, losses: 1 },
];

export default function AnalyticsPage() {
  const [selectedFighter, setSelectedFighter] = useState<typeof fightersData[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  // Performance monitoring
  usePerformanceMonitor('AnalyticsPage');

  // Filtered data
  const filteredFighters = useMemo(() => {
    return fightersData.filter(fighter => 
      fighter.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filters['weightClass'] || fighter.weightClass === filters['weightClass'])
    );
  }, [searchQuery, filters]);

  const handleSearch = (query: string, searchFilters: Record<string, unknown>) => {
    setSearchQuery(query);
    setFilters(searchFilters);
  };

  const handleFighterClick = (fighter: typeof fightersData[0]) => {
    setSelectedFighter(fighter);
    setIsModalOpen(true);
  };

  const searchFilters = [
    {
      key: 'weightClass',
      label: 'Weight Class',
      type: 'select' as const,
      options: [
        { value: 'Lightweight', label: 'Lightweight' },
        { value: 'Welterweight', label: 'Welterweight' },
        { value: 'Middleweight', label: 'Middleweight' },
        { value: 'Heavyweight', label: 'Heavyweight' },
        { value: 'Featherweight', label: 'Featherweight' },
        { value: 'Bantamweight', label: 'Bantamweight' },
      ]
    }
  ];

  const tableColumns = [
    {
      key: 'name' as keyof typeof fightersData[0],
      label: 'Ime',
      sortable: true,
    },
    {
      key: 'weightClass' as keyof typeof fightersData[0],
      label: 'Kategorija',
      sortable: true,
    },
    {
      key: 'record' as keyof typeof fightersData[0],
      label: 'Rekord',
      sortable: true,
    },
    {
      key: 'nationality' as keyof typeof fightersData[0],
      label: 'Nacionalnost',
      sortable: true,
    },
    {
      key: 'wins' as keyof typeof fightersData[0],
      label: 'Pobede',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-green-400 font-bold">{String(value)}</span>
      ),
    },
    {
      key: 'losses' as keyof typeof fightersData[0],
      label: 'Porazi',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-red-400 font-bold">{String(value)}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            MMA <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Analytics
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Napredne analize i statistike MMA boraca i događaja
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <AdvancedSearch
            onSearch={handleSearch}
            placeholder="Pretraži borce..."
            filters={searchFilters}
            className="max-w-2xl"
          />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <InteractiveCard
            title="Ukupno Boraca"
            className="text-center"
            actions={[
              {
                label: 'Detalji',
                icon: () => <span>📊</span>,
                onClick: () => console.log('View details'),
                variant: 'primary'
              }
            ]}
          >
            <div className="text-3xl font-bold text-green-400 mb-2">
              <AnimatedCounter value={127} />
            </div>
            <p className="text-gray-400">Aktivni borci</p>
          </InteractiveCard>

          <InteractiveCard
            title="Događaji ove godine"
            className="text-center"
            actions={[
              {
                label: 'Kalendar',
                icon: () => <span>📅</span>,
                onClick: () => console.log('View calendar'),
                variant: 'secondary'
              }
            ]}
          >
            <div className="text-3xl font-bold text-blue-400 mb-2">
              <AnimatedCounter value={23} />
            </div>
            <p className="text-gray-400">Organizovano</p>
          </InteractiveCard>

          <InteractiveCard
            title="Klubovi"
            className="text-center"
            actions={[
              {
                label: 'Mapa',
                icon: () => <span>🗺️</span>,
                onClick: () => console.log('View map'),
                variant: 'secondary'
              }
            ]}
          >
            <div className="text-3xl font-bold text-purple-400 mb-2">
              <AnimatedCounter value={45} />
            </div>
            <p className="text-gray-400">Registrovano</p>
          </InteractiveCard>

          <InteractiveCard
            title="Prosječna ocena"
            className="text-center"
            actions={[
              {
                label: 'Rang lista',
                icon: () => <span>🏆</span>,
                onClick: () => console.log('View rankings'),
                variant: 'primary'
              }
            ]}
          >
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              <AnimatedCounter value={8.7} decimals={1} />
            </div>
            <p className="text-gray-400">Od 10</p>
          </InteractiveCard>
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Fighter Stats Donut Chart */}
          <InteractiveCard
            title="Statistike Boraca"
            description="Raspodela pobeda, poraza i nerešenih mečeva"
            className="p-6"
          >
            <DonutChart
              data={fighterStatsData}
              size={250}
              showLabels
              showValues
            />
          </InteractiveCard>

          {/* Performance Line Chart */}
          <InteractiveCard
            title="Performanse kroz vreme"
            description="Mesečni trend performansi boraca"
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
        </motion.div>

        {/* Weight Classes Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <InteractiveCard
            title="Raspodela po kategorijama"
            description="Broj boraca po težinskim kategorijama"
            className="p-6"
          >
            <BarChart
              data={weightClassData}
              width={800}
              height={300}
              showValues
            />
          </InteractiveCard>
        </motion.div>

        {/* Fighters Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <InteractiveCard
            title="Lista Boraca"
            description="Detaljni pregled svih boraca sa mogućnošću sortiranja"
            className="p-0"
          >
            <DataTable
              data={filteredFighters}
              columns={tableColumns}
              onRowClick={handleFighterClick}
              emptyMessage="Nema boraca koji odgovaraju kriterijumima pretrage"
            />
          </InteractiveCard>
        </motion.div>

        {/* Fighter Detail Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedFighter?.name || ''}
          size="lg"
        >
          {selectedFighter && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Osnovne informacije</h4>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="font-medium">Kategorija:</span> {selectedFighter.weightClass}</p>
                    <p><span className="font-medium">Rekord:</span> {selectedFighter.record}</p>
                    <p><span className="font-medium">Nacionalnost:</span> {selectedFighter.nationality}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Statistike</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Pobede:</span>
                      <span className="text-green-400 font-bold">{selectedFighter.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Porazi:</span>
                      <span className="text-red-400 font-bold">{selectedFighter.losses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Win Rate:</span>
                      <span className="text-blue-400 font-bold">
                        {((selectedFighter.wins / (selectedFighter.wins + selectedFighter.losses)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Performanse po kategorijama</h4>
                <BarChart
                  data={[
                    { category: 'Striking', value: 85 },
                    { category: 'Grappling', value: 78 },
                    { category: 'Cardio', value: 92 },
                    { category: 'Defense', value: 88 },
                  ]}
                  width={600}
                  height={200}
                  showValues
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
