"use client";

// Lightweight Google Maps embed (no extra deps) with a fallback to a link.
export function MapEmbed({ query, height = 260 }: { query: string; height?: number }) {
  const q = encodeURIComponent(query);
  const src = `https://www.google.com/maps?q=${q}&z=14&output=embed`;
  const url = `https://www.google.com/maps/search/?api=1&query=${q}`;
  return (
    <div className="w-full border border-white/10 rounded-lg overflow-hidden">
      <iframe
        title="Mapa"
        src={src}
        className="w-full"
        style={{ height }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="p-2 text-xs text-gray-400 bg-black/30">
        Ako mapa ne učita, otvorite u <a className="text-cyan-300 underline" href={url} target="_blank" rel="noreferrer">Google Maps</a>.
      </div>
    </div>
  );
}
