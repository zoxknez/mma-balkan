import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data for idempotent seed (dev only)
  await prisma.fight.deleteMany();
  await prisma.event.deleteMany();
  await prisma.fighter.deleteMany();
  await prisma.club.deleteMany();
  await prisma.news.deleteMany();
  // Seed Clubs
  await prisma.club.createMany({
    data: [
      { name: "Belgrade Fight Club", city: "Beograd", country: "Serbia", address: "Knez Mihailova 1", website: "https://bfc.rs", phone: "+381601234567", members: 120 },
      { name: "Zagreb MMA Academy", city: "Zagreb", country: "Croatia", address: "Ilica 10", website: "https://zmaa.hr", phone: "+385911234567", members: 95 },
      { name: "Sarajevo Combat Gym", city: "Sarajevo", country: "Bosnia and Herzegovina", address: "Ferhadija 3", members: 70 },
      { name: "Skopje Warriors", city: "Skopje", country: "North Macedonia", address: "Makedonija 7", members: 80 },
      { name: "Podgorica Titans", city: "Podgorica", country: "Montenegro", address: "Bulevar 21", members: 55 },
    ],
  });

  // Seed Fighters
  await prisma.fighter.createMany({
    data: [
      { name: "Marko Jovanović", country: "Serbia", countryCode: "RS", weightClass: "Lightweight", wins: 12, losses: 3, draws: 0, isActive: true },
      { name: "Ivan Kovač", country: "Croatia", countryCode: "HR", weightClass: "Welterweight", wins: 15, losses: 4, draws: 0, isActive: true },
      { name: "Amar Hadžić", country: "Bosnia and Herzegovina", countryCode: "BA", weightClass: "Featherweight", wins: 9, losses: 2, draws: 1, isActive: true },
      { name: "Luka Perić", country: "Croatia", countryCode: "HR", weightClass: "Middleweight", wins: 8, losses: 1, draws: 0, isActive: true },
      { name: "Nemanja Ilić", country: "Serbia", countryCode: "RS", weightClass: "Heavyweight", wins: 6, losses: 2, draws: 0, isActive: true },
    ],
  });

  // Seed Events
  const now = new Date();
  const [e1, e2, e3] = await Promise.all([
    prisma.event.create({ data: { name: "Balkan Fight Night 1", startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), status: "SCHEDULED", city: "Novi Sad", country: "Serbia", mainEvent: "Jovanović vs Kovač", ticketsAvailable: true, fightsCount: 3 } }),
    prisma.event.create({ data: { name: "Adriatic MMA Open", startAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), status: "COMPLETED", city: "Split", country: "Croatia", mainEvent: "Kovač vs Perić", ticketsAvailable: false, fightsCount: 3 } }),
    prisma.event.create({ data: { name: "Sarajevo Combat Series", startAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), status: "UPCOMING", city: "Sarajevo", country: "Bosnia and Herzegovina", mainEvent: "Hadžić vs Alić", ticketsAvailable: true, fightsCount: 2 } })
  ]);

  const fighters = await prisma.fighter.findMany();
  const [f1, f2, f3, f4, f5] = fighters;

  // Seed Fights
  await prisma.fight.createMany({
    data: [
      // Event 1 upcoming
      { eventId: e1.id, orderNo: 1, section: 'MAIN',    weightClass: "Lightweight",   redFighterId: f1.id, blueFighterId: f2.id, status: "SCHEDULED" },
      { eventId: e1.id, orderNo: 2, section: 'PRELIMS', weightClass: "Featherweight", redFighterId: f3.id, blueFighterId: f4.id, status: "SCHEDULED" },
      { eventId: e1.id, orderNo: 3, section: 'PRELIMS', weightClass: "Heavyweight",   redFighterId: f5.id, blueFighterId: f2.id, status: "SCHEDULED" },
      // Event 2 completed
      { eventId: e2.id, orderNo: 1, section: 'MAIN',    weightClass: "Welterweight",  redFighterId: f2.id, blueFighterId: f4.id, status: "COMPLETED", winnerFighterId: f2.id, method: "DECISION", round: 3, time: "5:00" },
      { eventId: e2.id, orderNo: 2, section: 'MAIN',    weightClass: "Lightweight",   redFighterId: f1.id, blueFighterId: f3.id, status: "COMPLETED", winnerFighterId: f1.id, method: "KO/TKO", round: 2, time: "3:12" },
      { eventId: e2.id, orderNo: 3, section: 'PRELIMS', weightClass: "Heavyweight",   redFighterId: f5.id, blueFighterId: f1.id, status: "COMPLETED", winnerFighterId: f5.id, method: "SUBMISSION", round: 1, time: "1:45" },
      // Event 3 upcoming
      { eventId: e3.id, orderNo: 1, section: 'MAIN',    weightClass: "Featherweight", redFighterId: f3.id, blueFighterId: f1.id, status: "SCHEDULED" },
      { eventId: e3.id, orderNo: 2, section: 'PRELIMS', weightClass: "Middleweight",  redFighterId: f4.id, blueFighterId: f5.id, status: "SCHEDULED" }
    ]
  });

  // Seed News
  await prisma.news.createMany({
    data: [
      { title: "Balkan Fight Night najavljen", slug: "balkan-fight-night-najavljen", excerpt: "Spektakl u Novom Sadu...", content: "Detaljan sadržaj vesti...", category: "FIGHT_RESULTS", authorName: "MMA Balkan", featured: true, trending: true, publishAt: new Date() },
      { title: "Intervju sa Markom Jovanovićem", slug: "intervju-marko-jovanovic", excerpt: "Ekskluzivni intervju...", content: "Sadržaj intervjua...", category: "INTERVIEWS", authorName: "MMA Balkan", publishAt: new Date() },
      { title: "Skopje Arena Clash objavljen", slug: "skopje-arena-clash-objavljen", excerpt: "Nova priredba u Skoplju...", content: "Najava i detalji...", category: "EVENTS", authorName: "MMA Balkan", trending: true, publishAt: new Date() },
      { title: "Trening kampovi za 2025", slug: "trening-kampovi-2025", excerpt: "Najbolje lokacije...", content: "Lista kampova i saveti...", category: "TRAINING", authorName: "MMA Balkan", publishAt: new Date() },
      { title: "Analiza: Balkan heavyweights", slug: "analiza-balkan-heavyweights", excerpt: "Ko dominira regionom?", content: "Poređenje i statistika...", category: "ANALYSIS", authorName: "MMA Balkan", publishAt: new Date() },
      { title: "Ženski MMA u ekspanziji", slug: "zenski-mma-ekspanzija", excerpt: "Novi talas borkinja...", content: "Intervjui i rezultati...", category: "WOMEN_MMA", authorName: "MMA Balkan", publishAt: new Date() },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log("Seed completed");
    }
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
