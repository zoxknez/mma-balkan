'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, Filter, Zap, Users, Calendar, Newspaper, MapPin } from 'lucide-react';
import { useSearch, useSearchHistory, SearchResult, SearchSuggestion } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';

const typeIcons = {
  fighter: Users,
  event: Calendar,
  news: Newspaper,
  club: MapPin,
  category: Filter,
  location: MapPin,
};

const typeColors = {
  fighter: 'text-blue-400',
  event: 'text-green-400',
  news: 'text-purple-400',
  club: 'text-orange-400',
};

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onResultClick?: (result: SearchResult) => void;
  showFilters?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({ 
  placeholder = "Pretraži borce, događaje, vesti...",
  className = "",
  onResultClick,
  showFilters = true,
  autoFocus = false
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    results,
    suggestions,
    filters,
    searchStats,
    clearSearch,
    searchByType,
    clearFilters,
  } = useSearch({ limit: 10, autocomplete: true });

  const { history, addToHistory, clearHistory } = useSearchHistory();

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    addToHistory(query);
    onResultClick?.(result);
    setIsOpen(false);
    setQuery('');
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    addToHistory(suggestion.text);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const allItems = [...suggestions, ...results];
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < allItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : allItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < allItems.length) {
          const item = allItems[focusedIndex];
          if (item) {
            if ('type' in item) {
              handleResultClick(item as SearchResult);
            } else {
              handleSuggestionClick(item as SearchSuggestion);
            }
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (query || suggestions.length > 0 || results.length > 0) {
      setIsOpen(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const displayItems = query ? [...suggestions, ...results] : history.slice(0, 5);

  return (
    <div className={cn("relative w-full", className)} ref={resultsRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-200"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && displayItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            {/* Filters */}
            {showFilters && query && (
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-400">Filtriraj:</span>
                  {(['fighter', 'event', 'news', 'club'] as const).map((type) => {
                    const Icon = typeIcons[type];
                    const isActive = filters.type?.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => searchByType(type)}
                        className={cn(
                          'flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                          isActive
                            ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50'
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        {type === 'fighter' ? 'Borci' : 
                         type === 'event' ? 'Događaji' :
                         type === 'news' ? 'Vesti' : 'Klubovi'}
                      </button>
                    );
                  })}
                  {Object.keys(filters).length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-gray-400 hover:text-white px-2 py-1"
                    >
                      Obriši filtere
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Results */}
            <div className="p-2">
              {query ? (
                <>
                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mb-3">
                      <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Predlozi
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <SearchSuggestionItem
                          key={suggestion.id}
                          suggestion={suggestion}
                          isFocused={focusedIndex === index}
                          onClick={() => handleSuggestionClick(suggestion)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Search Results */}
                  {results.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Rezultati ({results.length})
                      </div>
                      {results.map((result, index) => (
                        <SearchResultItem
                          key={result.id}
                          result={result}
                          isFocused={focusedIndex === suggestions.length + index}
                          onClick={() => handleResultClick(result)}
                        />
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {suggestions.length === 0 && results.length === 0 && !searchStats.isLoading && (
                    <div className="px-4 py-8 text-center text-gray-400">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nema rezultata za &quot;{query}&quot;</p>
                    </div>
                  )}

                  {/* Loading */}
                  {searchStats.isLoading && (
                    <div className="px-4 py-8 text-center text-gray-400">
                      <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p>Pretražujem...</p>
                    </div>
                  )}
                </>
              ) : (
                /* Search History */
                <div>
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Nedavne pretrage
                    </div>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Obriši
                    </button>
                  </div>
                  {history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(item);
                        addToHistory(item);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Search Result Item Component
function SearchResultItem({ 
  result, 
  isFocused, 
  onClick 
}: { 
  result: SearchResult; 
  isFocused: boolean; 
  onClick: () => void; 
}) {
  const Icon = typeIcons[result.type];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors',
        isFocused ? 'bg-white/10' : 'hover:bg-white/5'
      )}
    >
      <div className={cn('flex-shrink-0', typeColors[result.type])}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white truncate">
          {result.title}
        </div>
        {result.subtitle && (
          <div className="text-sm text-gray-400 truncate">
            {result.subtitle}
          </div>
        )}
        {result.description && (
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
            {result.description}
          </div>
        )}
      </div>
      
      <div className="flex-shrink-0 text-xs text-gray-500">
        {Math.round(result.score * 100)}%
      </div>
    </button>
  );
}

// Search Suggestion Item Component
function SearchSuggestionItem({ 
  suggestion, 
  isFocused, 
  onClick 
}: { 
  suggestion: SearchSuggestion; 
  isFocused: boolean; 
  onClick: () => void; 
}) {
  const Icon = typeIcons[suggestion.type] || Zap;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors',
        isFocused ? 'bg-white/10' : 'hover:bg-white/5'
      )}
    >
      <div className="flex-shrink-0 text-gray-400">
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-300 truncate">
          {suggestion.text}
        </div>
        {suggestion.count && (
          <div className="text-xs text-gray-500">
            {suggestion.count} rezultata
          </div>
        )}
      </div>
    </button>
  );
}
