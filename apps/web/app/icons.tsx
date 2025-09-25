import type React from 'react'
export function NewsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function EventIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8" cy="13" r="1" fill="currentColor"/>
      <circle cx="12" cy="13" r="1" fill="currentColor"/>
      <circle cx="16" cy="13" r="1" fill="currentColor"/>
    </svg>
  );
}

export function FighterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function LiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
      <path d="M4 12a8 8 0 0 1 8-8m8 8a8 8 0 0 1-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function ForumIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 20l4-2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
