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
    
    // Ignore common non-critical errors
    ignoreErrors: [
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
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
        component: 'server',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      };
      
      // Remove sensitive data
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      
      return event;
    },
  });
}
