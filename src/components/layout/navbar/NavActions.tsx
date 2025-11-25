'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/NotificationCenter';
import { SearchBar } from '@/components/SearchBar';

interface NavActionsProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export function NavActions({ isMobileMenuOpen, onMobileMenuToggle }: NavActionsProps) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Search Bar */}
      <div className="hidden lg:block w-80">
        <SearchBar 
          placeholder="Pretraži borce, događaje, vesti..."
          className="w-full"
        />
      </div>

      {/* Notifications */}
      <NotificationCenter />

      {/* Mobile Search Button */}
      <motion.button 
        aria-label="Pretraga"
        className="lg:hidden relative p-3 text-gray-400 hover:text-green-400 rounded-xl transition-all duration-200 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 border border-transparent group-hover:border-green-400/30 rounded-xl transition-colors" />
        <Search className="w-5 h-5 relative z-10 group-hover:drop-shadow-lg" />
        
        {/* Scan effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/30 to-transparent opacity-0 group-hover:opacity-100"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "linear"
          }}
        />
      </motion.button>

      {/* Korisnički meni */}
      <div className="hidden sm:flex items-center space-x-3">
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button 
            variant="ghost" 
            size="sm"
            className="relative overflow-hidden border border-transparent hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm leading-none whitespace-nowrap"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"
              whileHover={{ x: ['-100%', '100%'] }}
              transition={{ duration: 0.6 }}
            />
            <User className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Profil</span>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Button 
            variant="neon" 
            size="sm"
            className="relative overflow-hidden group h-9 px-4 leading-none whitespace-nowrap"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-20"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <span className="relative z-10 font-semibold">Prijavi se</span>
            
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 bg-green-400/30 rounded-lg opacity-0 group-hover:opacity-100"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </Button>
        </motion.div>
      </div>

      {/* Holographic Mobile Menu Button */}
      <motion.button
        onClick={onMobileMenuToggle}
        aria-label={isMobileMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
        aria-expanded={isMobileMenuOpen}
        className="md:hidden relative p-3 text-gray-300 hover:text-green-400 rounded-xl transition-all duration-200 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isMobileMenuOpen ? {
          rotate: 180,
          backgroundColor: 'rgba(0, 255, 136, 0.10)'
        } : {
          rotate: 0,
          backgroundColor: 'transparent'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 border border-transparent group-hover:border-green-400/30 rounded-xl transition-colors" />
        {/* Attention halo when closed (mobile) - simplified, no label */}
        {!isMobileMenuOpen && (
          <motion.div
            className="pointer-events-none absolute -inset-3 rounded-2xl bg-green-400/10 blur-lg"
            animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.03, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        )}
        
        <AnimatePresence mode="wait">
          {isMobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <Menu className="w-5 h-5 drop-shadow-[0_0_6px_#00ff88] text-green-300" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Holographic rings */}
        {isMobileMenuOpen && (
          <>
            <div className="absolute inset-0 rounded-xl border border-green-400/50 animate-ping" />
            <div className="absolute inset-1 rounded-lg border border-blue-400/30 animate-pulse" />
          </>
        )}
      </motion.button>
    </div>
  );
}
