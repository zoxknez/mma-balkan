import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@mmasrb/db';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const ct = req.headers.get('content-type') || '';
  let author = '';
  let content = '';
  if (ct.includes('application/json')) {
    const j = await req.json().catch(() => ({} as any));
    author = (j.author || '').toString();
    content = (j.content || '').toString();
  } else {
    const fd = await req.formData();
    author = String(fd.get('author') || '');
    content = String(fd.get('content') || '');
  }
  if (!author.trim() || !content.trim()) {
    return NextResponse.json({ error: 'Author and content required' }, { status: 400 });
  }
  await (prisma as any).forumPost.create({
    data: { threadId: params.id, author: author.trim(), content: content.trim() },
  });
  return NextResponse.redirect(new URL(`/forum/${params.id}`, req.url));
}
