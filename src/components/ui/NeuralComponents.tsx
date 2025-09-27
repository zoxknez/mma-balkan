'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X, Filter } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface NeuralSelectProps {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function NeuralSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option...",
  className = '' 
}: NeuralSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      {/* Select Button */}
      <motion.button
        className="w-full glass-card p-4 flex items-center justify-between text-left hover:border-green-400/50 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          {selectedOption?.icon}
          <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-green-400" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 z-50 mt-2 glass-card border border-green-400/30 max-h-80 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search */}
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  className="w-full p-3 flex items-center space-x-3 text-left hover:bg-green-400/10 hover:text-green-400 transition-colors"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {option.icon}
                  <span>{option.label}</span>
                  {option.value === value && (
                    <div className="ml-auto w-2 h-2 bg-green-400 rounded-full" />
                  )}
                </motion.button>
              ))}
              
              {filteredOptions.length === 0 && (
                <div className="p-6 text-center text-gray-400">
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Neural Search Input
interface NeuralSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

export function NeuralSearch({ 
  value, 
  onChange, 
  placeholder = "Search...",
  suggestions = [],
  onSuggestionClick,
  className = ''
}: NeuralSearchProps) {
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

// Animated Counter
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  className = '', 
  prefix = '', 
  suffix = '' 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      const startTime = Date.now();
      const startValue = displayValue;
      const difference = value - startValue;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + difference * easeOut);
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [inView, value, duration, displayValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// Glitch Text Effect
interface GlitchTextProps {
  text: string;
  className?: string;
  trigger?: boolean;
}

export function GlitchText({ text, className = '', trigger = false }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (trigger) {
      setIsGlitching(true);
      
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
      const originalText = text;
      
      let iterations = 0;
      const interval = setInterval(() => {
        setDisplayText(
          originalText.split('').map((char, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }).join('')
        );
        
        iterations += 1 / 3;
        
        if (iterations >= originalText.length) {
          clearInterval(interval);
          setDisplayText(originalText);
          setIsGlitching(false);
        }
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [trigger, text]);

  return (
    <span 
      className={`${className} ${isGlitching ? 'animate-pulse' : ''}`}
      style={{
        textShadow: isGlitching ? 
          '0.05em 0 0 #00ff88, -0.025em -0.05em 0 #00ccff, 0.025em 0.05em 0 #ff3366' : 
          'none'
      }}
    >
      {displayText}
    </span>
  );
}