'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

// Skip to main content link
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-400 focus:text-black focus:rounded-md focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
    >
      Preskoči na glavni sadržaj
    </a>
  );
}

// Focus trap for modals
export function FocusTrap({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Close modal logic here
        const closeButton = containerRef.current?.querySelector('[data-close-modal]') as HTMLElement;
        closeButton?.click();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Focus first element
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive]);

  return <div ref={containerRef}>{children}</div>;
}

// Screen reader only text
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  id?: string;
}

export function ScreenReaderOnly({ children, id }: ScreenReaderOnlyProps) {
  return (
    <span className="sr-only" id={id}>
      {children}
    </span>
  );
}

// Accessible button with loading state
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function AccessibleButton({
  loading = false,
  loadingText = 'Učitava se...',
  children,
  disabled,
  ...props
}: AccessibleButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-describedby={loading ? 'loading-text' : undefined}
    >
      {loading && (
        <ScreenReaderOnly id="loading-text">
          {loadingText}
        </ScreenReaderOnly>
      )}
      {loading ? (
        <>
          <span className="sr-only">{loadingText}</span>
          <div className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Accessible form field
interface AccessibleFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  id: string;
  description?: string;
}

export function AccessibleField({
  label,
  error,
  required = false,
  children,
  id,
  description,
}: AccessibleFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300"
      >
        {label}
        {required && (
          <span className="text-red-400 ml-1" aria-label="obavezno polje">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-400">
          {description}
        </p>
      )}
      
      <div>
        {children}
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

// Accessible table
interface AccessibleTableProps {
  caption: string;
  children: React.ReactNode;
  className?: string;
}

export function AccessibleTable({ caption, children, className = '' }: AccessibleTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-700 ${className}`}>
        <caption className="sr-only">
          {caption}
        </caption>
        {children}
      </table>
    </div>
  );
}

// Accessible navigation
interface AccessibleNavProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function AccessibleNav({ label, children, className = '' }: AccessibleNavProps) {
  return (
    <nav
      aria-label={label}
      className={className}
    >
      {children}
    </nav>
  );
}

// Accessible heading
interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function AccessibleHeading({ level, children, className = '', id }: AccessibleHeadingProps) {
  const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
  
  return (
    <HeadingTag
      id={id}
      className={className}
    >
      {children}
    </HeadingTag>
  );
}

// Accessible list
interface AccessibleListProps {
  items: string[];
  type?: 'ul' | 'ol';
  className?: string;
  ariaLabel?: string;
}

export function AccessibleList({ items, type = 'ul', className = '', ariaLabel }: AccessibleListProps) {
  const ListTag = type;
  
  return (
    <ListTag
      className={className}
      aria-label={ariaLabel}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ListTag>
  );
}

// Accessible image
interface AccessibleImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallback?: string;
  className?: string;
}

export function AccessibleImage({ src, alt, width, height, fallback, className }: AccessibleImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        if (fallback) {
          (e.target as HTMLImageElement).src = fallback;
        }
      }}
    />
  );
}

// Accessible loading indicator
interface AccessibleLoadingProps {
  text?: string;
  className?: string;
}

export function AccessibleLoading({ text = 'Učitava se...', className = '' }: AccessibleLoadingProps) {
  return (
    <div
      className={`flex items-center justify-center space-x-2 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span className="sr-only">{text}</span>
    </div>
  );
}

// Accessible error message
interface AccessibleErrorProps {
  message: string;
  className?: string;
}

export function AccessibleError({ message, className = '' }: AccessibleErrorProps) {
  return (
    <div
      className={`text-red-400 text-sm ${className}`}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
}

// Accessible success message
interface AccessibleSuccessProps {
  message: string;
  className?: string;
}

export function AccessibleSuccess({ message, className = '' }: AccessibleSuccessProps) {
  return (
    <div
      className={`text-green-400 text-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
