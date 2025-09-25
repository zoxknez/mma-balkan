"use client";
import { useEffect, useRef } from 'react';

type Blob = { x:number; y:number; r:number; vx:number; vy:number; hue:number };

export default function FXBackground(){
  const ref = useRef<HTMLCanvasElement|null>(null);

  useEffect(()=>{
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let raf = 0;
    const blobs: Blob[] = Array.from({length: 8}).map((_,i)=>({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.max(140, Math.min(w,h) * (0.08 + Math.random()*0.06)),
      vx: (Math.random()*1.2+0.2) * (Math.random()<0.5?-1:1),
      vy: (Math.random()*1.2+0.2) * (Math.random()<0.5?-1:1),
      hue: 310 + i*8 + Math.random()*20,
    }));

    const draw = ()=>{
      ctx.clearRect(0,0,w,h);
      ctx.globalCompositeOperation = 'lighter';
      for (const b of blobs){
        // move
        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.r) { b.x = w + b.r; }
        if (b.x > w + b.r) { b.x = -b.r; }
        if (b.y < -b.r) { b.y = h + b.r; }
        if (b.y > h + b.r) { b.y = -b.r; }
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, `hsla(${b.hue}, 95%, 60%, 0.10)`);
        grad.addColorStop(0.5, `hsla(${b.hue+20}, 95%, 55%, 0.06)`);
        grad.addColorStop(1, 'hsla(0,0%,0%,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onResize = ()=>{
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  },[]);

  return (
    <div className="fx-bg" aria-hidden>
      <canvas ref={ref} />
      <div className="fx-vignette" />
    </div>
  );
}
