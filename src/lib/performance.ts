'use client';

// Performance monitoring and optimization utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track component render time
  trackComponentRender(componentName: string, startTime: number): void {
    const renderTime = performance.now() - startTime;
    this.metrics.set(`${componentName}_render`, renderTime);
    
    if (renderTime > 16) { // More than one frame at 60fps
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }

  // Track API call performance
  trackApiCall(endpoint: string, startTime: number): void {
    const duration = performance.now() - startTime;
    this.metrics.set(`${endpoint}_api`, duration);
    
    if (duration > 1000) { // More than 1 second
      console.warn(`Slow API call detected: ${endpoint} took ${duration.toFixed(2)}ms`);
    }
  }

  // Track Core Web Vitals
  trackCoreWebVitals(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.metrics.set('lcp', lastEntry.startTime);
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: PerformanceEntry & { processingStart?: number }) => {
        const processingStart = entry.processingStart || 0;
        this.metrics.set('fid', processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value || 0;
        }
      });
      this.metrics.set('cls', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);
  }

  // Get performance metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Cleanup observers
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image optimization utilities
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private loadedImages: Set<string> = new Set();

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }

  // Preload critical images
  preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
    if (this.loadedImages.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedImages.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
      
      if (priority === 'high') {
        img.fetchPriority = 'high';
      }
    });
  }

  // Lazy load images with intersection observer
  lazyLoadImage(element: HTMLImageElement, src: string): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          element.src = src;
          element.classList.add('loaded');
          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    observer.observe(element);
  }
}

// Bundle size analyzer
export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private chunks: Map<string, number> = new Map();

  static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }

  // Track chunk sizes
  trackChunk(chunkName: string, size: number): void {
    this.chunks.set(chunkName, size);
  }

  // Get bundle analysis
  getAnalysis(): {
    totalSize: number;
    largestChunks: Array<{ name: string; size: number; percentage: number }>;
    recommendations: string[];
  } {
    const totalSize = Array.from(this.chunks.values()).reduce((sum, size) => sum + size, 0);
    const largestChunks = Array.from(this.chunks.entries())
      .map(([name, size]) => ({
        name,
        size,
        percentage: (size / totalSize) * 100
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    const recommendations: string[] = [];
    
    if (totalSize > 500000) { // 500KB
      recommendations.push('Consider code splitting for large bundles');
    }
    
    if (largestChunks[0] && largestChunks[0].percentage > 50) {
      recommendations.push('Largest chunk is too large, consider splitting');
    }

    return {
      totalSize,
      largestChunks,
      recommendations
    };
  }
}

// Memory usage monitor
export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private memoryHistory: number[] = [];

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  // Track memory usage
  trackMemory(): void {
    if ('memory' in performance) {
      const memory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      this.memoryHistory.push(usedMB);
      
      // Keep only last 100 measurements
      if (this.memoryHistory.length > 100) {
        this.memoryHistory.shift();
      }
      
      // Warn if memory usage is high
      if (usedMB > 100) { // 100MB
        console.warn(`High memory usage detected: ${usedMB.toFixed(2)}MB`);
      }
    }
  }

  // Get memory statistics
  getMemoryStats(): {
    current: number;
    average: number;
    peak: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  } {
    const current = this.memoryHistory[this.memoryHistory.length - 1] || 0;
    const average = this.memoryHistory.reduce((sum, val) => sum + val, 0) / this.memoryHistory.length;
    const peak = Math.max(...this.memoryHistory);
    
    const recent = this.memoryHistory.slice(-10);
    const older = this.memoryHistory.slice(-20, -10);
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recentAvg > olderAvg * 1.1) trend = 'increasing';
    else if (recentAvg < olderAvg * 0.9) trend = 'decreasing';
    
    return { current, average, peak, trend };
  }
}

// Performance utilities
export const performanceUtils = {
  // Debounce function for performance
  debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for performance
  throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Request animation frame wrapper
  rafThrottle<T extends (...args: unknown[]) => unknown>(
    func: T
  ): (...args: Parameters<T>) => void {
    let rafId: number;
    return (...args: Parameters<T>) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => func(...args));
    };
  },

  // Measure function execution time
  measureTime<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  },

  // Async measure function execution time
  async measureTimeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  }
};

// Export singleton instances
export const performanceMonitor = PerformanceMonitor.getInstance();
export const imageOptimizer = ImageOptimizer.getInstance();
export const bundleAnalyzer = BundleAnalyzer.getInstance();
export const memoryMonitor = MemoryMonitor.getInstance();
