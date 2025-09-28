"use client";
import { useRouter } from 'next/navigation';

export function usePrefetch() {
  const router = useRouter();
  return (path: string) => {
    try {
      router.prefetch(path);
    } catch {
      // ignore
    }
  };
}
