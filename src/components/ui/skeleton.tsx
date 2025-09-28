'use client';

import React from 'react';
import clsx from 'clsx';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | boolean;
};

export function Skeleton({ className, rounded = 'lg', ...props }: SkeletonProps) {
  const radius = rounded === true ? 'rounded-lg' : rounded === false ? '' : `rounded-${rounded}`;
  return (
    <div
      className={clsx('bg-gray-700/40 animate-pulse', radius, className)}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={clsx('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

export default Skeleton;
