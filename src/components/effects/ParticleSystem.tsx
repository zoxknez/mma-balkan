'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleSystemProps {
  particleCount?: number;
  color?: string;
  className?: string;
  connectionDistance?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

// Convert hex color to RGB for Canvas
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16)
  } : { r: 0, g: 255, b: 136 };
}

export function ParticleSystem({ 
  particleCount = 50, 
  color = '#00ff88',
  connectionDistance = 150,
  className = '' 
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const rgbColor = hexToRgb(color);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1
    }));

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const particle = particlesRef.current[i]!;
          const other = particlesRef.current[j]!;
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const opacity = ((connectionDistance - distance) / connectionDistance) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, color, connectionDistance, rgbColor.r, rgbColor.g, rgbColor.b]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.6 }}
      />
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

// Floating Elements (CSS-only animation)
export function FloatingElements() {
  const elements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 10 + Math.random() * 5,
    size: 20 + Math.random() * 30,
    opacity: 0.1 + Math.random() * 0.2,
    startX: Math.random() * 100,
    startY: Math.random() * 100
  }));

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30vw, 20vh) scale(1.5); }
          66% { transform: translate(-20vw, 40vh) scale(1); }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-0">
        {elements.map(element => (
          <div
            key={element.id}
            className="absolute"
            style={{
              width: element.size,
              height: element.size,
              background: 'linear-gradient(45deg, #00ff88, #00ccff)',
              borderRadius: '50%',
              filter: 'blur(1px)',
              opacity: element.opacity,
              left: `${element.startX}%`,
              top: `${element.startY}%`,
              animation: `float ${element.duration}s linear infinite`,
              animationDelay: `${element.delay}s`
            }}
          />
        ))}
      </div>
    </>
  );
}