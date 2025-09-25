import { prisma } from '@mmasrb/db';
import PredictButton from './PredictButton';
import Link from 'next/link';
import { Section, Card, List, Item, MetaRow } from '../../ui';

export default async function EventDetail({ params }: { params: { id: string } }) {
  const event = await (prisma as any).event.findUnique({
    where: { id: params.id },
    include: { organization: true, bouts: { include: { fighterA: true, fighterB: true } } },
  });
  if (!event) return <div>Nema događaja.</div>;
  return (
    <Section title={event.name}>
      <MetaRow>
        <span className="badge">{event.organization.name}</span>
        <span style={{ marginLeft: 8 }}>{new Date(event.startsAt).toLocaleString('sr-RS')}</span>
      </MetaRow>
      <Card>
        <List>
          {event.bouts.map((b: any) => (
            <Item key={b.id}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
                <div>
                  <Link href={`/fighters/${b.fighterA.id}`}>{b.fighterA.firstName} {b.fighterA.lastName}</Link>
                  <span className="muted"> vs </span>
                  <Link href={`/fighters/${b.fighterB.id}`}>{b.fighterB.firstName} {b.fighterB.lastName}</Link>
                </div>
                <PredictButton a={`${b.fighterA.firstName} ${b.fighterA.lastName}`} b={`${b.fighterB.firstName} ${b.fighterB.lastName}`} />
              </div>
            </Item>
          ))}
        </List>
      </Card>
    </Section>
  );
}

// PredictButton moved to a dedicated client component
