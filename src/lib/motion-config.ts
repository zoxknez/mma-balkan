import { MotionProps, Transition, Variants } from 'framer-motion';

// Optimized transition defaults
export const transitions = {
  // Fast transitions for small elements
  fast: {
    type: 'tween',
    duration: 0.2,
    ease: 'easeOut',
  } as Transition,

  // Standard transitions
  standard: {
    type: 'tween',
    duration: 0.3,
    ease: 'easeInOut',
  } as Transition,

  // Smooth spring transitions
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  } as Transition,

  // Slow, smooth transitions
  slow: {
    type: 'tween',
    duration: 0.6,
    ease: 'easeInOut',
  } as Transition,
};

// Reusable animation variants
export const variants = {
  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // Slide from bottom
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  } as Variants,

  // Slide from top
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  } as Variants,

  // Scale
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  } as Variants,

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as Variants,

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  } as Variants,
};

// Motion props for common patterns
export const motionProps = {
  // Hover scale
  hoverScale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: transitions.spring,
  } as MotionProps,

  // Hover lift
  hoverLift: {
    whileHover: { y: -5 },
    transition: transitions.fast,
  } as MotionProps,

  // Tap effect
  tap: {
    whileTap: { scale: 0.98 },
    transition: transitions.fast,
  } as MotionProps,
};

// LazyMotion features for reduced bundle size
export const domAnimation = () =>
  import('framer-motion').then(mod => mod.domAnimation);

// Viewport detection options for scroll animations
export const viewportOptions = {
  once: true, // Only animate once
  margin: '-100px', // Trigger before element is in view
  amount: 0.3, // 30% of element must be visible
};

// Reduced motion preferences
export const shouldReduceMotion = 
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Get optimized transition based on user preference
export function getTransition(transition: Transition): Transition {
  if (shouldReduceMotion) {
    return {
      type: 'tween',
      duration: 0.01,
    };
  }
  return transition;
}

// Optimized motion value for transforms
export const transform = {
  // Hardware-accelerated properties only
  gpu: ['translateX', 'translateY', 'translateZ', 'scale', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'skew', 'skewX', 'skewY'],
  // CPU properties (avoid if possible)
  cpu: ['top', 'left', 'right', 'bottom', 'width', 'height'],
};

