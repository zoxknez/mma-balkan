import * as Sentry from '@sentry/nextjs';

// Only initialize Sentry if DSN is provided
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Debug mode
    debug: process.env.NODE_ENV === 'development',
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    
    // Ignore common non-critical errors
    ignoreErrors: [
      // Network errors
      'NetworkError',
      'Network request failed',
      'Failed to fetch',
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      // ResizeObserver (benign)
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],
    
    // Deny URLs (block third-party scripts)
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
    ],
    
    // Before send hook
    beforeSend(event) {
      // Filter out non-error events in development
      if (process.env.NODE_ENV === 'development' && event.level !== 'error') {
        return null;
      }
      
      // Add custom context
      event.tags = {
        ...event.tags,
        component: 'frontend',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      };
      
      return event;
    },
    
    // Integration configuration
    integrations: [
      Sentry.browserTracingIntegration({
        // Set sampling rate for performance monitoring
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/mma-balkan\.org/,
        ],
      }),
      Sentry.replayIntegration({
        // Capture 10% of all sessions
        sessionSampleRate: 0.1,
        // Capture 100% of sessions with an error
        errorSampleRate: 1.0,
        // Mask all text and input content for privacy
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}
