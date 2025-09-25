"use client";
import { useState } from 'react';

export default function PredictButton({ a, b }: { a: string; b: string }) {
  const [loading, setLoading] = useState(false);
  const [prob, setProb] = useState<{ a?: number; b?: number } | null>(null);
  async function onClick() {
    try {
      setLoading(true);
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fighter_a: a, fighter_b: b }),
      });
      const data = await res.json();
      if (res.ok) {
        setProb({ a: data.prob_a, b: data.prob_b });
      } else {
        setProb(null);
      }
    } catch {
      setProb(null);
    } finally {
      setLoading(false);
    }
  }
  const label = loading ? '…' : prob ? `${Math.round((prob.a ?? 0)*100)}% / ${Math.round((prob.b ?? 0)*100)}%` : 'Predict';
  return (
    <button onClick={onClick} title={`${a} vs ${b}`} style={{
      border:'1px solid var(--border)', background:'transparent', color:'var(--text)', padding:'6px 10px', borderRadius:10, cursor:'pointer'
    }}>
      {label}
    </button>
  );
}
