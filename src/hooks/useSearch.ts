'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { useApiCache } from './useCache';
import { monitoring } from '@/lib/monitoring';

export interface SearchResult {
  id: string;
  type: 'fighter' | 'event' | 'news' | 'club';
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  url: string;
  score: number;
  highlights: string[];
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'fighter' | 'event' | 'news' | 'club' | 'category' | 'location';
  count?: number;
}

export interface SearchFilters {
  type?: ('fighter' | 'event' | 'news' | 'club')[];
  category?: string[];
  location?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface SearchOptions {
  limit?: number;
  fuzzy?: boolean;
  highlight?: boolean;
  autocomplete?: boolean;
}

// Fuzzy search implementation (currently unused but kept for future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _fuzzySearch(query: string, text: string): { score: number; highlights: string[] } {
  if (!query || !text) return { score: 0, highlights: [] };

  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    const startIndex = textLower.indexOf(queryLower);
    const highlights = [
      text.substring(0, startIndex),
      text.substring(startIndex, startIndex + query.length),
      text.substring(startIndex + query.length)
    ];
    return { score: 1, highlights };
  }

  // Fuzzy matching
  let score = 0;
  let queryIndex = 0;
  const highlights: string[] = [];
  let currentHighlight = '';

  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 1;
      currentHighlight += text[i] as string;
      queryIndex++;
    } else {
      if (currentHighlight) {
        highlights.push(currentHighlight);
        currentHighlight = '';
      }
      highlights.push(text[i] as string);
    }
  }

  if (currentHighlight) {
    highlights.push(currentHighlight);
  }

  // Normalize score
  score = score / query.length;
  
  return { score, highlights };
}

export function useSearch(options: SearchOptions = {}) {
  const {
    limit = 20,
    fuzzy = true,
    highlight = true,
    autocomplete = true,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const debouncedQuery = useDebounce(query, 300);
  
  // Memoize cache options to prevent infinite loops
  const cacheOptions = useMemo(() => ({ ttl: 5 * 60 * 1000 }), []);
  const cache = useApiCache<SearchResult[]>(cacheOptions); // 5 minutes

  // Search function
  const search = useCallback(async (searchQuery: string, searchFilters: SearchFilters = {}) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = `search:${searchQuery}:${JSON.stringify(searchFilters)}`;
      const cachedResults = cache.get(cacheKey);
      
      if (cachedResults) {
        setResults(cachedResults);
        setIsLoading(false);
        return;
      }

      // Perform search
      const searchParams = new URLSearchParams({
        q: searchQuery,
        limit: limit.toString(),
        fuzzy: fuzzy.toString(),
        highlight: highlight.toString(),
        ...(searchFilters.type && { type: searchFilters.type.join(',') }),
        ...(searchFilters.category && { category: searchFilters.category.join(',') }),
        ...(searchFilters.location && { location: searchFilters.location.join(',') }),
        ...(searchFilters.dateRange && {
          from: searchFilters.dateRange.from.toISOString(),
          to: searchFilters.dateRange.to.toISOString(),
        }),
      });

      const response = await fetch(`/api/search?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const searchResults = data.data || [];
        setResults(searchResults);
        cache.set(cacheKey, searchResults);
        
        // Track search
        monitoring.analytics.trackAction('search_performed', 'search', {
          query: searchQuery,
          resultsCount: searchResults.length,
          filters: searchFilters,
        });
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Search error:', err);
      
      // Track search error
      monitoring.errorTracking.trackUserError('search_failed', err as Error, {
        query: searchQuery,
        filters: searchFilters,
      });
    } finally {
      setIsLoading(false);
    }
  }, [limit, fuzzy, highlight, cache]);

  // Autocomplete function
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !autocomplete) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.data || []);
        }
      }
    } catch (err) {
      console.error('Suggestions error:', err);
    }
  }, [autocomplete]);

  // Search when query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(prev => (prev.length ? [] : prev));
      return;
    }

    void search(debouncedQuery, filtersRef.current);
  }, [debouncedQuery, search, filtersKey]);

  // Get suggestions when query changes
  useEffect(() => {
    if (query && autocomplete) {
      getSuggestions(query);
    } else {
      setSuggestions(prev => (prev.length ? [] : prev));
    }
  }, [query, getSuggestions, autocomplete]);

  // Clear results when query is empty
  useEffect(() => {
    if (!query) {
      setResults(prev => (prev.length ? [] : prev));
      setSuggestions(prev => (prev.length ? [] : prev));
    }
  }, [query]);

  // Memoized search stats
  const searchStats = useMemo(() => ({
    totalResults: results.length,
    hasResults: results.length > 0,
    isLoading,
    error,
    query: debouncedQuery,
  }), [results.length, isLoading, error, debouncedQuery]);

  // Search by type
  const searchByType = useCallback((type: 'fighter' | 'event' | 'news' | 'club') => {
    setFilters(prev => ({ ...prev, type: [type] }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    // State
    query,
    setQuery,
    results,
    suggestions,
    filters,
    setFilters,
    searchStats,
    
    // Actions
    search,
    getSuggestions,
    searchByType,
    clearFilters,
    clearSearch,
  };
}

// Hook for search suggestions
export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSuggestions(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  return { suggestions, isLoading };
}

// Hook for search history
export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('search-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    setHistory(prev => {
      const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 10);
      localStorage.setItem('search-history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('search-history');
  }, []);

  return { history, addToHistory, clearHistory };
}
