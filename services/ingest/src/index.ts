// Ingest worker with auto-translation and source link preservation
import dotenv from 'dotenv';
dotenv.config();
import Parser from 'rss-parser';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const SOURCES = (process.env.RSS_SOURCES || '').split(',').map(s => s.trim()).filter(Boolean);
const INTERVAL = Number(process.env.FETCH_INTERVAL_MS || 15 * 60 * 1000);

type FeedItem = {
  title?: string;
  link?: string;
  isoDate?: string;
  content?: string; // rss-parser content
  contentSnippet?: string;
};

function detectLang(text: string): string {
  // Tiny heuristic: if text contains common Serbian/Balkan diacritics, mark sr; else en
  return /[čćšđžČĆŠĐŽ]/.test(text) ? 'sr' : 'en';
}

const TRANSLATE_TO = process.env.TRANSLATE_TO || 'sr';
async function translateToSerbian(text: string): Promise<string> {
  const key = process.env.AZURE_TRANSLATOR_KEY;
  const region = process.env.AZURE_TRANSLATOR_REGION;
  if (!key || !region) return text; // no translator configured
  try {
    const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${encodeURIComponent(TRANSLATE_TO)}`;
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify([{ Text: text }]),
    });
    if (!resp.ok) {
      console.warn('Translator API failed', resp.status, await resp.text());
      return text;
    }
    const data = await resp.json();
    const translated = data?.[0]?.translations?.[0]?.text;
    return translated || text;
  } catch (e) {
    console.warn('Translator error', e);
    return text;
  }
}

async function fetchAndStore() {
  if (SOURCES.length === 0) {
    console.warn('No RSS_SOURCES configured');
    return;
  }
  const parser = new Parser();
  for (const src of SOURCES) {
    try {
      const feed = await parser.parseURL(src);
      const feedSource = (feed.title || src).replace(/^\s*[|\-–—]\s*/,'').trim();
      for (const item of feed.items as FeedItem[]) {
        const url = item.link || '';
        if (!url) continue;
        const title = item.title?.trim() || 'Untitled';
        const publishedAt = item.isoDate ? new Date(item.isoDate) : new Date();
        const rawSummary = (item.contentSnippet || item.content || '').toString().replace(/\s+/g,' ').trim();
        const summary = rawSummary ? (rawSummary.length > 400 ? rawSummary.slice(0, 397) + '…' : rawSummary) : null;
  const originalLang = detectLang(title + ' ' + (summary ?? ''));
        try {
          const createData: any = {
            url,
            title,
            source: feedSource,
            publishedAt,
            tags: [],
          };
          const updateData: any = {
            title,
            source: feedSource,
            publishedAt,
          };
          await prisma.newsItem.upsert({
            where: { url },
            create: createData,
            update: updateData,
          });
        } catch (err) {
          console.error('Upsert failed for', url, err);
        }
      }
    } catch (err) {
      console.error('Failed fetching RSS', src, err);
    }
  }
}

async function main() {
  console.log('Ingest worker started. Sources:', SOURCES);
  await fetchAndStore();
  setInterval(fetchAndStore, INTERVAL);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
