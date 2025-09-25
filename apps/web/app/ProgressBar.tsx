"use client";
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ProgressBar() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    setVisible(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(false), 500);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [pathname, search?.toString()]);
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,height:3,zIndex:100}}>
      <div className="progress-bar" style={{
        transform: visible ? 'translateX(0)' : 'translateX(-100%)'
      }} />
    </div>
  );
}
