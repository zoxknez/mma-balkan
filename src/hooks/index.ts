/**
 * Central export point for all custom hooks
 * Import hooks from this file for cleaner imports
 * 
 * @example
 * import { useAsync, useNavigation, useDebounce } from '@/hooks';
 */

// Data fetching hooks
export { useActivity } from './useActivity';
export type { ActivityItem } from './useActivity';

export { useClubs, useClub } from './useClubs';
export type { Club } from './useClubs';

export { useEvents, useUpcomingEvents, useLiveEvents } from './useEvents';
export type { Event } from './useEvents';

export { useFighters, useTrendingFighters } from './useFighters';

export { useEventFights, useFighterHistory, useFighterUpcoming } from './useFights';

export { useNews, useNewsItem } from './useNews';
export type { ApiNews, NewsParams } from './useNews';

// Resource hooks
export {
  createResourceHook,
  createSingleResourceHook,
  createInfiniteResourceHook,
  usePrefetchResource,
} from './useResource';
export type {
  ResourceHookResult,
  PaginatedResourceHookResult,
  ResourceFetcher,
} from './useResource';

// Async operations
export {
  useAsync,
  useAsyncSubmit,
  useMutation,
  usePolling,
} from './useAsync';

// Authentication
export {
  useAuthInit,
  useLogout,
  useRequireAuth,
  useRequireRole,
  useRequireAdmin,
  useRequireModerator,
} from './useAuthInit';

// Navigation
export {
  useNavigation,
  usePrefetchOnHover,
  usePrefetchRoutes,
  useRouteChange,
  useIsActiveRoute,
  useBreadcrumbs,
} from './useNavigation';

// Form utilities
export {
  useDebounce,
  useDebouncedCallback,
  useThrottledCallback,
  useSearchInput,
} from './useDebounce';

export { useFormValidation } from './useFormValidation';

// Other utilities
export { useCache } from './useCache';
export { useCountdown } from './useCountdown';
export { useDataSync } from './useDataSync';
export { useErrorHandler } from './useErrorHandler';
export { useNotifications } from './useNotifications';
export { useOptimisticUpdates } from './useOptimisticUpdates';
export { usePerformanceMonitor } from './usePerformanceMonitor';
export { useSearch } from './useSearch';

// Feature-specific hooks
export { useClub as useClubDetail } from './useClub';
export { useEvent } from './useEvent';
export { useFighter } from './useFighter';
