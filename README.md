# 🥊 MMA Balkan - Futuristička MMA Platforma

Najmodernija web aplikacija za praćenje MMA scene na Balkanu. Spaja sve organizacije, borce i klubove sa regiona na jednom mestu sa futurističkim dizajnom i najnaprednijim tehnologijama.

## 🚀 Tehnologije

- **Frontend Framework:** Next.js 14 + React 18
- **Styling:** Tailwind CSS + Custom Futuristic Design System
- **Animacije:** Framer Motion + CSS3 Animations
- **3D Efekti:** Three.js + React Three Fiber (planiran)
- **State Management:** Zustand
- **API Calls:** React Query + Custom API Client
- **UI Komponente:** Radix UI + Custom Components
- **Typescript:** Full type safety
- **Icons:** Lucide React

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

```bash
# Instaliraj dependencies
npm install

# Pokreni development server
npm run dev

# Otvori http://localhost:3000
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
