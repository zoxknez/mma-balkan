// Analytics and user behavior tracking
import React, { useEffect } from 'react';

export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

export interface UserBehavior {
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number }>;
  topActions: Array<{ action: string; count: number }>;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
    screenResolution: string;
    viewportSize: string;
  };
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  domContentLoaded: number;
  windowLoad: number;
}

// Extended PerformanceEntry types for Core Web Vitals
interface PerformanceEntryWithProcessingStart extends PerformanceEntry {
  processingStart?: number;
}

interface PerformanceEntryWithLayoutShift extends PerformanceEntry {
  hadRecentInput?: boolean;
  value?: number;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean;
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimeout?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
    
    if (this.isEnabled) {
      this.initializeTracking();
      this.startFlushInterval();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return;
    
    // Track page views
    this.trackPageView(window.location.pathname);
    
    // Track performance metrics
    this.trackPerformance();
    
    // Track user interactions
    this.trackUserInteractions();
    
    // Track errors
    this.trackErrors();
  }

  private trackPerformance() {
    if (typeof window === 'undefined') return;

    // Wait for performance metrics to be available
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const metrics: PerformanceMetrics = {
          pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          largestContentfulPaint: 0, // Will be updated by LCP observer
          firstInputDelay: 0, // Will be updated by FID observer
          cumulativeLayoutShift: 0, // Will be updated by CLS observer
          timeToInteractive: 0,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          windowLoad: navigation.loadEventEnd - navigation.loadEventStart,
        };

        this.trackEvent('performance', 'page_load', 'metrics', undefined, metrics as unknown as Record<string, unknown>);
      }, 1000);
    });

    // Track Core Web Vitals
    this.trackCoreWebVitals();
  }

  private trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackEvent('performance', 'lcp', 'core_web_vital', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntryWithProcessingStart) => {
          const processingStart = entry.processingStart || 0;
          this.trackEvent('performance', 'fid', 'core_web_vital', processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntryWithLayoutShift) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0;
          }
        });
        this.trackEvent('performance', 'cls', 'core_web_vital', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private trackUserInteractions() {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const element = target.closest('[data-track]');
      
      if (element) {
        const action = element.getAttribute('data-track') || 'unknown';
        const category = element.getAttribute('data-category') || 'interaction';
        
        this.trackEvent(category, 'click', action, undefined, {
          element: target.tagName,
          text: target.textContent?.trim(),
          href: (target as HTMLAnchorElement).href,
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const formName = form.name || form.id || 'unknown_form';
      
      this.trackEvent('form', 'submit', formName, undefined, {
        formId: form.id,
        formName: form.name,
        formAction: form.action,
      });
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        this.trackEvent('engagement', 'scroll_depth', 'percentage', scrollDepth);
      }
    });
  }

  private trackErrors() {
    window.addEventListener('error', (event) => {
      this.trackEvent('error', 'javascript_error', 'uncaught', undefined, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('error', 'promise_rejection', 'unhandled', undefined, {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    });
  }

  private startFlushInterval() {
    this.flushTimeout = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  // Public methods
  setUserId(userId: string) {
    this.userId = userId;
  }

  trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, unknown>
  ) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: `${category}_${action}`,
      category,
      action,
      label,
      value,
      properties,
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.events.push(event);

    // Flush if batch size reached
    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  trackPageView(page: string, title?: string) {
    this.trackEvent('page', 'view', page, undefined, {
      page,
      title: title || document.title,
      referrer: document.referrer,
    });
  }

  trackUserAction(action: string, category: string = 'user', properties?: Record<string, unknown>) {
    this.trackEvent(category, action, undefined, undefined, properties);
  }

  trackConversion(conversionType: string, value?: number, properties?: Record<string, unknown>) {
    this.trackEvent('conversion', conversionType, undefined, value, properties);
  }

  trackSearch(query: string, resultsCount: number, filters?: Record<string, unknown>) {
    this.trackEvent('search', 'query', query, resultsCount, {
      query,
      resultsCount,
      filters,
    });
  }

  trackError(error: Error, context?: Record<string, unknown>) {
    this.trackEvent('error', 'tracked_error', error.message, undefined, {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  trackPerformanceMetric(metric: string, value: number, properties?: Record<string, unknown>) {
    this.trackEvent('performance', metric, 'metric', value, properties);
  }

  trackBusinessMetric(metric: string, value: number, properties?: Record<string, unknown>) {
    this.trackEvent('business', metric, 'metric', value, properties);
  }

  async flush() {
    if (this.events.length === 0) return;

    const eventsToFlush = [...this.events];
    this.events = [];

    try {
      // Send to analytics service
      await this.sendToAnalytics(eventsToFlush);
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Re-add events to queue for retry
      this.events.unshift(...eventsToFlush);
    }
  }

  private async sendToAnalytics(events: AnalyticsEvent[]) {
    // Send to multiple analytics services
    const promises = [];

    // Google Analytics 4
    if (process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) {
      promises.push(this.sendToGA4(events));
    }

    // Custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      promises.push(this.sendToCustomEndpoint(events));
    }

    // Sentry (for error tracking)
    const errorEvents = events.filter(e => e.category === 'error');
    if (errorEvents.length > 0 && typeof window !== 'undefined') {
      promises.push(this.sendToSentry(errorEvents));
    }

    await Promise.allSettled(promises);
  }

  private async sendToGA4(events: AnalyticsEvent[]) {
    if (typeof window === 'undefined' || !(window as unknown as { gtag?: unknown }).gtag) return;

    events.forEach(event => {
      (window as unknown as { gtag: (event: string, action: string, params: Record<string, unknown>) => void }).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: event.properties,
      });
    });
  }

  private async sendToCustomEndpoint(events: AnalyticsEvent[]) {
    const response = await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Analytics endpoint returned ${response.status}`);
    }
  }

  private async sendToSentry(events: AnalyticsEvent[]) {
    try {
      const sentryModule = await import('@sentry/nextjs');
      const Sentry = (sentryModule as unknown as { Sentry?: { addBreadcrumb: (breadcrumb: Record<string, unknown>) => void } }).Sentry || sentryModule.default;
      
      if (Sentry && typeof Sentry === 'object' && 'addBreadcrumb' in Sentry) {
        events.forEach(event => {
          (Sentry as { addBreadcrumb: (breadcrumb: Record<string, unknown>) => void }).addBreadcrumb({
            message: event.name,
            category: event.category,
            level: 'error',
            data: event.properties,
          });
        });
      }
    } catch (error) {
      console.warn('Sentry not available:', error);
    }
  }

  // Get analytics data
  getSessionData() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      eventCount: this.events.length,
      isEnabled: this.isEnabled,
    };
  }

  // Cleanup
  destroy() {
    if (this.flushTimeout) {
      clearInterval(this.flushTimeout);
    }
    this.flush();
  }
}

// Create singleton instance
export const analytics = new Analytics();

// React hook for analytics
export function useAnalytics() {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackUserAction: analytics.trackUserAction.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformanceMetric: analytics.trackPerformanceMetric.bind(analytics),
    trackBusinessMetric: analytics.trackBusinessMetric.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    getSessionData: analytics.getSessionData.bind(analytics),
  };
}

// Higher-order component for automatic page tracking
export function withAnalytics<T extends object>(Component: React.ComponentType<T>) {
  return function AnalyticsWrapper(props: T) {
    const { trackPageView } = useAnalytics();

    useEffect(() => {
      trackPageView(window.location.pathname, document.title);
    }, [trackPageView]);

    return <Component {...props} />;
  };
}
