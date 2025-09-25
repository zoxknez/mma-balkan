// Simple JS seed script to avoid TS runtime deps
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { name: 'MMA SRB League' },
    update: {},
    create: { name: 'MMA SRB League', country: 'RS' },
  });

  const a = await prisma.fighter.create({
    data: { firstName: 'Marko', lastName: 'Petrović', country: 'RS', reachInCm: 190 },
  });
  const b = await prisma.fighter.create({
    data: { firstName: 'Ivan', lastName: 'Jovanović', country: 'RS', reachInCm: 185 },
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
    console.log('Seed done');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
