import { prisma } from '@mmasrb/db';
import { Section, Card, List, Item } from '../../ui';

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const thread = await (prisma as any).forumThread.findUnique({
    where: { id: params.id },
    include: { posts: { orderBy: { createdAt: 'asc' } } },
  });
  if (!thread) return <div>Nepostojeća tema.</div>;
  return (
    <Section title={thread.title}>
      <Card>
        <List>
          {thread.posts.map((p: any) => (
            <Item key={p.id}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:8}}>
                <strong>{p.author}</strong>
                <span className="muted">{new Date(p.createdAt).toLocaleString('sr-RS')}</span>
              </div>
              <div>{p.content}</div>
            </Item>
          ))}
        </List>
      </Card>
      <form action={`/forum/${thread.id}/reply`} method="post" style={{ marginTop: 12, display:'grid', gap:8, gridTemplateColumns:'1fr auto' }}>
        <input className="input" type="text" name="author" placeholder="Ime" required />
        <input className="input" type="text" name="content" placeholder="Poruka" required />
        <button className="btn btn-primary" style={{gridColumn:'2 / 3'}}>Pošalji</button>
      </form>
    </Section>
  );
}
