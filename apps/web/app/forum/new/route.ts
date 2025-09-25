import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@mmasrb/db';

export async function POST(req: NextRequest) {
  const ct = req.headers.get('content-type') || '';
  let title = '';
  if (ct.includes('application/json')) {
    const j = await req.json().catch(() => ({}));
    title = j.title || '';
  } else {
    const fd = await req.formData();
    title = String(fd.get('title') || '');
  }
  if (!title.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 });
  const thread = await (prisma as any).forumThread.create({ data: { title: title.trim() } });
  return NextResponse.redirect(new URL(`/forum/${thread.id}`, req.url));
}
