import * as Sentry from '@sentry/nextjs';

// Only initialize Sentry if DSN is provided
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Debug mode
    debug: process.env.NODE_ENV === 'development',
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    
    // Before send hook
    beforeSend(event) {
      // Filter out non-error events in development
      if (process.env.NODE_ENV === 'development' && event.level !== 'error') {
        return null;
      }
      
      // Add custom context
      event.tags = {
        ...event.tags,
        component: 'edge',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      };
      
      return event;
    },
  });
}
