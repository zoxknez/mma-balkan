"use client";
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const isLight = saved === 'light';
    setLight(isLight);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('theme-light', isLight);
    }
  }, []);
  function toggle() {
    const next = !light;
    setLight(next);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('theme-light', next);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', next ? 'light' : 'dark');
    }
  }
  return (
    <button onClick={toggle} title="Tema" style={{
      border:'1px solid var(--border)', background:'transparent', color:'var(--text)', padding:'6px 10px', borderRadius:10, cursor:'pointer'
    }}>
      {light ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}
