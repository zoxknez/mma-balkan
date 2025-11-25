'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Pretraga...",
  suggestions = [],
  onSuggestionClick,
  className = ''
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value
  );

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <motion.div
        className={`glass-card p-4 flex items-center space-x-3 transition-all duration-300 ${
          isFocused ? 'border-green-400/50 shadow-lg shadow-green-400/20' : ''
        }`}
        whileHover={{ scale: 1.02 }}
      >
        <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-green-400' : 'text-gray-400'}`} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
        />
        {value && (
          <motion.button
            onClick={() => onChange('')}
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            className="absolute top-full left-0 right-0 z-50 mt-2 glass-card border border-green-400/30 max-h-60 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                className="w-full p-3 text-left hover:bg-green-400/10 hover:text-green-400 transition-colors"
                onClick={() => {
                  onChange(suggestion);
                  onSuggestionClick?.(suggestion);
                  setShowSuggestions(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{suggestion}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
