import * as Sentry from '@sentry/nextjs';

// Performance monitoring
export const performanceMonitor = {
  // Track page load performance
  trackPageLoad: (pageName: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      Sentry.addBreadcrumb({
        message: `Page loaded: ${pageName}`,
        category: 'navigation',
        level: 'info',
        data: {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: window.performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: window.performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        },
      });
    }
  },

  // Track API call performance
  trackApiCall: (endpoint: string, duration: number, status: number) => {
    Sentry.addBreadcrumb({
      message: `API call: ${endpoint}`,
      category: 'http',
      level: status >= 400 ? 'error' : 'info',
      data: {
        endpoint,
        duration,
        status,
      },
    });
  },

  // Track user interaction
  trackUserInteraction: (action: string, element: string, data?: Record<string, unknown>) => {
    Sentry.addBreadcrumb({
      message: `User interaction: ${action}`,
      category: 'user',
      level: 'info',
      data: {
        action,
        element,
        ...data,
      },
    });
  },

  // Track custom metrics
  trackMetric: (name: string, value: number, tags?: Record<string, string>) => {
    Sentry.addBreadcrumb({
      message: `Metric: ${name}`,
      category: 'metric',
      level: 'info',
      data: {
        name,
        value,
        tags,
      },
    });
  },
};

// Error tracking
export const errorTracking = {
  // Track API errors
  trackApiError: (endpoint: string, error: Error, context?: Record<string, unknown>) => {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'api_error');
      scope.setContext('api_call', {
        endpoint,
        ...context,
      });
      Sentry.captureException(error);
    });
  },

  // Track component errors
  trackComponentError: (component: string, error: Error, context?: Record<string, unknown>) => {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'component_error');
      scope.setContext('component', {
        name: component,
        ...context,
      });
      Sentry.captureException(error);
    });
  },

  // Track user errors
  trackUserError: (action: string, error: Error, context?: Record<string, unknown>) => {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'user_error');
      scope.setContext('user_action', {
        action,
        ...context,
      });
      Sentry.captureException(error);
    });
  },
};

// User analytics
export const analytics = {
  // Track page views
  trackPageView: (page: string, title?: string) => {
    Sentry.addBreadcrumb({
      message: `Page view: ${page}`,
      category: 'navigation',
      level: 'info',
      data: {
        page,
        title,
        timestamp: new Date().toISOString(),
      },
    });
  },

  // Track user actions
  trackAction: (action: string, category: string, data?: Record<string, unknown>) => {
    Sentry.addBreadcrumb({
      message: `User action: ${action}`,
      category: 'user',
      level: 'info',
      data: {
        action,
        category,
        ...data,
        timestamp: new Date().toISOString(),
      },
    });
  },

  // Track feature usage
  trackFeatureUsage: (feature: string, data?: Record<string, unknown>) => {
    Sentry.addBreadcrumb({
      message: `Feature used: ${feature}`,
      category: 'feature',
      level: 'info',
      data: {
        feature,
        ...data,
        timestamp: new Date().toISOString(),
      },
    });
  },
};

// Business metrics
export const businessMetrics = {
  // Track user engagement
  trackEngagement: (metric: string, value: number) => {
    Sentry.addBreadcrumb({
      message: `Engagement metric: ${metric}`,
      category: 'business',
      level: 'info',
      data: {
        metric,
        value,
        timestamp: new Date().toISOString(),
      },
    });
  },

  // Track conversion events
  trackConversion: (event: string, value?: number) => {
    Sentry.addBreadcrumb({
      message: `Conversion: ${event}`,
      category: 'business',
      level: 'info',
      data: {
        event,
        value,
        timestamp: new Date().toISOString(),
      },
    });
  },

  // Track user retention
  trackRetention: (period: string, active: boolean) => {
    Sentry.addBreadcrumb({
      message: `Retention: ${period}`,
      category: 'business',
      level: 'info',
      data: {
        period,
        active,
        timestamp: new Date().toISOString(),
      },
    });
  },
};

// Health checks
export const healthChecks = {
  // Check API health
  checkApiHealth: async (endpoint: string): Promise<boolean> => {
    try {
      const response = await fetch(endpoint);
      return response.ok;
    } catch (error) {
      Sentry.captureException(error);
      return false;
    }
  },

  // Check database health
  checkDatabaseHealth: async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      Sentry.captureException(error);
      return false;
    }
  },

  // Check external services
  checkExternalServices: async (services: string[]): Promise<Record<string, boolean>> => {
    const results: Record<string, boolean> = {};
    
    for (const service of services) {
      try {
        const response = await fetch(service);
        results[service] = response.ok;
      } catch (error) {
        Sentry.captureException(error);
        results[service] = false;
      }
    }
    
    return results;
  },
};

// Custom error boundary integration
export const errorBoundary = {
  // Capture error boundary errors
  captureError: (error: Error, errorInfo: unknown) => {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'error_boundary');
      scope.setContext('error_info', errorInfo as Record<string, unknown>);
      Sentry.captureException(error);
    });
  },
};

// Export all monitoring functions
export const monitoring = {
  performance: performanceMonitor,
  errorTracking,
  analytics,
  businessMetrics,
  healthChecks,
  errorBoundary,
};
