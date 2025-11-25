'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface DesktopNavProps {
  navigation: NavigationItem[];
}

export function DesktopNav({ navigation }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <div data-testid="desktop-menu" className="hidden md:flex items-center gap-3 lg:gap-4 flex-1 justify-center">
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
              data-testid="nav-link"
              className={cn(
                'nav-link relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 group overflow-hidden whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50 focus-visible:ring-offset-0',
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
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
