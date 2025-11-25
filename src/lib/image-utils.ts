/**
 * Image utilities for Next.js Image optimization
 */

/**
 * Generate a blur data URL for image placeholder
 * @param width - Image width
 * @param height - Image height
 * @returns Base64 encoded blur placeholder
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  
  if (!canvas) {
    // Server-side: return a simple SVG blur placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(31,41,55);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(17,24,39);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)" />
      </svg>
    `.trim();
    
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  }
  
  // Client-side: generate canvas blur
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1f2937');
    gradient.addColorStop(1, '#111827');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
}

/**
 * Fighter avatar placeholder
 */
export const FIGHTER_AVATAR_PLACEHOLDER = generateBlurDataURL(200, 200);

/**
 * Event poster placeholder
 */
export const EVENT_POSTER_PLACEHOLDER = generateBlurDataURL(400, 600);

/**
 * News thumbnail placeholder
 */
export const NEWS_THUMBNAIL_PLACEHOLDER = generateBlurDataURL(400, 250);

/**
 * Club logo placeholder
 */
export const CLUB_LOGO_PLACEHOLDER = generateBlurDataURL(150, 150);

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  }
): string {
  if (!url) return '';
  
  // If it's already a Next.js optimized image, return as is
  if (url.startsWith('/_next/image')) return url;
  
  // If it's a relative path, return as is (Next.js will optimize)
  if (url.startsWith('/')) return url;
  
  // External URLs - use Next.js image optimization
  const params = new URLSearchParams();
  params.set('url', url);
  
  if (options?.width) params.set('w', options.width.toString());
  if (options?.quality) params.set('q', options.quality.toString());
  
  return `/_next/image?${params.toString()}`;
}

/**
 * Image loader for Next.js Image component
 */
export const customImageLoader = ({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) => {
  if (src.startsWith('/') && !src.startsWith('/_next')) {
    return src;
  }
  
  const params = new URLSearchParams();
  params.set('url', src);
  params.set('w', width.toString());
  if (quality) params.set('q', quality.toString());
  
  return `/_next/image?${params.toString()}`;
};

/**
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const parsed = new URL(url, 'http://example.com');
    const ext = parsed.pathname.toLowerCase();
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(ext);
  } catch {
    return false;
  }
}

/**
 * Get image dimensions from URL (client-side only)
 */
export async function getImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
  if (typeof window === 'undefined') return null;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Preload critical images
 */
export function preloadImage(url: string, priority: 'high' | 'low' = 'low'): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  link.fetchPriority = priority;
  
  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  src: string,
  options?: IntersectionObserverInit
): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imgElement.src = src;
          observer.unobserve(imgElement);
        }
      });
    }, options);
    
    observer.observe(imgElement);
  } else {
    // Fallback for browsers without Intersection Observer
    imgElement.src = src;
  }
}

