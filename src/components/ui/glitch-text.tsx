'use client';

import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  trigger?: boolean;
}

export function GlitchText({ text, className = '', trigger = false }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (trigger) {
      setIsGlitching(true);
      
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
      const originalText = text;
      
      let iterations = 0;
      const interval = setInterval(() => {
        setDisplayText(
          originalText.split('').map((char, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }).join('')
        );
        
        iterations += 1 / 3;
        
        if (iterations >= originalText.length) {
          clearInterval(interval);
          setDisplayText(originalText);
          setIsGlitching(false);
        }
      }, 30);
      
      return () => clearInterval(interval);
    }
    return undefined;
  }, [trigger, text]);

  return (
    <span 
      className={`${className} ${isGlitching ? 'animate-pulse' : ''}`}
      style={{
        textShadow: isGlitching ? 
          '0.05em 0 0 #00ff88, -0.025em -0.05em 0 #00ccff, 0.025em 0.05em 0 #ff3366' : 
          'none'
      }}
    >
      {displayText}
    </span>
  );
}
