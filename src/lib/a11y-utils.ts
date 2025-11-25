/**
 * Accessibility utilities for better a11y support
 */

/**
 * Generate unique ID for accessibility labels
 */
export function generateA11yId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof window === 'undefined') return;
  
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Keyboard navigation helper
 */
export class KeyboardNavigation {
  private focusableElements: HTMLElement[] = [];
  private currentIndex = 0;
  
  constructor(private container: HTMLElement) {
    this.updateFocusableElements();
  }
  
  updateFocusableElements(): void {
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    this.focusableElements = Array.from(this.container.querySelectorAll(selector));
  }
  
  focusNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length;
    this.focusableElements[this.currentIndex]?.focus();
  }
  
  focusPrevious(): void {
    this.currentIndex = (this.currentIndex - 1 + this.focusableElements.length) % this.focusableElements.length;
    this.focusableElements[this.currentIndex]?.focus();
  }
  
  focusFirst(): void {
    this.currentIndex = 0;
    this.focusableElements[0]?.focus();
  }
  
  focusLast(): void {
    this.currentIndex = this.focusableElements.length - 1;
    this.focusableElements[this.currentIndex]?.focus();
  }
}

/**
 * Trap focus within a container (for modals, dropdowns)
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
  
  if (event.key === 'Escape') {
    // Close modal/dropdown logic should be handled by parent component
    container.dispatchEvent(new CustomEvent('escape'));
  }
}

/**
 * Get readable label for weight class
 */
export function getWeightClassLabel(weightClass: string): string {
  const labels: Record<string, string> = {
    'FLYWEIGHT': 'Najmušija kategorija',
    'BANTAMWEIGHT': 'Bantan kategorija',
    'FEATHERWEIGHT': 'Lakokategorija',
    'LIGHTWEIGHT': 'Laka kategorija',
    'WELTERWEIGHT': 'Poluteškaška kategorija',
    'MIDDLEWEIGHT': 'Srednja kategorija',
    'LIGHT_HEAVYWEIGHT': 'Polulaka teška kategorija',
    'HEAVYWEIGHT': 'Teška kategorija',
    'WOMENS_STRAWWEIGHT': 'Ženska najlakša kategorija',
    'WOMENS_FLYWEIGHT': 'Ženska najmušija kategorija',
    'WOMENS_BANTAMWEIGHT': 'Ženska bantan kategorija',
    'WOMENS_FEATHERWEIGHT': 'Ženska lakokategorija',
  };
  
  return labels[weightClass] || weightClass;
}

/**
 * Format fight status for screen readers
 */
export function getFightStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'SCHEDULED': 'Zakazana',
    'LIVE': 'Uživo - Borba je u toku',
    'COMPLETED': 'Završena',
    'CANCELLED': 'Otkazana',
    'POSTPONED': 'Odložena',
  };
  
  return labels[status] || status;
}

/**
 * Format date for screen readers
 */
export function getAccessibleDate(date: Date | string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return d.toLocaleDateString('sr-RS', options);
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if high contrast mode is enabled
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Skip to main content helper
 */
export function skipToMainContent(): void {
  const main = document.querySelector('#main-content');
  if (main instanceof HTMLElement) {
    main.focus();
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * ARIA live region helper
 */
export class LiveRegion {
  private element: HTMLDivElement;
  
  constructor(priority: 'polite' | 'assertive' = 'polite') {
    this.element = document.createElement('div');
    this.element.setAttribute('role', 'status');
    this.element.setAttribute('aria-live', priority);
    this.element.setAttribute('aria-atomic', 'true');
    this.element.className = 'sr-only';
    document.body.appendChild(this.element);
  }
  
  announce(message: string): void {
    this.element.textContent = message;
  }
  
  destroy(): void {
    document.body.removeChild(this.element);
  }
}

/**
 * Validate form accessibility
 */
export function validateFormAccessibility(form: HTMLFormElement): string[] {
  const issues: string[] = [];
  
  // Check for labels
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    if (!id) {
      issues.push(`Input missing ID: ${input.getAttribute('name') || 'unnamed'}`);
      return;
    }
    
    const label = form.querySelector(`label[for="${id}"]`);
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!label && !ariaLabel && !ariaLabelledBy) {
      issues.push(`Input "${id}" has no associated label`);
    }
  });
  
  // Check for required field indicators
  const requiredInputs = form.querySelectorAll('[required]');
  requiredInputs.forEach((input) => {
    const ariaRequired = input.getAttribute('aria-required');
    if (!ariaRequired) {
      issues.push(`Required input "${input.getAttribute('id')}" missing aria-required`);
    }
  });
  
  return issues;
}

/**
 * Add focus visible styles
 */
export function addFocusVisibleStyles(): void {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = `
    .focus-visible:focus {
      outline: 2px solid #10b981;
      outline-offset: 2px;
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `;
  
  document.head.appendChild(style);
}

