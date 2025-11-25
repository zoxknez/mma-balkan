'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

interface SelectMenuProps {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SelectMenu({ 
  options, 
  value, 
  onChange, 
  placeholder = "Izaberi opciju...",
  className = '' 
}: SelectMenuProps) {
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
                  placeholder="Pretraga..."
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
                  Nema rezultata
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
