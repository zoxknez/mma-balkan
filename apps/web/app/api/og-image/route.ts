import { NextResponse } from 'next/server';

function pickOg(html: string): string | null {
  const m1 = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (m1?.[1]) return m1[1];
  const m2 = html.match(/<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (m2?.[1]) return m2[1];
  const m3 = html.match(/<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (m3?.[1]) return m3[1];
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'missing url' }, { status: 400 });
  try {
    const res = await fetch(url, { cache: 'no-store', redirect: 'follow' });
    const html = await res.text();
    const og = pickOg(html);
    if (!og) return NextResponse.json({ error: 'no og:image' }, { status: 404 });
    // If relative path, resolve against base URL
    let target = og;
    try { target = new URL(og, res.url || url).toString(); } catch {}
    return NextResponse.redirect(target, { status: 302 });
  } catch {
    return NextResponse.json({ error: 'fetch failed' }, { status: 502 });
  }
}
