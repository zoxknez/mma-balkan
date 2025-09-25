import Link from 'next/link';
import type { ReactNode } from 'react';

export type TabItem = {
  label: string;
  href: string;
  active?: boolean;
};

export default function Tabs({ items, right, className, sticky }: { items: TabItem[]; right?: ReactNode; className?: string; sticky?: boolean }) {
  return (
  <div className={`tabs ${sticky ? 'sticky' : ''} ${className || ''}`.trim()}>
      <div className="tabs-track">
        {items.map((t) => (
          <Link
            key={t.href + t.label}
            href={t.href}
            aria-current={t.active ? 'page' : undefined}
            className={t.active ? 'active' : ''}
          >
            {t.label}
          </Link>
        ))}
      </div>
      {right ? <div className="tabs-right">{right}</div> : null}
    </div>
  );
}
