"use client";
import { useEffect, useState } from 'react';

export default function LiveTicker() {
  const [msg, setMsg] = useState<string>('🥊 MMA SRB LIVE - Pratimo najnovije rezultate i dešavanja iz MMA sveta');
  
  useEffect(() => {
    // MMA-focused rotating messages
    const mmaMessages = [
      '🥊 UFC 300: Jones vs Miocic - Glavna borba večeras u 23:00!',
      '🔥 Dušan Mandić nokautirao protivnika u prvoj rundi!',
      '🏆 ONE Championship najavljuje event u Beogradu za 2025',
      '💪 Marko Bogdanović potpisao ekskluzivni ugovor sa UFC-om',
      '⚡ LIVE rezultati sa UFC Fight Night - Pratimo uživo',
      '🇷🇸 Srpski borci dominiraju na međunarodnoj sceni',
      '📊 Stipe Miocic favorit u glavnoj borbi protiv Jonesa',
      '🥋 Novi P4P ranking: 3 Balkanca u TOP 15 svetskih boraca',
      '🎯 Predikcije za večerašnje borbe - AI analize dostupne',
      '⏰ Za 2 sata počinje UFC prelims - ne propustite!'
    ];

    // Rotate through MMA messages
    let index = 0;
    const rotateMessages = () => {
      setMsg(mmaMessages[index]);
      index = (index + 1) % mmaMessages.length;
    };

    const interval = setInterval(rotateMessages, 5000);
    rotateMessages(); // Start immediately

    // Keep SSE connection for real updates
    const es = new EventSource('/api/live');
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data?.msg) setMsg(data.msg);
      } catch {}
    };
    es.onerror = () => {
      // Simple error handling
    };

    return () => {
      clearInterval(interval);
      es.close();
    };
  }, []);

  return (
    <div className="card" style={{padding:'8px 12px',background:'linear-gradient(90deg,rgba(233,30,99,0.1),rgba(233,30,99,0.05),transparent)'}}>
      <span className="badge" style={{marginRight:10,background:'#e91e63',color:'#fff'}}>🔴 LIVE</span>
      <span style={{color:'#fff',fontWeight:500}}>{msg}</span>
    </div>
  );
}
