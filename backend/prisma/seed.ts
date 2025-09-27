import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Clubs
  await prisma.club.createMany({
    data: [
      { name: "Belgrade Fight Club", city: "Beograd", country: "Serbia", address: "Knez Mihailova 1", website: "https://bfc.rs", phone: "+381601234567", members: 120 },
      { name: "Zagreb MMA Academy", city: "Zagreb", country: "Croatia", address: "Ilica 10", website: "https://zmaa.hr", phone: "+385911234567", members: 95 },
      { name: "Sarajevo Combat Gym", city: "Sarajevo", country: "Bosnia and Herzegovina", address: "Ferhadija 3", members: 70 },
    ],
  });

  // Seed Fighters
  await prisma.fighter.createMany({
    data: [
      { name: "Marko Jovanović", country: "Serbia", countryCode: "RS", weightClass: "Lightweight", wins: 12, losses: 3, draws: 0, isActive: true },
      { name: "Ivan Kovač", country: "Croatia", countryCode: "HR", weightClass: "Welterweight", wins: 15, losses: 4, draws: 0, isActive: true },
      { name: "Amar Hadžić", country: "Bosnia and Herzegovina", countryCode: "BA", weightClass: "Featherweight", wins: 9, losses: 2, draws: 1, isActive: true },
    ],
  });

  // Seed Events
  const now = new Date();
  await prisma.event.createMany({
    data: [
      { name: "Balkan Fight Night 1", startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), status: "SCHEDULED", city: "Novi Sad", country: "Serbia", mainEvent: "Jovanović vs Kovač", ticketsAvailable: true, fightsCount: 10 },
      { name: "Adriatic MMA Open", startAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), status: "COMPLETED", city: "Split", country: "Croatia", mainEvent: "Kovač vs Perić", ticketsAvailable: false, fightsCount: 12 },
      { name: "Sarajevo Combat Series", startAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), status: "UPCOMING", city: "Sarajevo", country: "Bosnia and Herzegovina", mainEvent: "Hadžić vs Alić", ticketsAvailable: true, fightsCount: 9 },
    ],
  });

  // Seed News
  await prisma.news.createMany({
    data: [
      { title: "Balkan Fight Night najavljen", slug: "balkan-fight-night-najavljen", excerpt: "Spektakl u Novom Sadu...", content: "Detaljan sadržaj vesti...", category: "FIGHT_RESULTS", authorName: "MMA Balkan", featured: true, trending: true, publishAt: new Date() },
      { title: "Intervju sa Markom Jovanovićem", slug: "intervju-marko-jovanovic", excerpt: "Ekskluzivni intervju...", content: "Sadržaj intervjua...", category: "INTERVIEWS", authorName: "MMA Balkan", publishAt: new Date() },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
