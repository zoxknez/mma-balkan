import type { FastifyInstance } from 'fastify';
import { ok } from '../lib/apiResponse';

type Activity = {
  id: string;
  user: string;
  action: string;
  timeAgo: string;
  timeISO?: string;
};

const demo: Activity[] = [
  { id: 'a1', user: 'Stefan M.', action: 'postavio predikciju za Rakić vs Błachowicz', timeAgo: 'upravo sada' },
  { id: 'a2', user: 'Marko P.', action: 'komentarisao na SBC 45 diskusiju', timeAgo: 'pre 1 min' },
  { id: 'a3', user: 'Ana K.', action: 'podelila analizu borbe', timeAgo: 'pre 3 min' },
  { id: 'a4', user: 'Nikola T.', action: 'lajkovao fighters profil', timeAgo: 'pre 5 min' },
];

export async function registerActivityRoutes(app: FastifyInstance) {
  // Simple JSON endpoint
  app.get('/api/activity/recent', async () => ok(demo));

  // SSE stream that emits a new random activity every ~20-40s
  app.get('/api/activity/stream', async (req, reply) => {
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-store');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('X-Accel-Buffering', 'no');
    (reply.raw as unknown as { flushHeaders?: () => void }).flushHeaders?.();

    const send = (event: string, data: unknown) => {
      reply.raw.write(`event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`);
    };

    // Initial dump
    send('hello', { data: demo });

    const users = ['Stefan M.', 'Marko P.', 'Ana K.', 'Nikola T.', 'Mina S.', 'Petar V.'];
    const actions = [
      'postavio predikciju',
      'komentarisao',
      'podelio analizu',
      'lajkovao fighters profil',
      'zapratio borca',
    ];

    const interval = setInterval(() => {
      const user = users[Math.floor(Math.random() * users.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const item: Activity = {
        id: `a${Date.now()}`,
        user,
        action,
        timeAgo: 'upravo sada',
      };
      send('activity', { data: item });
    }, 20000 + Math.floor(Math.random() * 20000));

    // heartbeat
    const hb = setInterval(() => send('tick', { t: Date.now() }), 15000);
    req.raw.on('close', () => { clearInterval(interval); clearInterval(hb); });
    return reply;
  });
}
