"use client";
import { useEffect, useRef } from 'react';

type Props = {
  children: React.ReactNode;
  as?: any;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
} & Record<string, any>;

export default function Reveal({ children, as:As='div', delay=0, className, style, ...rest }: Props){
  const ref = useRef<HTMLElement|null>(null);
  useEffect(()=>{
    const el = ref.current as unknown as HTMLElement | null;
    if (!el) return;
    el.classList.add('reveal');
    const obs = new IntersectionObserver(([e])=>{
      if (e.isIntersecting){
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('reveal-in');
        obs.disconnect();
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    obs.observe(el);
    return ()=>obs.disconnect();
  }, [delay]);
  // @ts-ignore
  return <As ref={ref as any} className={className} style={style} {...rest}>{children}</As>;
}
