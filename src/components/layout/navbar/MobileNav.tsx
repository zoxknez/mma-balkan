'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
}

export function MobileNav({ isOpen, onClose, navigation }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          data-testid="mobile-menu"
          className="md:hidden border-t border-green-400/20 bg-gray-900/95 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
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
                    onClick={onClose}
                    data-testid="nav-link"
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
  );
}
