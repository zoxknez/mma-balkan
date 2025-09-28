'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  MapPin, 
  Newspaper, 
  MessageCircle,
  Search,
  User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LiveTicker } from '@/components/ui/live-ticker';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isMobileMenuOpen]);

  const navigation = [
    { name: 'Početna', href: '/', icon: Home },
    { name: 'Borci', href: '/fighters', icon: Users },
    { name: 'Događaji', href: '/events', icon: Calendar },
    { name: 'Klubovi', href: '/clubs', icon: MapPin },
    { name: 'Vesti', href: '/news', icon: Newspaper },
    { name: 'Zajednica', href: '/community', icon: MessageCircle },
    { name: 'Watchlist', href: '/watchlist', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900">
      {/* Ultra-Futuristic Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-gray-900/70 supports-[backdrop-filter]:bg-gray-900/60 shadow-[0_6px_20px_rgba(0,0,0,0.35)] overflow-hidden">
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(0,255,136,0.06) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,255,136,0.06) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        {/* Animated Glow Effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-green-400/3 via-blue-600/3 to-green-400/3"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16">
            {/* Ultra-Futuristic Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-3 group">
                {/* Logo */}
                <motion.div 
                  className="relative w-12 h-12"
                  whileHover={{ rotate: 6 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl blur-sm opacity-70" />
                  <div className="relative w-full h-full bg-gray-900 rounded-xl border border-green-400/40 flex items-center justify-center overflow-hidden">
                    <Zap className="w-7 h-7 text-green-300 drop-shadow-[0_0_6px_#00ff88]" />
                  </div>
                </motion.div>
                
                {/* Brand Text */}
                <motion.h1 
                  className="text-2xl font-bold text-white transition-colors relative"
                  whileHover={{ color: '#86efac' }}
                >
                  MMA{' '}
                  <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                    BALKAN
                  </span>
                </motion.h1>
              </Link>
            </motion.div>
            
            {/* Ultra-Futuristic Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'nav-link relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50 focus-visible:ring-offset-0',
                        isActive ? 'text-green-300' : 'text-gray-300 hover:text-white'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Jedini sloj pozadine: aktivan ili hover (bez -z i bez BG/BORDER na Link-u) */}
                      {isActive ? (
                        <span
                          aria-hidden
                          className="absolute inset-0 z-0 rounded-xl bg-white/5 border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,.35)]"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="absolute inset-0 z-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 bg-white/5 border border-white/10"
                        />
                      )}
                      
                      {/* Icon */}
                      <div className="relative z-10">
                        <item.icon className={cn(
                          'w-4 h-4 transition-colors',
                          isActive ? 'text-green-400' : 'text-gray-400 group-hover:text-white'
                        )} />
                      </div>
                      
                      {/* Label */}
                      <span className="relative z-10 font-semibold tracking-wide">
                        {item.name}
                      </span>
                      
                      {/* Optional active indicator (može ostati, ne duplira slojeve) */}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 w-6 h-0.5 -translate-x-1/2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full" />
                      )}
                      
                      {/* no scan-line */}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Ultra-Futuristic Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Quantum Search */}
              <motion.button 
                aria-label="Pretraga"
                className="relative p-3 text-gray-400 hover:text-green-400 rounded-xl transition-all duration-200 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
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

              {/* Neural User Menu */}
              <div className="hidden sm:flex items-center space-x-3">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="relative overflow-hidden border border-transparent hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
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
                    className="relative overflow-hidden group"
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          </div>
        </div>

        {/* Ultra-Futuristic Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="md:hidden border-t border-green-400/20 bg-gray-900/95 backdrop-blur-xl relative overflow-hidden"
            >
              {/* Backdrop overlay */}
              <div className="fixed inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />
              {/* Cyber grid background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(rgba(0,255,136,0.2) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(0,255,136,0.2) 1px, transparent 1px)`,
                  backgroundSize: '15px 15px'
                }} />
              </div>
              
              {/* Animated glow */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-600/10 to-green-400/10"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              
              <div className="px-4 py-6 space-y-2 relative z-10">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-medium transition-colors duration-300 group relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50 focus-visible:ring-offset-0',
                          isActive ? 'text-green-300' : 'text-gray-300 hover:text-white'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {/* Jedini sloj pozadine: aktivan ili hover */}
                        {isActive ? (
                          <span
                            aria-hidden
                            className="absolute inset-0 z-0 rounded-xl bg-white/5 border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,.35)]"
                          />
                        ) : (
                          <span
                            aria-hidden
                            className="absolute inset-0 z-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 bg-white/5 border border-white/10"
                          />
                        )}
                        
                        {/* Icon with glow */}
                        <motion.div
                          className="relative z-10"
                          whileHover={{ scale: 1.1 }}
                          animate={isActive ? {
                            textShadow: [
                              '0 0 5px #00ff88',
                              '0 0 10px #00ff88',
                              '0 0 5px #00ff88'
                            ]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <item.icon className={cn(
                            "w-6 h-6 transition-colors",
                            isActive ? "text-green-400" : "text-gray-400 group-hover:text-white"
                          )} />
                        </motion.div>
                        
                        <span className="relative z-10 font-semibold tracking-wide">{item.name}</span>
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute right-4 w-2 h-2 bg-green-400 rounded-full"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.7, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity
                            }}
                          />
                        )}
                        
                        {/* Scan line effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent opacity-0 group-hover:opacity-100"
                          animate={{
                            x: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: "linear"
                          }}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Ultra-Futuristic Mobile Auth Buttons */}
                <motion.div 
                  className="pt-6 border-t border-green-400/20 space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start relative overflow-hidden border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-lg py-3"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"
                      whileHover={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 0.8 }}
                    />
                    <User className="w-5 h-5 mr-3 relative z-10" />
                    <span className="relative z-10 font-semibold">Profil</span>
                  </Button>
                  
                  <Button 
                    variant="neon" 
                    className="w-full relative overflow-hidden text-lg py-3 group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-20"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <span className="relative z-10 font-bold tracking-wide">Prijavi se</span>
                    
                    {/* Pulse rings */}
                    <motion.div
                      className="absolute inset-0 border-2 border-green-400/50 rounded-lg opacity-0 group-hover:opacity-100"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity
                      }}
                    />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Live ticker for ongoing events moved below navbar */}
        <LiveTicker />
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  MMA <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Balkan</span>
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Prva i jedina platforma koja spaja sve MMA organizacije, borce i klubove 
                sa Balkana na jednom mestu. Lokalni borci, globalne borbe.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Navigacija</h4>
              <ul className="space-y-2">
                {navigation.slice(0, 4).map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@mmabalkan.com</li>
                <li>Beograd, Srbija</li>
                <li>+381 11 123 4567</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 MMA Balkan. Sva prava zadržana.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}