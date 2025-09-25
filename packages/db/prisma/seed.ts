import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { name: 'MMA SRB League' },
    update: {},
    create: { name: 'MMA SRB League', country: 'RS' },
  });

  const a = await prisma.fighter.upsert({
    where: { id: 'seed-a' },
    update: {},
    create: {
      id: 'seed-a',
      firstName: 'Marko',
      lastName: 'Petrović',
      country: 'RS',
      reachInCm: 190,
    },
  });

  const b = await prisma.fighter.upsert({
    where: { id: 'seed-b' },
    update: {},
    create: {
      id: 'seed-b',
      firstName: 'Ivan',
      lastName: 'Jovanović',
      country: 'RS',
      reachInCm: 185,
    },
  });

  const event = await prisma.event.create({
    data: {
      organizationId: org.id,
      name: 'MMA SRB 1',
      location: 'Beograd',
      startsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    },
  });

  await prisma.bout.create({
    data: {
      eventId: event.id,
      fighterAId: a.id,
      fighterBId: b.id,
      weightClass: 'Welterweight',
      roundCount: 3,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
