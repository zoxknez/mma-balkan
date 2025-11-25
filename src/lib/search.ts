'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// Search types
export interface SearchFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'range' | 'date' | 'checkbox' | 'multiselect';
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface SearchResult<T = Record<string, unknown>> {
  item: T;
  score: number;
  highlights: Array<{
    field: string;
    value: string;
    highlighted: string;
  }>;
}

export interface SearchConfig {
  minQueryLength?: number;
  maxResults?: number;
  debounceMs?: number;
  searchFields?: string[];
  weights?: Record<string, number>;
  fuzzyThreshold?: number;
}

// Fuzzy search implementation
function fuzzySearch(query: string, text: string): number {
  if (!query) return 1;
  if (!text) return 0;

  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact match
  if (textLower.includes(queryLower)) {
    return 1;
  }

  // Fuzzy matching using Levenshtein distance
  const distance = levenshteinDistance(queryLower, textLower);
  const maxLength = Math.max(queryLower.length, textLower.length);
  
  return 1 - (distance / maxLength);
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = new Array(str1.length + 1).fill(0);
  }

  if (!matrix[0]) return str2.length;

  for (let i = 0; i <= str1.length; i++) {
    const row = matrix[0];
    if (row) {
      row[i] = i;
    }
  }

  for (let j = 0; j <= str2.length; j++) {
    const row = matrix[j];
    if (row) {
      row[0] = j;
    }
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      const currentRow = matrix[j];
      const prevRow = matrix[j - 1];
      
      if (currentRow && prevRow) {
        currentRow[i] = Math.min(
          (currentRow[i - 1] ?? 0) + 1,
          (prevRow[i] ?? 0) + 1,
          (prevRow[i - 1] ?? 0) + indicator
        );
      }
    }
  }

  const lastRow = matrix[str2.length];
  if (!lastRow) return str2.length;
  return lastRow[str1.length] ?? str2.length;
}

// Highlight text
function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
}

// Search hook
export function useSearch<T extends Record<string, unknown>>(
  data: T[],
  config: SearchConfig = {}
) {
  const {
    minQueryLength = 2,
    maxResults = 50,
    debounceMs = 300,
    searchFields = [],
    weights = {},
    fuzzyThreshold = 0.3
  } = config;

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult<T>[]>([]);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string, searchFilters: Record<string, unknown>) => {
      setIsSearching(true);
      
      try {
        const searchResults = performSearch(
          data,
          searchQuery,
          searchFilters,
          {
            minQueryLength,
            maxResults,
            debounceMs,
            searchFields,
            weights,
            fuzzyThreshold
          }
        );
        
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, debounceMs),
    [data, minQueryLength, maxResults, searchFields, weights, fuzzyThreshold, debounceMs]
  );

  // Perform search when query or filters change
  useEffect(() => {
    debouncedSearch(query, filters);
  }, [query, filters, debouncedSearch]);

  // Search function
  const search = useCallback((searchQuery: string, searchFilters: Record<string, unknown>) => {
    setQuery(searchQuery);
    setFilters(searchFilters);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    setResults([]);
  }, []);

  // Get search suggestions
  const getSuggestions = useCallback((searchQuery: string, limit: number = 5): string[] => {
    if (!searchQuery || searchQuery.length < minQueryLength) return [];

    const suggestions = new Set<string>();
    
    data.forEach(item => {
      searchFields.forEach(field => {
        const value = item[field];
        if (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(value);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }, [data, searchFields, minQueryLength]);

  return {
    query,
    filters,
    results,
    isSearching,
    search,
    clearSearch,
    getSuggestions
  };
}

// Perform search
function performSearch<T extends Record<string, unknown>>(
  data: T[],
  query: string,
  filters: Record<string, unknown>,
  config: Required<SearchConfig>
): SearchResult<T>[] {
  const { minQueryLength, maxResults, searchFields, weights, fuzzyThreshold } = config;

  // Filter data first
  let filteredData = data;

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      filteredData = filteredData.filter(item => {
        const itemValue = item[key];
        
        if (Array.isArray(value)) {
          return Array.isArray(itemValue) 
            ? value.some(v => itemValue.includes(v))
            : value.includes(itemValue);
        }
        
        if (typeof value === 'string') {
          return typeof itemValue === 'string' && 
            itemValue.toLowerCase().includes(value.toLowerCase());
        }
        
        return itemValue === value;
      });
    }
  });

  // If no query, return filtered results
  if (!query || query.length < minQueryLength) {
    return filteredData.slice(0, maxResults).map(item => ({
      item,
      score: 1,
      highlights: []
    }));
  }

  // Perform text search
  const searchResults: SearchResult<T>[] = [];

  filteredData.forEach(item => {
    let totalScore = 0;
    let fieldCount = 0;
    const highlights: Array<{ field: string; value: string; highlighted: string }> = [];

    // Search in specified fields or all string fields
    const fieldsToSearch = searchFields.length > 0 
      ? searchFields 
      : Object.keys(item).filter(key => typeof item[key] === 'string');

    fieldsToSearch.forEach(field => {
      const value = item[field];
      if (typeof value === 'string') {
        const score = fuzzySearch(query, value);
        const weight = weights[field] || 1;
        
        if (score > fuzzyThreshold) {
          totalScore += score * weight;
          fieldCount++;
          
          highlights.push({
            field,
            value,
            highlighted: highlightText(value, query)
          });
        }
      }
    });

    if (fieldCount > 0) {
      searchResults.push({
        item,
        score: totalScore / fieldCount,
        highlights
      });
    }
  });

  // Sort by score and limit results
  return searchResults
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

// Debounce utility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Search utilities
export const searchUtils = {
  // Create search filters for common types
  createTextFilter: (key: string, label: string, placeholder?: string): SearchFilter => {
    const filter: SearchFilter = {
      key,
      label,
      type: 'text'
    };
    if (placeholder) {
      filter.placeholder = placeholder;
    }
    return filter;
  },

  createSelectFilter: (key: string, label: string, options: Array<{ value: string; label: string }>): SearchFilter => ({
    key,
    label,
    type: 'select',
    options
  }),

  createRangeFilter: (key: string, label: string, min: number, max: number, step: number = 1): SearchFilter => ({
    key,
    label,
    type: 'range',
    min,
    max,
    step
  }),

  createDateFilter: (key: string, label: string): SearchFilter => ({
    key,
    label,
    type: 'date'
  }),

  createCheckboxFilter: (key: string, label: string, options: Array<{ value: string; label: string }>): SearchFilter => ({
    key,
    label,
    type: 'checkbox',
    options
  }),

  createMultiselectFilter: (key: string, label: string, options: Array<{ value: string; label: string }>): SearchFilter => ({
    key,
    label,
    type: 'multiselect',
    options
  }),

  // Get search result summary
  getSearchSummary: (results: SearchResult[], query: string): string => {
    if (!query) return `${results.length} rezultata`;
    return `${results.length} rezultata za "${query}"`;
  },

  // Check if search is active
  isSearchActive: (query: string, filters: Record<string, unknown>): boolean => {
    return query.length > 0 || Object.values(filters).some(value => 
      value !== undefined && value !== null && value !== ''
    );
  },

  // Get search suggestions from results
  getSuggestionsFromResults: (results: SearchResult[], field: string, limit: number = 5): string[] => {
    const suggestions = new Set<string>();
    
    results.forEach(result => {
      const value = result.item[field];
      if (typeof value === 'string') {
        suggestions.add(value);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }
};
