'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Calendar, 
  MapPin, 
  Newspaper, 
  MessageCircle,
  User
} from 'lucide-react';
import { AccessibleNav } from '@/components/Accessibility';
import { NavLogo } from './navbar/NavLogo';
import { DesktopNav } from './navbar/DesktopNav';
import { MobileNav } from './navbar/MobileNav';
import { NavActions } from './navbar/NavActions';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [isMobileMenuOpen]);

  const navigation = [
    { name: 'Početna', href: '/', icon: Home },
    { name: 'Borci', href: '/fighters', icon: Users },
    { name: 'Događaji', href: '/events', icon: Calendar },
    { name: 'Klubovi', href: '/clubs', icon: MapPin },
    { name: 'Vesti', href: '/news', icon: Newspaper },
    { name: 'Zajednica', href: '/community', icon: MessageCircle },
    { name: 'Praćenje', href: '/watchlist', icon: User },
  ];

  return (
    <AccessibleNav label="Glavna navigacija">
      <nav
        data-testid="navigation"
        className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-gray-900/70 supports-[backdrop-filter]:bg-gray-900/60 shadow-[0_6px_20px_rgba(0,0,0,0.35)] overflow-hidden"
      >
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
          <div className="flex h-16 items-center justify-between gap-4 flex-nowrap">
            <NavLogo />
            <DesktopNav navigation={navigation} />
            <NavActions 
              isMobileMenuOpen={isMobileMenuOpen} 
              onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
          </div>
        </div>

        <MobileNav 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          navigation={navigation} 
        />
      </nav>
    </AccessibleNav>
  );
}

