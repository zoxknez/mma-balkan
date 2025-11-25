import { useMemo, useCallback } from 'react';

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useMemo(() => (typeof performance !== 'undefined' ? performance.now() : 0), []);
  
  const logPerformance = useCallback(() => {
    if (typeof performance === 'undefined') return;
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // More than one frame at 60fps
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
    
    // Track performance metrics
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ analytics }) => {
        analytics.trackPerformanceMetric('component_render_time', renderTime, {
          component: componentName
        });
      });
    }
  }, [componentName, startTime]);

  return { logPerformance };
};
