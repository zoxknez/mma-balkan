'use client';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl">
            <Skeleton className="h-40 w-full rounded-xl mb-3" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <SkeletonText lines={2} />
          </div>
        ))}
      </div>
    </div>
  );
}
