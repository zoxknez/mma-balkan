'use client';

import { useEffect, useRef, useState } from 'react';

export default function FuturisticGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const dots: Array<{x: number; y: number; vx: number; vy: number; opacity: number}> = [];
    const gridSize = 80;
    const connectionDistance = 120;
    
    // Initialize floating dots
    for (let i = 0; i < 40; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update dots
      dots.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
      });
      
      // Draw connections
      ctx.strokeStyle = 'rgba(124, 77, 255, 0.15)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw dots
      dots.forEach(dot => {
        ctx.globalAlpha = dot.opacity;
        ctx.fillStyle = '#7C4DFF';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="futuristic-grid"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -2,
        opacity: 0.6
      }}
    />
  );
}
