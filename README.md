# 🥊 MMA Balkan - Futuristička MMA Platforma

Najmodernija web aplikacija za praćenje MMA scene na Balkanu. Spaja sve organizacije, borce i klubove sa regiona na jednom mestu sa futurističkim dizajnom i najnaprednijim tehnologijama.

## 🚀 Tehnologije

- Frontend: Next.js 15 + React 19 + TypeScript 5
- Styling: Tailwind CSS v4 + custom futuristički dizajn
- Animacije: Framer Motion
- Efekti: Custom Particle/Cyber Grid (Three.js planiran)
- Data: SWR hooks + custom API client (ok/fail schema)
- UI: Custom komponente + Lucide ikone
- Lint: ESLint 9 (core-web-vitals, typescript)

## 🎨 Dizajn Koncepti

### Futuristička Paleta Boja
- **Pozadina:** Gradijenti od #0f0f0f do #2a2a2a
- **Neon Akcenti:** #00ff88 (limeta), #00ccff (teal)
- **Glassmorphism:** Transparentne kartice sa blur efektima
- **Holografski Efekti:** Shimmer animacije na hover

### Animacije
- Smooth page transitions
- Hover efekti sa scale transformacijama  
- Loading animacije sa neon glow
- Particle sistemi u pozadini (planiran)

## 📱 Funkcionalnosti

### MVP (Trenutno)
- ✅ Futuristička početna stranica
- ✅ Responsive navigacija sa glassmorphism
- ✅ Lista boraca sa filtering i pretragom
- ✅ Fighter cards sa statistikama
- ✅ Animirane UI komponente
- ✅ API client arhitektura

### V2 (Planiran)
- 🔄 3D Avatar komponente
- 🔄 Live statistike i scoring
- 🔄 Predikcije zajednice
- 🔄 Push notifikacije
- 🔄 Ćirilica/Latinica toggle
- 🔄 Multi-jezik podrška

## 🔧 Pokretanje

```powershell
# 1) Install deps (root + backend)
npm install; npm install --prefix backend

# 2) Env fajlovi
Copy-Item .env.example .env -Force
Copy-Item backend\.env.example backend\.env -Force

# 3) Prisma (dev db)
npm --prefix backend run prisma:generate; npm --prefix backend run prisma:migrate; npm --prefix backend run prisma:seed

# 4) Start dev (frontend + backend concurrently)
npm run dev

# Frontend: http://localhost:3002
# Backend:  http://localhost:3003 (Swagger: /docs)

```

## 🛠️ Deploy with Approvals (GitHub Actions)

1) Frontend (Vercel)
- Go to GitHub → Actions → "Deploy to Vercel (Production)" → Run workflow
- Optionally fill inputs:
  - environment: prod or preview
  - site_url: https://mma-balkan.org
  - backend_url: your backend URL (e.g., from Railway)
  - domain: mma-balkan.org
- Required repo secrets (Settings → Secrets → Actions):
  - VERCEL_TOKEN
  - VERCEL_ORG_ID
  - VERCEL_PROJECT_ID

2) Backend (Railway)
- Go to GitHub → Actions → "Backend Deploy (Railway)" → Run workflow
- Optional input: service (if multiple services in one project)
- Required repo secret:
  - RAILWAY_TOKEN
```

## 📁 Struktura Projekta

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Početna stranica
│   ├── fighters/          # Stranice za borce
│   └── globals.css        # Globalni stilovi
├── components/            
│   ├── ui/                # Osnovne UI komponente
│   ├── fighters/          # Fighter-specific komponente
│   └── layout.tsx         # Glavni layout
├── lib/
│   ├── api/               # API client i servisi
│   ├── types.ts           # TypeScript tipovi
│   └── utils.ts           # Helper funkcije
backend/
  ├── src/                 # Fastify v5 API rute
  ├── prisma/              # Prisma schema + seed
  └── Dockerfile           # Deploy
```

## 🎯 Ključne Komponente

### Button
```tsx
<Button variant="neon" size="lg">
  Futuristički dugme
</Button>
```

### Card (Glassmorphism)
```tsx
<Card glass hover>
  <CardContent>
    Transparentna kartica sa blur efektom
  </CardContent>
</Card>
```

### FighterCard
```tsx
<FighterCard 
  fighter={fighter}
  onFollow={handleFollow}
  showStats={true}
/>
```

## 🌐 API Integracija

### Besplatni APIs
- **Wikidata SPARQL** - Osnovni podaci o borcima
- **Wikipedia REST API** - Biografije i slike
- **TheSportsDB** - UFC organizacija podaci
- **Custom Backend** - Balkanski borci i organizacije

### API Client
```typescript
// Primer korišćenja
const fighters = await FighterService.getFighters({
  search: "Rakić",
  weightClass: WeightClass.LIGHT_HEAVYWEIGHT,
  limit: 10
});
```

### REST Endpoints (primer)
- GET /api/fighters, /api/fighters/:id, /api/fighters/trending
- GET /api/events, /api/events/:id, /api/events/upcoming, /api/events/live
- GET /api/clubs, /api/clubs/:id
- GET /api/news, /api/news/:id

Swagger UI: http://localhost:3001/docs

## 🎨 Custom CSS Klase

```css
.glass-card       /* Glassmorphism efekat */
.neon-button      /* Neon glow dugme */
.holographic      /* Shimmer animacija */
.fighter-card     /* Fighter kartica sa hover */
```

## 🌍 Lokalizacija

Podržani jezici:
- 🇷🇸 Srpski (Latinica/Ćirilica)
- 🇭🇷 Hrvatski  
- 🇧🇦 Bosanski
- 🇲🇪 Crnogorski
- 🇸🇮 Slovenski
- 🇲🇰 Makedonski 
- 🇦🇱 Albanski

## 📈 Roadmap

### Q1 2025
- [x] MVP Frontend
- [ ] Backend API
- [ ] User Authentication
- [ ] Fighter database

### Q2 2025  
- [ ] 3D Avatars
- [ ] Live Scoring
- [ ] Mobile App
- [ ] Push Notifications

## 👨‍💻 Autor

**GitHub Copilot** & **zoxknez**
- GitHub: [@zoxknez](https://github.com/zoxknez)

---

⭐ **Star** repo ako ti se dopada projekat!  
🔥 **Forkovaj** i kreiraj svoje MMA aplikacije!  
💪 **Kontribuiraj** i postani deo MMA Balkan tima!

**Sve borbe. Svi borci. Svi klubovi sa Balkana — na jednom mestu.**
