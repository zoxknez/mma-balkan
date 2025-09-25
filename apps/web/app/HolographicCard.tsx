'use client';

import { useEffect, useRef, useState } from 'react';

export default function HolographicCard({ children, className = '', intensity = 1, style }: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  style?: React.CSSProperties;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePos({ x: 0, y: 0 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`holographic-card ${className}`}
      style={{
        ...style,
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
        '--intensity': intensity,
        '--hover': isHovered ? 1 : 0,
      } as React.CSSProperties}
    >
      <div className="holographic-content">
        {children}
      </div>
      <div className="holographic-overlay" />
      <div className="holographic-border" />
    </div>
  );
}
