'use client';

import React, { useState, useMemo } from 'react';
import { useFighters } from '@/hooks/useFighters';
import { useSearchInput } from '@/hooks/useDebounce';
import { FightersHeader } from '@/components/fighters/FightersHeader';
import { FightersStats } from '@/components/fighters/FightersStats';
import { FightersControls } from '@/components/fighters/FightersControls';
import { FightersGrid } from '@/components/fighters/FightersGrid';
import { NoResults } from '@/components/fighters/NoResults';

export default function FightersPage() {
  const { data: fighters, isLoading } = useFighters({});
  const { value: searchQuery, setValue: setSearchQuery, debouncedValue: debouncedQuery } = useSearchInput();
  const [selectedWeightClass, setSelectedWeightClass] = useState('all');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'wins'>('rank');

  const weightClasses = useMemo(() => {
    const classes = new Set(fighters.map(f => f.weightClass));
    return Array.from(classes).sort();
  }, [fighters]);

  const filteredFighters = useMemo(() => {
    let result = [...fighters];

    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(query) ||
        f.nickname?.toLowerCase().includes(query) ||
        f.club?.name.toLowerCase().includes(query)
      );
    }

    if (selectedWeightClass !== 'all') {
      result = result.filter(f => f.weightClass === selectedWeightClass);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'wins':
          return b.wins - a.wins;
        case 'rank':
        default:
          // Handle unranked fighters (rank 0 or undefined)
          if (!a.ranking?.position) return 1;
          if (!b.ranking?.position) return -1;
          return a.ranking.position - b.ranking.position;
      }
    });

    return result;
  }, [fighters, debouncedQuery, selectedWeightClass, sortBy]);

  return (
    <div data-testid="fighters-page" className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <FightersHeader />
        
        <FightersStats filteredCount={filteredFighters.length} />

        <FightersControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedWeightClass={selectedWeightClass}
          setSelectedWeightClass={setSelectedWeightClass}
          sortBy={sortBy}
          setSortBy={setSortBy}
          weightClasses={weightClasses}
        />

        {filteredFighters.length > 0 || isLoading ? (
          <FightersGrid fighters={filteredFighters} isLoading={isLoading} />
        ) : (
          <NoResults />
        )}
      </div>
    </div>
  );
}
