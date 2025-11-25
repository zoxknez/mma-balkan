'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

// Default loading skeleton
const DefaultFallback = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-4"
  >
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-32 w-full" />
  </motion.div>
);

export function LazyWrapper({ 
  children, 
  fallback = <DefaultFallback />,
  className = ''
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </Suspense>
  );
}

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Specific lazy components - these will be created when needed
// For now, we'll create placeholder components

interface FighterCardProps {
  fighter: {
    id: string;
    name: string;
    [key: string]: unknown;
  };
  onFollow?: (id: string) => void;
  isFollowing?: boolean;
  showStats?: boolean;
}

export const LazyFighterCard = withLazyLoading<FighterCardProps>(
  () => import('@/components/fighters/fighter-card').then(module => ({ default: module.FighterCard }))
);

// Placeholder for other components that don't exist yet
export const LazyEventCard = withLazyLoading<object>(
  () => Promise.resolve({ default: () => <div>Event Card - Coming Soon</div> })
);

export const LazyNewsCard = withLazyLoading<object>(
  () => Promise.resolve({ default: () => <div>News Card - Coming Soon</div> })
);

export const LazyClubCard = withLazyLoading<object>(
  () => Promise.resolve({ default: () => <div>Club Card - Coming Soon</div> })
);
