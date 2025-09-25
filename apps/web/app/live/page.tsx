"use client";
import { useEffect, useState } from 'react';
import LiveTicker from '../LiveTicker';

export default function LivePage() {
  const [events, setEvents] = useState<string[]>([]);
  useEffect(() => {
    const es = new EventSource('/api/live');
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data?.msg) setEvents((prev) => [data.msg, ...prev].slice(0, 50));
      } catch {}
    };
    return () => es.close();
  }, []);
  return (
    <section>
      <h2>Uživo</h2>
      <div style={{margin:'12px 0'}}>
        <LiveTicker />
      </div>
      <div className="card">
        <ul className="list">
          {events.map((e, i) => (
            <li key={i} className="list-item">{e}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
