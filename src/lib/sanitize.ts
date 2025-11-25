// XSS Protection and Input Sanitization

// Sanitize string - remove HTML tags and dangerous characters
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Configuration for HTML sanitization (used for reference and future DOMPurify integration)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ALLOWED_TAGS = new Set(['p', 'br', 'b', 'i', 'u', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div']);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ALLOWED_ATTRIBUTES = new Set(['href', 'class', 'id', 'title', 'alt', 'src']);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UNSAFE_PROTOCOLS = ['javascript:', 'vbscript:', 'data:'];

// Sanitize HTML - remove dangerous content while preserving safe tags
export function sanitizeHTML(html: string): string {
  // Note: For production with user-generated HTML, consider using DOMPurify library
  // npm install dompurify @types/dompurify
  // import DOMPurify from 'dompurify'; return DOMPurify.sanitize(html);
  
  let sanitized = html;

  // Remove script tags (including variations)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<script[^>]*>/gi, '');
  sanitized = sanitized.replace(/<\/script>/gi, '');

  // Remove style tags
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove iframe, embed, object tags
  sanitized = sanitized.replace(/<(iframe|embed|object|frame|frameset)[^>]*>[\s\S]*?<\/\1>/gi, '');
  sanitized = sanitized.replace(/<(iframe|embed|object|frame|frameset)[^>]*\/?>/gi, '');

  // Remove all event handlers (on*="...", on*='...', on*=...)
  sanitized = sanitized.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Remove dangerous protocols (javascript:, vbscript:, data: except images)
  sanitized = sanitized.replace(/\b(?:javascript|vbscript)\s*:/gi, '');
  sanitized = sanitized.replace(/\bdata:\s*(?!image\/(?:png|jpe?g|gif|webp|svg\+xml))/gi, '');
  
  // Remove expression() CSS function (IE vulnerability)
  sanitized = sanitized.replace(/expression\s*\(/gi, '');
  
  // Remove behavior: CSS property (IE vulnerability)
  sanitized = sanitized.replace(/behavior\s*:/gi, '');
  
  // Remove -moz-binding CSS property
  sanitized = sanitized.replace(/-moz-binding\s*:/gi, '');

  // Remove SVG onload and other SVG-specific attack vectors
  sanitized = sanitized.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, (match) => {
    // Remove SVG scripts and event handlers
    return match.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/\bon\w+\s*=/gi, '');
  });

  // Clean up any remaining dangerous attributes
  sanitized = sanitized.replace(/\bsrcdoc\s*=/gi, 'data-removed=');
  sanitized = sanitized.replace(/\bformaction\s*=/gi, 'data-removed=');

  return sanitized;
}

// Sanitize URL
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);

    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }

    return parsed.toString();
  } catch {
    return '';
  }
}

// Validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Validate phone number
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

// Sanitize search query
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 100); // Limit length
}

// Escape regex special characters
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @deprecated SQL injection prevention should be handled by the ORM (Prisma)
 * Using parameterized queries via Prisma prevents SQL injection automatically.
 * This function is kept for backward compatibility but should not be relied upon.
 * 
 * If you need raw SQL queries, use Prisma's $queryRaw with tagged template literals:
 * await prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`
 */
export function sanitizeSQL(input: string): string {
  console.warn(
    'sanitizeSQL is deprecated. Use Prisma parameterized queries instead.'
  );
  // Basic sanitization - NOT a security measure, use Prisma for actual protection
  return input
    .replace(/[\x00\x08\x09\x1a\n\r"'\\%]/g, (char) => {
      const escapeMap: Record<string, string> = {
        '\x00': '\\0',
        '\x08': '\\b',
        '\x09': '\\t',
        '\x1a': '\\z',
        '\n': '\\n',
        '\r': '\\r',
        '"': '\\"',
        "'": "\\'",
        '\\': '\\\\',
        '%': '\\%',
      };
      return escapeMap[char] || char;
    })
    .trim();
}

// Validate and sanitize user input
export function validateInput(input: string, options: {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowHTML?: boolean;
}): { isValid: boolean; sanitized: string; errors: string[] } {
  const errors: string[] = [];
  let sanitized = options.allowHTML ? sanitizeHTML(input) : sanitizeString(input);

  // Check minimum length
  if (options.minLength && sanitized.length < options.minLength) {
    errors.push(`Minimum length is ${options.minLength} characters`);
  }

  // Check maximum length
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
    errors.push(`Maximum length is ${options.maxLength} characters`);
  }

  // Check pattern
  if (options.pattern && !options.pattern.test(sanitized)) {
    errors.push('Input does not match required pattern');
  }

  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  };
}

// Safe JSON parse with fallback
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Content Security Policy nonce generator
// Note: For server-side usage, import generateServerNonce from this module
export function generateNonce(): string {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    // Client-side: use Web Crypto API for secure random generation
    const buffer = new Uint8Array(16);
    window.crypto.getRandomValues(buffer);
    return btoa(String.fromCharCode(...buffer));
  }
  
  // Fallback: use less secure but functional random generation
  // This should only happen in SSR or testing environments
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}${randomPart}`.substring(0, 22);
}

// Server-side nonce generator (call this in server components/API routes)
export async function generateServerNonce(): Promise<string> {
  try {
    const crypto = await import('crypto');
    return crypto.randomBytes(16).toString('base64');
  } catch {
    // Fallback if crypto module is not available
    return generateNonce();
  }
}

