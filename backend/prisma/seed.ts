import { PrismaClient, WeightClass, FinishMethod, FightStatus, EventStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.prediction.deleteMany();
  await prisma.fight.deleteMany();
  await prisma.event.deleteMany();
  await prisma.fighter.deleteMany();
  await prisma.club.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Seeding database...");

  // Seed Clubs
  const clubs = await Promise.all([
    prisma.club.create({ data: { name: "American Top Team Zagreb", city: "Zagreb", country: "Croatia", address: "Slavonska avenija 3", website: "https://attzagreb.hr", members: 200, logoUrl: "https://placehold.co/200x200/png?text=ATT" } }),
    prisma.club.create({ data: { name: "Ahilej Borilačka Akademija", city: "Beograd", country: "Serbia", address: "Bulevar Despota Stefana 115", members: 150, logoUrl: "https://placehold.co/200x200/png?text=Ahilej" } }),
    prisma.club.create({ data: { name: "Car Dušan Silni", city: "Beograd", country: "Serbia", address: "Gospodara Vučića 189", members: 120, logoUrl: "https://placehold.co/200x200/png?text=CDS" } }),
    prisma.club.create({ data: { name: "Pretorian", city: "Split", country: "Croatia", address: "Poljička cesta 26", members: 80, logoUrl: "https://placehold.co/200x200/png?text=Pretorian" } }),
    prisma.club.create({ data: { name: "Bushido Team", city: "Sarajevo", country: "Bosnia and Herzegovina", address: "Džemala Bijedića 185", members: 90, logoUrl: "https://placehold.co/200x200/png?text=Bushido" } }),
    prisma.club.create({ data: { name: "MMA Klub Kumanovo", city: "Kumanovo", country: "North Macedonia", address: "Done Božinov 12", members: 60, logoUrl: "https://placehold.co/200x200/png?text=Kumanovo" } }),
    prisma.club.create({ data: { name: "Fight Company", city: "Zagreb", country: "Croatia", address: "Vlaška 81", members: 110, logoUrl: "https://placehold.co/200x200/png?text=FC" } }),
    prisma.club.create({ data: { name: "Secutor Academy", city: "Beograd", country: "Serbia", address: "Dobračina 29", members: 180, logoUrl: "https://placehold.co/200x200/png?text=Secutor" } }),
  ]);

  // Seed Fighters
  const fighters = await Promise.all([
    // Heavyweight
    prisma.fighter.create({ data: { name: "Darko Stošić", nickname: "The Hammer", country: "Serbia", countryCode: "RS", weightClass: WeightClass.HEAVYWEIGHT, wins: 19, losses: 6, draws: 0, koTkoWins: 13, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Stosic" } }),
    prisma.fighter.create({ data: { name: "Mirko Filipović", nickname: "Cro Cop", country: "Croatia", countryCode: "HR", weightClass: WeightClass.HEAVYWEIGHT, wins: 38, losses: 11, draws: 2, koTkoWins: 30, isActive: false, imageUrl: "https://placehold.co/400x600/png?text=CroCop" } }),
    
    // Light Heavyweight
    prisma.fighter.create({ data: { name: "Aleksandar Rakić", nickname: "Rocket", country: "Serbia", countryCode: "RS", weightClass: WeightClass.LIGHT_HEAVYWEIGHT, wins: 14, losses: 3, draws: 0, koTkoWins: 9, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Rakic" } }),
    prisma.fighter.create({ data: { name: "Ivan Erslan", country: "Croatia", countryCode: "HR", weightClass: WeightClass.LIGHT_HEAVYWEIGHT, wins: 13, losses: 3, draws: 0, koTkoWins: 9, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Erslan" } }),

    // Middleweight
    prisma.fighter.create({ data: { name: "Duško Todorović", nickname: "Thunder", country: "Serbia", countryCode: "RS", weightClass: WeightClass.MIDDLEWEIGHT, wins: 12, losses: 4, draws: 0, koTkoWins: 8, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Todorovic" } }),
    prisma.fighter.create({ data: { name: "Đani Barbir", country: "Croatia", countryCode: "HR", weightClass: WeightClass.MIDDLEWEIGHT, wins: 6, losses: 0, draws: 0, submissionWins: 3, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Barbir" } }),

    // Welterweight
    prisma.fighter.create({ data: { name: "Roberto Soldić", nickname: "Robocop", country: "Croatia", countryCode: "HR", weightClass: WeightClass.WELTERWEIGHT, wins: 20, losses: 4, draws: 0, koTkoWins: 17, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Soldic" } }),
    prisma.fighter.create({ data: { name: "Uroš Jurišič", country: "Slovenia", countryCode: "SI", weightClass: WeightClass.WELTERWEIGHT, wins: 11, losses: 1, draws: 0, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Jurisic" } }),

    // Lightweight
    prisma.fighter.create({ data: { name: "Uroš Medić", nickname: "The Doctor", country: "Serbia", countryCode: "RS", weightClass: WeightClass.LIGHTWEIGHT, wins: 9, losses: 2, draws: 0, koTkoWins: 7, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Medic" } }),
    prisma.fighter.create({ data: { name: "Vaso Bakočević", nickname: "Psychopath", country: "Montenegro", countryCode: "ME", weightClass: WeightClass.LIGHTWEIGHT, wins: 43, losses: 24, draws: 1, koTkoWins: 25, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Bakocevic" } }),
    prisma.fighter.create({ data: { name: "Francisco Barrio", nickname: "Croata", country: "Argentina", countryCode: "AR", weightClass: WeightClass.LIGHTWEIGHT, wins: 12, losses: 3, draws: 0, submissionWins: 8, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Barrio" } }),
    prisma.fighter.create({ data: { name: "Marko Bojković", nickname: "The Skull Crusher", country: "Serbia", countryCode: "RS", weightClass: WeightClass.LIGHTWEIGHT, wins: 5, losses: 0, draws: 0, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Bojkovic" } }),

    // Featherweight
    prisma.fighter.create({ data: { name: "Filip Pejić", nickname: "Nitro", country: "Croatia", countryCode: "HR", weightClass: WeightClass.FEATHERWEIGHT, wins: 16, losses: 8, draws: 2, koTkoWins: 10, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Pejic" } }),
    prisma.fighter.create({ data: { name: "Ahmed Vila", country: "Bosnia and Herzegovina", countryCode: "BA", weightClass: WeightClass.FEATHERWEIGHT, wins: 11, losses: 4, draws: 1, submissionWins: 6, isActive: true, imageUrl: "https://placehold.co/400x600/png?text=Vila" } }),
  ]);

  // Seed Events
  const now = new Date();
  
  // Past Event
  const fnc15 = await prisma.event.create({
    data: {
      name: "FNC 15: Ljubljana",
      startAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      status: EventStatus.COMPLETED,
      city: "Ljubljana",
      country: "Slovenia",
      venue: "Arena Stožice",
      mainEvent: "Fabjan vs Spahović",
      posterUrl: "https://placehold.co/400x600/png?text=FNC15",
      fightsCount: 9,
      featured: false
    }
  });

  // Upcoming Event 1
  const fnc16 = await prisma.event.create({
    data: {
      name: "FNC 16: Medula",
      startAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: EventStatus.UPCOMING,
      city: "Medulin",
      country: "Croatia",
      venue: "Tvrđava Kaštel",
      mainEvent: "Barrio vs Bakočević 2",
      posterUrl: "https://placehold.co/400x600/png?text=FNC16",
      ticketsAvailable: true,
      ticketUrl: "https://fnc.hr/tickets",
      fightsCount: 8,
      featured: true
    }
  });

  // Upcoming Event 2
  const armmada = await prisma.event.create({
    data: {
      name: "ARMMADA 8",
      startAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      status: EventStatus.SCHEDULED,
      city: "Novi Sad",
      country: "Serbia",
      venue: "SPENS",
      mainEvent: "TBD vs TBD",
      posterUrl: "https://placehold.co/400x600/png?text=ARMMADA",
      ticketsAvailable: false,
      fightsCount: 0,
      featured: false
    }
  });

  // Seed Fights for FNC 16 (Upcoming)
  await prisma.fight.createMany({
    data: [
      {
        eventId: fnc16.id,
        orderNo: 1,
        section: 'MAIN',
        weightClass: WeightClass.LIGHTWEIGHT,
        redFighterId: fighters.find(f => f.name.includes("Barrio"))!.id,
        blueFighterId: fighters.find(f => f.name.includes("Bakočević"))!.id,
        status: FightStatus.SCHEDULED
      },
      {
        eventId: fnc16.id,
        orderNo: 2,
        section: 'CO_MAIN',
        weightClass: WeightClass.MIDDLEWEIGHT,
        redFighterId: fighters.find(f => f.name.includes("Barbir"))!.id,
        blueFighterId: fighters.find(f => f.name.includes("Todorović"))!.id,
        status: FightStatus.SCHEDULED
      },
      {
        eventId: fnc16.id,
        orderNo: 3,
        section: 'MAIN',
        weightClass: WeightClass.LIGHTWEIGHT,
        redFighterId: fighters.find(f => f.name.includes("Bojković"))!.id,
        blueFighterId: fighters.find(f => f.name.includes("Medić"))!.id,
        status: FightStatus.SCHEDULED
      }
    ]
  });

  // Seed News (Simulating multiple sources)
  await prisma.news.createMany({
    data: [
      {
        title: "EKSKLUZIVNO: Vaso Bakočević najavio kraj karijere nakon FNC 16?",
        slug: "vaso-bakocevic-kraj-karijere-fnc-16",
        excerpt: "Popularni 'Psihopat' nagovestio da bi revanš sa Croatom mogao biti njegov poslednji meč.",
        content: "U najnovijem podcastu, Vaso Bakočević je izjavio...",
        category: "INTERVIEW",
        authorName: "Triangle TV",
        sourceUrl: "https://youtube.com/triangletv",
        imageUrl: "https://placehold.co/800x400/png?text=VasoNews",
        featured: true,
        trending: true,
        publishAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        title: "Aleksandar Rakić dobio novog protivnika za UFC 300",
        slug: "rakic-novi-protivnik-ufc-300",
        excerpt: "Nakon povrede Jana Blachowicza, Rakić će se boriti protiv Jirija Prochazke.",
        content: "UFC je danas zvanično potvrdio...",
        category: "NEWS",
        authorName: "MMA Fighting",
        sourceUrl: "https://mmafighting.com",
        imageUrl: "https://placehold.co/800x400/png?text=RakicNews",
        featured: true,
        trending: true,
        publishAt: new Date(now.getTime() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      {
        title: "Roberto Soldić: 'Vraćam se u KSW po pojas'",
        slug: "soldic-povratak-ksw",
        excerpt: "Bivši dvostruki šampion razmišlja o povratku u poljsku promociju.",
        content: "Nakon epizode u ONE Championshipu...",
        category: "RUMORS",
        authorName: "Fightsite.hr",
        sourceUrl: "https://fightsite.hr",
        imageUrl: "https://placehold.co/800x400/png?text=SoldicNews",
        featured: false,
        trending: true,
        publishAt: new Date(now.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        title: "Analiza: Ko su najveći talenti Balkana u 2025?",
        slug: "analiza-talenti-balkana-2025",
        excerpt: "Marko Bojković predvodi listu mladih nada.",
        content: "Detaljna analiza skora i potencijala...",
        category: "ANALYSIS",
        authorName: "MMA Balkan",
        imageUrl: "https://placehold.co/800x400/png?text=Talents",
        featured: false,
        trending: false,
        publishAt: new Date(now.getTime() - 48 * 60 * 60 * 1000) // 2 days ago
      },
      {
        title: "FNC 15 Rezultati: Fabjan šokirao Spahovića",
        slug: "fnc-15-rezultati",
        excerpt: "Slovenački borac slavio tehničkim nokautom u trećoj rundi.",
        content: "Kompletan izveštaj sa priredbe u Ljubljani...",
        category: "EVENT_RESULTS",
        authorName: "Meridian Sport",
        sourceUrl: "https://meridianbetsport.rs",
        imageUrl: "https://placehold.co/800x400/png?text=FNC15Results",
        featured: false,
        trending: true,
        publishAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      },
      {
        title: "Darko Stošić potpisao novi ugovor sa KSW-om",
        slug: "stosic-novi-ugovor-ksw",
        excerpt: "Najbolji srpski teškaš ostaje u Evropi.",
        content: "Stošić je na svom Instagram profilu objavio...",
        category: "NEWS",
        authorName: "Sherdog",
        sourceUrl: "https://sherdog.com",
        imageUrl: "https://placehold.co/800x400/png?text=StosicNews",
        featured: false,
        trending: false,
        publishAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ]
  });

  console.log("✅ Seed completed successfully");
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
