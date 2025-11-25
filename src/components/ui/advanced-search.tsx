'use client';

import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export interface AdvancedSearchProps {
  onSearch: (query: string, filters: Record<string, unknown>) => void;
  placeholder?: string;
  className?: string;
  filters?: Array<{
    key: string;
    label: string;
    type: 'select' | 'range' | 'checkbox' | 'date';
    options?: Array<{ value: string; label: string }>;
    min?: number;
    max?: number;
  }>;
}

export const AdvancedSearch = memo<AdvancedSearchProps>(({
  onSearch,
  placeholder = 'Search...',
  className = '',
  filters = []
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      await onSearch(query, filterValues);
    } finally {
      setIsSearching(false);
    }
  }, [query, filterValues, onSearch]);

  const handleFilterChange = useCallback((key: string, value: unknown) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-green-400 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <span>Filters</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-800/50 border border-gray-600 rounded-lg space-y-4"
          >
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {filter.label}
                </label>
                
                {filter.type === 'select' && filter.options && (
                  <select
                    value={String(filterValues[filter.key] || '')}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:border-green-400 focus:outline-none"
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                
                {filter.type === 'range' && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={filter.min || 0}
                      max={filter.max || 100}
                      value={Number(filterValues[filter.key] || filter.min || 0)}
                      onChange={(e) => handleFilterChange(filter.key, parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-400 text-center">
                      {String(filterValues[filter.key] || filter.min || 0)}
                    </div>
                  </div>
                )}
                
                {filter.type === 'checkbox' && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(filterValues[filter.key] as string[] || []).includes(option.value)}
                          onChange={(e) => {
                            const current = filterValues[filter.key] as string[] || [];
                            const updated = e.target.checked
                              ? [...current, option.value]
                              : current.filter((v: string) => v !== option.value);
                            handleFilterChange(filter.key, updated);
                          }}
                          className="rounded border-gray-600 text-green-400 focus:ring-green-400"
                        />
                        <span className="text-sm text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {filter.type === 'date' && (
                  <input
                    type="date"
                    value={String(filterValues[filter.key] || '')}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:border-green-400 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AdvancedSearch.displayName = 'AdvancedSearch';
