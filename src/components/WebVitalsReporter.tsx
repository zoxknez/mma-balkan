'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import * as Sentry from '@sentry/nextjs';

/**
 * Web Vitals Reporter
 * Tracks Core Web Vitals and sends to analytics
 * 
 * Metrics tracked:
 * - CLS: Cumulative Layout Shift
 * - FCP: First Contentful Paint
 * - FID: First Input Delay (deprecated, use INP)
 * - INP: Interaction to Next Paint (NEW - replaces FID)
 * - LCP: Largest Contentful Paint
 * - TTFB: Time to First Byte
 * 
 * Best practices thresholds:
 * - LCP: < 2.5s (Good), < 4.0s (Needs improvement), > 4.0s (Poor)
 * - INP: < 200ms (Good), < 500ms (Needs improvement), > 500ms (Poor)
 * - CLS: < 0.1 (Good), < 0.25 (Needs improvement), > 0.25 (Poor)
 * - FCP: < 1.8s (Good), < 3.0s (Needs improvement), > 3.0s (Poor)
 * - TTFB: < 800ms (Good), < 1800ms (Needs improvement), > 1800ms (Poor)
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      const rating = getRating(metric.name, metric.value);
      const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
      console.log(
        `${emoji} ${metric.name}: ${metric.value.toFixed(2)} (${rating})`,
        metric
      );
    }

    // Send to Sentry
    if (typeof window !== 'undefined' && window.Sentry) {
      Sentry.addBreadcrumb({
        category: 'web-vitals',
        message: `${metric.name}: ${metric.value.toFixed(2)}`,
        level: getRating(metric.name, metric.value) === 'poor' ? 'warning' : 'info',
        data: {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        },
      });
    }

    // Send to Google Analytics (if configured)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Send to custom analytics endpoint (optional)
    if (typeof window !== 'undefined') {
      // Only send vitals in production to avoid noise
      if (process.env.NODE_ENV === 'production') {
        sendToAnalytics(metric);
      }
    }
  });

  // Track custom metrics
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Track time on page
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          const timeOnPage = Date.now() - navigationEntry.startTime;
          console.log(`⏱️  Time on page: ${(timeOnPage / 1000).toFixed(2)}s`);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Get rating based on metric name and value
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
}

/**
 * Send web vitals to custom analytics endpoint
 */
async function sendToAnalytics(metric: {
  name: string;
  value: number;
  rating?: string;
  delta: number;
  id: string;
  navigationType?: string;
}) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating || getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  });

  // Use sendBeacon if available (non-blocking)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/web-vitals', body);
  } else {
    // Fallback to fetch with keepalive
    fetch('/api/analytics/web-vitals', {
      body,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch((err) => {
      console.warn('Failed to send web vitals:', err);
    });
  }
}

// Extend window for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
    Sentry?: typeof Sentry;
  }
}

