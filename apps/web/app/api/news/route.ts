import { NextResponse } from 'next/server';
import { prisma } from '@mmasrb/db';

const cache = new Map<string, { title: string; expires: number }>();

async function translate(text: string, to: string): Promise<string> {
  // Prefer Azure if configured
  const key = process.env.AZURE_TRANSLATOR_KEY;
  const region = process.env.AZURE_TRANSLATOR_REGION;
  try {
    if (key && region) {
      const resp = await fetch(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${encodeURIComponent(to)}`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Ocp-Apim-Subscription-Region': region,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify([{ Text: text }]),
      });
      if (resp.ok) {
        const data = await resp.json();
        const out = data?.[0]?.translations?.[0]?.text;
        if (out) return out;
      }
    }
  } catch {}

  // Fallback: LibreTranslate (self-hostable, optional key)
  const libreUrl = process.env.LIBRETRANSLATE_URL; // e.g., http://localhost:5000/translate
  const libreKey = process.env.LIBRETRANSLATE_KEY;
  if (libreUrl) {
    try {
      const body: any = { q: text, source: 'auto', target: to, format: 'text' };
      if (libreKey) body.api_key = libreKey;
      const resp = await fetch(libreUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (resp.ok) {
        const data = await resp.json();
        const out = data?.translatedText;
        if (out) return out;
      }
    } catch {}
  }

  // Final fallback: original text
  return text;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawTo = searchParams.get('lang') || process.env.TRANSLATE_TO || 'sr-Latn';
  const to = rawTo === 'sr' ? 'sr-Latn' : rawTo; // default to Latin script
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;
  const source = searchParams.get('source') || undefined;
  const where = source ? { source } : {};
  const [items, total] = await Promise.all([
    prisma.newsItem.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.newsItem.count({ where }),
  ]);
  const now = Date.now();
  const TTL = 12 * 60 * 60 * 1000; // 12h
  const out = await Promise.all(items.map(async (n) => {
    const key = `${n.url}|${n.publishedAt.getTime()}|${to}`;
    let t = cache.get(key);
    if (!t || t.expires < now) {
      const translated = await translate(n.title, to);
      t = { title: translated, expires: now + TTL };
      cache.set(key, t);
    }
    return {
      id: n.id,
      url: n.url,
      source: n.source,
      publishedAt: n.publishedAt,
      title: t.title,
      titleOriginal: n.title,
    };
  }));
  return NextResponse.json({ items: out, total, page, limit, source });
}
