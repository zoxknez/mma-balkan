import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const encoder = new TextEncoder();
  let interval: NodeJS.Timeout | undefined;
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const safeEnqueue = (s: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(s));
        } catch {
          closed = true;
          if (interval) clearInterval(interval);
          try { controller.close(); } catch {}
        }
      };
      safeEnqueue('retry: 1000\n');
      safeEnqueue(`data: {"msg":"Ticker spreman — čekanje dešavanja..."}\n\n`);
      let i = 0;
      interval = setInterval(() => {
        i++;
        const payload = { msg: `Heartbeat ${i}` };
        safeEnqueue(`data: ${JSON.stringify(payload)}\n\n`);
      }, 5000);
    },
    cancel() {
      closed = true;
      if (interval) clearInterval(interval);
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
