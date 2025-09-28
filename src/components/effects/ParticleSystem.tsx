'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ParticleSystemProps {
  particleCount?: number;
  color?: string;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

export function ParticleSystem({ 
  particleCount = 50, 
  color = '#00ff88',
  className = '' 
}: ParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Initialize particles
    const initialParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      life: Math.random() * 100 + 50
    }));

    setParticles(initialParticles);

    // Animation loop
    const animateParticles = () => {
      if (typeof window === 'undefined') return;
      setParticles(prev => prev.map(particle => {
        const newX = particle.x + particle.vx;
        const newY = particle.y + particle.vy;
        
        return {
          ...particle,
          x: newX > window.innerWidth ? 0 : newX < 0 ? window.innerWidth : newX,
          y: newY > window.innerHeight ? 0 : newY < 0 ? window.innerHeight : newY,
          life: particle.life - 0.1,
        };
      }).filter(particle => particle.life > 0).concat(
        // Add new particles to replace dead ones
        Array.from({ length: Math.max(0, particleCount - prev.length) }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          life: Math.random() * 100 + 50
        }))
      ));
    };

    const interval = setInterval(animateParticles, 50);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearInterval(interval);
    };
  }, [particleCount]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0">
        {particles.map(particle => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={color}
            opacity={particle.opacity}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          />
        ))}
        
        {/* Connect nearby particles */}
        {particles.map((particle, i) => 
          particles.slice(i + 1).map((other, j) => {
            const distance = Math.sqrt(
              Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
            );
            
            if (distance < 150) {
              const opacity = Math.max(0, (150 - distance) / 150) * 0.2;
              return (
                <line
                  key={`${i}-${j}`}
                  x1={particle.x}
                  y1={particle.y}
                  x2={other.x}
                  y2={other.y}
                  stroke={color}
                  strokeWidth="0.5"
                  opacity={opacity}
                />
              );
            }
            return null;
          })
        )}
      </svg>
    </div>
  );
}

// Cyber Grid Background
export function CyberGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}
      />
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}

// Floating Elements
export function FloatingElements() {
  const elements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 10 + Math.random() * 5,
    size: 20 + Math.random() * 30,
    opacity: 0.1 + Math.random() * 0.2
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {elements.map(element => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            width: element.size,
            height: element.size,
            background: 'linear-gradient(45deg, #00ff88, #00ccff)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            opacity: element.opacity
          }}
          animate={{
            x: [
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)
            ],
            y: [
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)
            ],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}