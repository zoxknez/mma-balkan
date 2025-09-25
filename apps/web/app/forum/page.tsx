import Link from 'next/link';
import { prisma } from '@mmasrb/db';
import { Section, Card, List, Item } from '../ui';

export default async function ForumPage() {
  const threads = await (prisma as any).forumThread.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <Section title="Forum" right={<form action="/forum/new" method="post"><input className="input" style={{width:260}} type="text" name="title" placeholder="Nova tema..." required /> <button className="btn btn-primary">Otvori</button></form>}>
      <Card>
        <List>
          {threads.map((t: any) => (
            <Item key={t.id}>
              <Link href={`/forum/${t.id}`}>{t.title}</Link>
            </Item>
          ))}
        </List>
      </Card>
    </Section>
  );
}
