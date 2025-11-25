import { CommunityPost } from './types';

export const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Stefan Marković',
      username: '@stefan_mma',
      avatar: '🥊',
      verified: true,
      level: 'Elite Fighter'
    },
    content: 'Upravo završena brutalna training sesija za nadolazeći meč! 💪 5 rundi sparinga sa @marko_heavyweight - ovaj čovek stvarno ne da da se predišem! Hvala na odličnoj pripremi braćo! 🔥 #SrbijanMMA #Training',
    timestamp: '2025-09-27T14:30:00Z',
    likes: 342,
    comments: 47,
    shares: 23,
    tags: ['Training', 'Sparring', 'Preparation'],
    type: 'post',
    trending: true,
    media: null
  },
  {
    id: '2',
    author: {
      name: 'Ana Petrović',
      username: '@ana_analyst',
      avatar: '📊',
      verified: false,
      level: 'MMA Analyst'
    },
    content: 'Detaljana analiza Rakić vs Błachowicz revanša 🧠📈 Ključni faktori:\n\n1️⃣ Rakićeva poboljšana anti-wrestling igra\n2️⃣ Błachowiczova iskustva u title fightovima\n3️⃣ Cardio faktor - ko će bolje izdržati 5 rundi?\n\nMoja predikcija: Rakić via decision 48-47 💯',
    timestamp: '2025-09-27T12:15:00Z',
    likes: 189,
    comments: 62,
    shares: 34,
    tags: ['Analysis', 'Prediction', 'Rakic', 'Blachowicz'],
    type: 'analysis',
    trending: true,
    media: 'analysis_chart.jpg'
  },
  {
    id: '3',
    author: {
      name: 'Marko Božović',
      username: '@marko_coach',
      avatar: '🏃‍♂️',
      verified: true,
      level: 'Head Coach'
    },
    content: 'Tip dana za sve koji treniraju MMA 🥋\n\nNikad ne podcenjujte važnost mobility rada! 15 minuta dynamic stretching-a pre treninga može značajno smanjiti rizik od povrede i poboljšati performanse.\n\n✅ Hip circles\n✅ Leg swings  \n✅ Arm rotations\n✅ Neck rolls\n\nTrenirajte pametno, ne samo naporno! 🧠💪',
    timestamp: '2025-09-27T10:45:00Z',
    likes: 156,
    comments: 28,
    shares: 45,
    tags: ['Training Tips', 'Injury Prevention', 'Mobility'],
    type: 'tip',
    trending: false,
    media: null
  },
  {
    id: '4',
    author: {
      name: 'Milica Jovanović',
      username: '@milica_wmma',
      avatar: '👑',
      verified: true,
      level: 'Pro Fighter'
    },
    content: 'Ponosna što predstavljam ženske MMA na Balkanu! 🇷🇸👸 Juče potpisala sa @onechampionship za borbu u januaru! Dreams do come true when you work hard and believe in yourself! 💫\n\nHvala svima koji me podržavaju na ovom putu! ❤️ #WomenInMMA #OneChampionship #Dreams',
    timestamp: '2025-09-27T09:20:00Z',
    likes: 567,
    comments: 89,
    shares: 78,
    tags: ['Women MMA', 'One Championship', 'Dreams', 'Success'],
    type: 'announcement',
    trending: true,
    media: 'contract_signing.jpg'
  },
  {
    id: '5',
    author: {
      name: 'Nikola Trainer',
      username: '@nikola_s_c',
      avatar: '💪',
      verified: false,
      level: 'Strength Coach'
    },
    content: 'Workout Wednesday! 🔥 Danas radimo explosive power za MMA:\n\n🏋️‍♂️ Deadlifts 5x3 @ 85%\n🤸‍♂️ Box jumps 4x8\n⚡ Med ball slams 3x15\n🏃‍♂️ Sprint intervals 8x30s\n\nKo je speman da se znoji? Drop 💦 u komentarima!',
    timestamp: '2025-09-26T16:00:00Z',
    likes: 234,
    comments: 41,
    shares: 29,
    tags: ['Workout', 'Strength Training', 'Power'],
    type: 'workout',
    trending: false,
    media: 'workout_video.mp4'
  }
];
