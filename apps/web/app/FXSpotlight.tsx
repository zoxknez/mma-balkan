"use client";
import { useEffect } from 'react';

export default function FXSpotlight(){
  useEffect(()=>{
    const root = document.documentElement;
    const move = (e: MouseEvent)=>{
      root.style.setProperty('--mx', e.clientX + 'px');
      root.style.setProperty('--my', e.clientY + 'px');
    };
    window.addEventListener('mousemove', move);
    return ()=>window.removeEventListener('mousemove', move);
  },[]);
  return null;
}
