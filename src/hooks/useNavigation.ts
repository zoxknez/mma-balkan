"use client";

import { useCallback, useTransition, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Prefetch cache
const prefetchedRoutes = new Set<string>();

/**
 * Enhanced navigation hook with loading states and prefetching
 */
export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (href: string, options?: { replace?: boolean; scroll?: boolean }) => {
      startTransition(() => {
        const scrollOption = options?.scroll ?? true;
        if (options?.replace) {
          router.replace(href, { scroll: scrollOption });
        } else {
          router.push(href, { scroll: scrollOption });
        }
      });
    },
    [router]
  );

  const prefetch = useCallback(
    (href: string) => {
      if (!prefetchedRoutes.has(href)) {
        router.prefetch(href);
        prefetchedRoutes.add(href);
      }
    },
    [router]
  );

  const goBack = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router]);

  const goForward = useCallback(() => {
    startTransition(() => {
      router.forward();
    });
  }, [router]);

  const refresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  return {
    navigate,
    prefetch,
    goBack,
    goForward,
    refresh,
    pathname,
    isPending,
  };
}

/**
 * Hook for handling link prefetching on hover/focus
 */
export function usePrefetchOnHover(href: string) {
  const { prefetch } = useNavigation();
  const prefetched = useRef(false);

  const handleHover = useCallback(() => {
    if (!prefetched.current) {
      prefetch(href);
      prefetched.current = true;
    }
  }, [href, prefetch]);

  return {
    onMouseEnter: handleHover,
    onFocus: handleHover,
  };
}

/**
 * Hook to prefetch routes when component mounts
 */
export function usePrefetchRoutes(routes: string[]) {
  const { prefetch } = useNavigation();

  useEffect(() => {
    // Delay prefetching slightly to not block initial render
    const timer = setTimeout(() => {
      routes.forEach((route) => {
        prefetch(route);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [routes, prefetch]);
}

/**
 * Hook for tracking route changes
 */
export function useRouteChange(
  onRouteChange: (pathname: string) => void
) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      onRouteChange(pathname);
      previousPathname.current = pathname;
    }
  }, [pathname, onRouteChange]);
}

/**
 * Hook to check if current route matches
 */
export function useIsActiveRoute(href: string, exact: boolean = false) {
  const pathname = usePathname();

  if (exact) {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

/**
 * Generate breadcrumb items from current path
 */
export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, array) => {
      const href = '/' + array.slice(0, index + 1).join('/');
      const label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return { href, label, isLast: index === array.length - 1 };
    });

  return [{ href: '/', label: 'Početna', isLast: breadcrumbs.length === 0 }, ...breadcrumbs];
}
