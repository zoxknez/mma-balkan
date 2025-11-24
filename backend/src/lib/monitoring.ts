import { env } from './env';

// Sentry configuration for backend
export class MonitoringService {
  private static initialized = false;
  private static sentry: typeof import('@sentry/node') | null = null;

  static async initialize() {
    if (this.initialized) return;

    if (!env.SENTRY_DSN) {
      console.warn('⚠️  Sentry DSN not configured - monitoring disabled');
      return;
    }

    try {
      // Dynamically import Sentry (optional dependency)
      const Sentry = await import('@sentry/node');
      const { nodeProfilingIntegration } = await import('@sentry/profiling-node');

      Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: env.NODE_ENV,
        
        // Performance monitoring
        tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
        profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,

        integrations: [
          nodeProfilingIntegration(),
        ],

        // Don't send errors in development
        enabled: env.NODE_ENV === 'production',

        // Release tracking
        release: process.env['GIT_COMMIT'] || 'development',

        // Error filtering
        beforeSend(event, hint) {
          // Don't send validation errors to Sentry
          if (hint.originalException instanceof Error) {
            const message = hint.originalException.message;
            if (message.includes('Validation') || message.includes('Invalid')) {
              return null;
            }
          }
          return event;
        },
      });

      this.sentry = Sentry;
      this.initialized = true;
      
      console.log('✅ Sentry monitoring initialized');
    } catch (error) {
      console.warn('⚠️  Failed to initialize Sentry:', error);
    }
  }

  static captureException(error: Error, context?: Record<string, unknown>) {
    if (this.sentry && context) {
      this.sentry.captureException(error, {
        extra: context,
      });
    } else if (this.sentry) {
      this.sentry.captureException(error);
    }
  }

  static captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    if (this.sentry) {
      this.sentry.captureMessage(message, level);
    }
  }

  static setUser(user: { id: string; email: string; role: string }) {
    if (this.sentry) {
      this.sentry.setUser(user);
    }
  }

  static clearUser() {
    if (this.sentry) {
      this.sentry.setUser(null);
    }
  }
}

// Metric types for proper Prometheus formatting
type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';

interface MetricMetadata {
  type: MetricType;
  value: number;
  labels?: Record<string, string>;
}

// Metrics collection with proper types
export class MetricsService {
  private static metrics = new Map<string, MetricMetadata>();

  static increment(metric: string, value = 1, labels?: Record<string, string>) {
    const key = this.getMetricKey(metric, labels);
    const current = this.metrics.get(key);
    
    this.metrics.set(key, {
      type: 'counter',
      value: (current?.value || 0) + value,
      ...(labels && { labels }),
    });
  }

  static gauge(metric: string, value: number, labels?: Record<string, string>) {
    const key = this.getMetricKey(metric, labels);
    this.metrics.set(key, {
      type: 'gauge',
      value,
      ...(labels && { labels }),
    });
  }

  static histogram(metric: string, value: number, labels?: Record<string, string>) {
    const key = this.getMetricKey(metric, labels);
    this.metrics.set(key, {
      type: 'histogram',
      value,
      ...(labels && { labels }),
    });
  }

  private static getMetricKey(metric: string, labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return metric;
    }
    
    const labelStr = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    
    return `${metric}{${labelStr}}`;
  }

  static getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [key, meta] of this.metrics) {
      result[key] = meta.value;
    }
    return result;
  }

  static reset() {
    this.metrics.clear();
  }

  // Prometheus-compatible metrics endpoint with proper types
  static toPrometheus(): string {
    const lines: string[] = [];
    const metricTypes = new Set<string>();
    
    for (const [key, meta] of this.metrics) {
      const metricName = key.split('{')[0] || key;
      
      // Add TYPE declaration once per metric
      if (!metricTypes.has(metricName)) {
        lines.push(`# TYPE ${metricName} ${meta.type}`);
        metricTypes.add(metricName);
      }
      
      // Add metric value
      lines.push(`${key} ${meta.value}`);
    }

    return lines.join('\n');
  }
}

// Performance tracking
export class PerformanceTracker {
  private startTime: number;
  private operation: string;

  constructor(operation: string) {
    this.operation = operation;
    this.startTime = Date.now();
  }

  end(success = true) {
    const duration = Date.now() - this.startTime;
    
    // Log slow operations
    if (duration > 1000) {
      console.warn(`🐌 Slow operation: ${this.operation} took ${duration}ms`);
    }

    // Track metrics
    MetricsService.increment(`${this.operation}_${success ? 'success' : 'error'}`);
    MetricsService.gauge(`${this.operation}_duration_ms`, duration);

    return duration;
  }
}

// Helper function to track operation performance
export function trackPerformance<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  return (async () => {
    const tracker = new PerformanceTracker(operation);
    try {
      const result = await fn();
      tracker.end(true);
      return result;
    } catch (error) {
      tracker.end(false);
      throw error;
    }
  })();
}

