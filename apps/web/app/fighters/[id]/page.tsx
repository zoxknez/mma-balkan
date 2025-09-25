import { prisma } from '@mmasrb/db';
import Link from 'next/link';
import { Section, Card, List, Item } from '../../ui';

export default async function FighterPage({ params }: { params: { id: string } }) {
  const fighter = await (prisma as any).fighter.findUnique({
    where: { id: params.id },
  });
  if (!fighter) return <div>Borac nije pronađen.</div>;

  const bouts = await (prisma as any).bout.findMany({
    where: { OR: [{ fighterAId: fighter.id }, { fighterBId: fighter.id }] },
    include: { event: true, fighterA: true, fighterB: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <Section title={`${fighter.firstName} ${fighter.lastName} ${fighter.country ? `(${fighter.country})` : ''}`}>
      <Card>
        <List>
          {bouts.map((b: any) => {
            const opponent = b.fighterAId === fighter.id ? b.fighterB : b.fighterA;
            return (
              <Item key={b.id}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:8}}>
                  <div>
                    <Link href={`/events/${b.eventId}`}>{b.event.name}</Link>
                    <span className="muted"> • protiv </span>
                    <Link href={`/fighters/${opponent.id}`}>{opponent.firstName} {opponent.lastName}</Link>
                  </div>
                  {b.result && <span className="badge">{b.result}</span>}
                </div>
              </Item>
            );
          })}
        </List>
      </Card>
    </Section>
  );
}
