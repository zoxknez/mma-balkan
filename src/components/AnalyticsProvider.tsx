'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAnalytics } from '@/lib/analytics';

interface AnalyticsContextType {
  trackEvent: (category: string, action: string, label?: string, value?: number, properties?: Record<string, unknown>) => void;
  trackPageView: (page: string, title?: string) => void;
  trackUserAction: (action: string, category?: string, properties?: Record<string, unknown>) => void;
  trackConversion: (conversionType: string, value?: number, properties?: Record<string, unknown>) => void;
  trackSearch: (query: string, resultsCount: number, filters?: Record<string, unknown>) => void;
  trackError: (error: Error, context?: Record<string, unknown>) => void;
  trackPerformanceMetric: (metric: string, value: number, properties?: Record<string, unknown>) => void;
  trackBusinessMetric: (metric: string, value: number, properties?: Record<string, unknown>) => void;
  setUserId: (userId: string) => void;
  getSessionData: () => unknown;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const analytics = useAnalytics();

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}

// Page view tracking component
export function PageViewTracker() {
  const { trackPageView } = useAnalyticsContext();

  useEffect(() => {
    // Track initial page view
    trackPageView(window.location.pathname, document.title);

    // In App Router, we track page views through the layout or individual pages
    // This component can be used for additional tracking if needed
  }, [trackPageView]);

  return null;
}

// Performance tracking component
export function PerformanceTracker() {
  const { trackPerformanceMetric } = useAnalyticsContext();

  useEffect(() => {
    // Track page load performance
    const trackPageLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      trackPerformanceMetric('page_load_time', navigation.loadEventEnd - navigation.loadEventStart);
      trackPerformanceMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
      trackPerformanceMetric('first_byte', navigation.responseStart - navigation.requestStart);
    };

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
    }

    // Track Core Web Vitals
    const trackCoreWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            trackPerformanceMetric('lcp', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceEntry & { processingStart?: number }) => {
            const processingStart = entry.processingStart || 0;
            trackPerformanceMetric('fid', processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value || 0;
            }
          });
          trackPerformanceMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }
    };

    trackCoreWebVitals();

    return () => {
      window.removeEventListener('load', trackPageLoad);
    };
  }, [trackPerformanceMetric]);

  return null;
}

// Error tracking component
export function ErrorTracker() {
  const { trackError } = useAnalyticsContext();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'javascript_error',
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(event.reason), {
        type: 'promise_rejection',
        reason: event.reason,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackError]);

  return null;
}

// User interaction tracking component
export function InteractionTracker() {
  const { trackUserAction } = useAnalyticsContext();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const element = target.closest('[data-track]');
      
      if (element) {
        const action = element.getAttribute('data-track');
        const category = element.getAttribute('data-category') || 'interaction';
        
        trackUserAction(action!, category, {
          element: target.tagName,
          text: target.textContent?.trim(),
          href: (target as HTMLAnchorElement).href,
        });
      }
    };

    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      
      trackUserAction('form_submit', 'form', {
        formId: form.id,
        formName: form.name,
        formAction: form.action,
      });
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
    };
  }, [trackUserAction]);

  return null;
}

// Scroll depth tracking component
export function ScrollDepthTracker() {
  const { trackUserAction } = useAnalyticsContext();

  useEffect(() => {
    let maxScrollDepth = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    const trackedThresholds = new Set<number>();

    const handleScroll = () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone thresholds
        scrollThresholds.forEach(threshold => {
          if (scrollDepth >= threshold && !trackedThresholds.has(threshold)) {
            trackedThresholds.add(threshold);
            trackUserAction('scroll_depth', 'engagement', {
              depth: threshold,
              page: window.location.pathname,
            });
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackUserAction]);

  return null;
}

// Business metrics tracking component
export function BusinessMetricsTracker() {
  const { trackBusinessMetric } = useAnalyticsContext();

  useEffect(() => {
    // Track user engagement metrics
    const trackEngagement = () => {
      const timeOnPage = Date.now() - performance.timeOrigin;
      trackBusinessMetric('time_on_page', timeOnPage);
    };

    // Track when user leaves the page
    const handleBeforeUnload = () => {
      trackEngagement();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Track session duration
    const sessionStart = Date.now();
    const trackSessionDuration = () => {
      const sessionDuration = Date.now() - sessionStart;
      trackBusinessMetric('session_duration', sessionDuration);
    };

    // Track session duration every 30 seconds
    const interval = setInterval(trackSessionDuration, 30000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
      trackEngagement();
    };
  }, [trackBusinessMetric]);

  return null;
}
