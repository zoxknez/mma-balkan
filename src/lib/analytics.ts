'use client';

import { useState, useCallback } from 'react';

type EventProperties = Record<string, unknown>;

export function useAnalytics() {
  const [userId, setUserIdState] = useState<string | null>(null);
  const [sessionId] = useState(() => typeof crypto !== 'undefined' ? crypto.randomUUID() : 'session-' + Date.now());

  const log = useCallback((type: string, name: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed(`📊 Analytics: ${type} - ${name}`);
      console.log('Data:', data);
      console.log('User:', userId);
      console.log('Session:', sessionId);
      console.groupEnd();
    }
    // Here you would send data to GA4, Mixpanel, PostHog, etc.
  }, [userId, sessionId]);

  const trackEvent = useCallback((category: string, action: string, label?: string, value?: number, properties?: EventProperties) => {
    log('Event', `${category}:${action}`, { label, value, ...properties });
  }, [log]);

  const trackPageView = useCallback((page: string, title?: string) => {
    log('PageView', page, { title });
  }, [log]);

  const trackUserAction = useCallback((action: string, category: string = 'interaction', properties?: EventProperties) => {
    log('UserAction', action, { category, ...properties });
  }, [log]);

  const trackConversion = useCallback((conversionType: string, value?: number, properties?: EventProperties) => {
    log('Conversion', conversionType, { value, ...properties });
  }, [log]);

  const trackSearch = useCallback((query: string, resultsCount: number, filters?: EventProperties) => {
    log('Search', query, { resultsCount, ...filters });
  }, [log]);

  const trackError = useCallback((error: Error, context?: EventProperties) => {
    log('Error', error.name, { message: error.message, stack: error.stack, ...context });
  }, [log]);

  const trackPerformanceMetric = useCallback((metric: string, value: number, properties?: EventProperties) => {
    // Only log performance metrics if they are significant or in dev
    if (process.env.NODE_ENV === 'development' || value > 1000) {
      log('Performance', metric, { value, ...properties });
    }
  }, [log]);

  const trackBusinessMetric = useCallback((metric: string, value: number, properties?: EventProperties) => {
    log('Business', metric, { value, ...properties });
  }, [log]);

  const setUserId = useCallback((id: string) => {
    setUserIdState(id);
    log('Identify', id);
  }, [log]);

  const getSessionData = useCallback(() => {
    return {
      sessionId,
      userId,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };
  }, [sessionId, userId]);

  return {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackConversion,
    trackSearch,
    trackError,
    trackPerformanceMetric,
    trackBusinessMetric,
    setUserId,
    getSessionData
  };
}

// Static analytics for non-hook usage
export const analytics = {
  trackError: (error: Error, context?: EventProperties) => {
    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed(`📊 Analytics: Error - ${error.name}`);
      console.log('Message:', error.message);
      console.log('Context:', context);
      console.groupEnd();
    }
  },
  trackPerformanceMetric: (metric: string, value: number, properties?: EventProperties) => {
    if (process.env.NODE_ENV === 'development' || value > 1000) {
      console.groupCollapsed(`📊 Analytics: Performance - ${metric}`);
      console.log('Value:', value);
      console.log('Properties:', properties);
      console.groupEnd();
    }
  }
};
