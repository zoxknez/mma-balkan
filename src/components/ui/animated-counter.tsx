'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  className = '', 
  prefix = '', 
  suffix = '',
  decimals = 0
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });
  const frameRef = useRef<number | null>(null);
  const targetValueRef = useRef(value);
  const lastRenderedRef = useRef(0);

  useEffect(() => {
    lastRenderedRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    if (!inView) {
      return undefined;
    }

    if (targetValueRef.current === value) {
      return undefined;
    }

    targetValueRef.current = value;
    const startValue = lastRenderedRef.current;
    const durationMs = Math.max(duration, 0.1) * 1000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (value - startValue) * easeOut;

      setDisplayValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
}
