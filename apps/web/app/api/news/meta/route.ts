import { NextResponse } from 'next/server';
import { prisma } from '@mmasrb/db';

export async function GET() {
  // Get distinct sources
  const rows = await (prisma as any).newsItem.findMany({
    distinct: ['source'],
    select: { source: true },
  });
  const sources = rows.map((r: any) => r.source).filter(Boolean).sort((a: string,b: string)=>a.localeCompare(b));
  return NextResponse.json({ sources });
}
