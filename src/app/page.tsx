'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Users, Trophy, TrendingUp, MapPin, Zap, Target, Shield } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CyberGrid } from '@/components/effects/ParticleSystem';
import { AnimatedCounter, GlitchText } from '@/components/ui/NeuralComponents';
import { /* NeuralStats, */ QuantumStatBar } from '@/components/ui/QuantumStats';
import HolographicDisplayLocal from '@/components/effects/HolographicDisplayLocal';
import { LiveActivity, type Activity } from '@/components/ui/LiveActivity';
import { LiveActivityTight } from '@/components/ui/LiveActivityTight';
import { useCountdown } from '@/hooks/useCountdown';
import { JsonLd } from '@/components/seo/JsonLd';

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map(n => n[0]?.toUpperCase())
    .join('')
    .slice(0, 3) || 'MM';
}

// stari rotirajući avatar uklonjen — koristimo statičan HolographicDisplayLocal sa blagim “breathing” efektom

export default function Home() {
  // Mock data za demonstraciju
  const mockFighterStats = {
    striking: 85,
    grappling: 78,
    cardio: 92,
    power: 88,
    defense: 75,
    aggression: 80
  };
  const eventStartISO = '2025-12-15T19:00:00+01:00';
  const { d, h, m, s } = useCountdown(eventStartISO);
  
  return (
    <Layout>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        name: 'SBC 45: Rakić vs. Błachowicz II',
        sport: 'Mixed Martial Arts',
        startDate: eventStartISO,
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: 'Stark Arena',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Beograd',
            addressCountry: 'RS'
          }
        },
        performer: [
          { '@type': 'Person', name: 'Aleksandar Rakić' },
          { '@type': 'Person', name: 'Jan Błachowicz' }
        ],
        organizer: { '@type': 'Organization', name: 'Serbian Battle Championship' }
      }} />
      {/* HERO: Pridruži se Balkanskoj MMA zajednici */}
      <motion.section 
        className="relative overflow-hidden max-w-7xl mx-auto px-6 mt-6 md:mt-8 pt-8 md:pt-12 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-blue-600/5" />
        <CyberGrid />

        <div className="relative z-10 text-center">
          <h1>
            <GlitchText 
              text="Pridruži se Balkanskoj MMA zajednici" 
              className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
            />
          </h1>
          <p className="text-gray-300 text-base md:text-lg mt-4 max-w-3xl mx-auto">
            Dobij ekskluzivan pristup analizama, predikcijama i najnovijim vestima iz sveta MMA-a na Balkanu. 
            Postani deo budućnosti borbe!
          </p>

          {/* (clean) */}

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="neon" className="text-base md:text-lg px-8">
              Kreiraj nalog
            </Button>
            <Button size="lg" variant="outline" className="text-base md:text-lg px-8">
              Saznaj više
            </Button>
          </div>

          {/* Stat pills */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Aktivnih članova', value: 14929, suffix: '+', accent: 'from-green-400 to-blue-600' },
              { label: 'Analiziranih borbi', value: 500, suffix: '+', accent: 'from-purple-400 to-pink-500' },
              { label: 'Tačnost predikcija', value: 89, suffix: '%', accent: 'from-cyan-400 to-green-500' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="glass-card p-4 rounded-2xl flex items-center gap-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.accent} opacity-80`} />
                <div>
                  <div className="text-xl font-extrabold text-white leading-none">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Fight Card - Ultra Enhanced (spaced from navbar and slightly smaller) */}
      <motion.div 
        id="featured"
        className="glass-card p-6 md:p-8 mb-16 mt-10 md:mt-12 holographic relative overflow-hidden max-w-7xl mx-auto px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-blue-600/5" />
        
        <div className="text-center mb-8 relative z-10">
          <motion.span 
            className="text-green-400 font-semibold text-sm uppercase tracking-wider animate-pulse"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚡ FEATURED MEČ NEDELJE ⚡
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-2">
            SBC 45: Rakić vs. Blachowicz II
          </h2>
          <p className="text-gray-300 mt-2 text-base md:text-lg">15. decembar 2025 • Stark Arena, Beograd</p>
          
          {/* Live countdown timer */}
          <motion.div 
            className="mt-4 flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[d, h, m, s].map((time, index) => (
              <div key={index} className="glass-card px-3 py-2 text-center">
                <div className="text-xl md:text-2xl font-bold text-green-400">
                  <AnimatedCounter value={Number.isFinite(time) ? time : 0} />
                </div>
                <div className="text-xs text-gray-400">
                  {['DANA', 'SATI', 'MIN', 'SEK'][index]}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-center relative z-10">
          {/* Fighter 1 - 3D Avatar */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <HolographicDisplayLocal 
              name="Aleksandar Rakić" 
              wins={14} 
              losses={3}
              className="mb-4" 
            />
            <h4 className="text-2xl font-bold text-white mb-2">Aleksandar Rakić</h4>
            <p className="text-green-400 text-xl font-bold mb-2">14-3-0</p>
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-red-600 mr-2 rounded-sm shadow-lg"></div>
              <span className="text-gray-300 font-medium">Srbija</span>
            </div>
            {/* Quick Stats */}
            <div className="space-y-2">
              <QuantumStatBar 
                label="Striking" 
                value={mockFighterStats.striking} 
                maxValue={100} 
                color="#00ff88"
                icon={<Target className="w-4 h-4" />}
              />
              <QuantumStatBar 
                label="Power" 
                value={mockFighterStats.power} 
                maxValue={100} 
                color="#ff3366"
                icon={<Zap className="w-4 h-4" />}
              />
            </div>
          </motion.div>

          {/* VS Section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.div 
              className="text-6xl md:text-7xl font-bold text-green-400 mb-6 drop-shadow-[0_0_18px_#00ff88]"
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
            >
              VS
            </motion.div>
            <div className="text-gray-300 text-base md:text-lg font-semibold mb-4">
              Poluteška titula
            </div>
            <div className="glass-card p-4">
              <div className="text-sm text-gray-400 mb-2">Fight Odds</div>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-green-400 font-bold">-150</div>
                  <div className="text-xs text-gray-400">Rakić</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold">+130</div>
                  <div className="text-xs text-gray-400">Błachowicz</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fighter 2 - 3D Avatar */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <HolographicDisplayLocal 
              name="Jan Błachowicz" 
              wins={29} 
              losses={10}
              className="mb-4" 
            />
            <h4 className="text-2xl font-bold text-white mb-2">Jan Błachowicz</h4>
            <p className="text-blue-400 text-xl font-bold mb-2">29-10-1</p>
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-6 bg-gradient-to-r from-white to-red-600 mr-2 rounded-sm shadow-lg"></div>
              <span className="text-gray-300 font-medium">Poljska</span>
            </div>
            {/* Quick Stats */}
            <div className="space-y-2">
              <QuantumStatBar 
                label="Defense" 
                value={82} 
                maxValue={100} 
                color="#00ccff"
                icon={<Shield className="w-4 h-4" />}
              />
              <QuantumStatBar 
                label="Experience" 
                value={95} 
                maxValue={100} 
                color="#8B5CF6"
                icon={<Trophy className="w-4 h-4" />}
              />
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="text-center mt-12 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="neon" size="lg" className="text-base md:text-lg px-6 md:px-8">
              <Target className="w-5 h-5 mr-2" />
              Predikcije zajednice
            </Button>
            <Button variant="outline" size="lg" className="text-base md:text-lg px-6 md:px-8">
              <Calendar className="w-5 h-5 mr-2" />
              Dodaj u kalendar
            </Button>
          </div>
        </motion.div>
      </motion.div>
      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 px-6">
            {[
              { icon: Users, label: 'Aktivnih boraca', value: '1,247', color: 'text-green-400' },
              { icon: Calendar, label: 'Događaja mesečno', value: '47', color: 'text-blue-400' },
              { icon: MapPin, label: 'Klubova u bazi', value: '284', color: 'text-purple-400' },
              { icon: Trophy, label: 'Praćenih titula', value: '23', color: 'text-pink-400' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="glass-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
      </div>

      {/* Trending Fighters */}
      <motion.section 
        className="mb-16 px-6 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
          <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
          Trending borci
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Miloš Terzić', record: '12-2-0', org: 'SBC', flag: 'serbia' },
            { name: 'Ana Bajić', record: '8-1-0', org: 'FNC', flag: 'serbia' },
            { name: 'Marko Petrović', record: '15-4-1', org: 'Megdan', flag: 'montenegro' }
          ].map((fighter, index) => (
            <Card key={index} className="fighter-card transition-transform duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-1 mr-4">
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="font-bold">{fighter.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{fighter.name}</h4>
                    <p className="text-green-400 text-sm">{fighter.record}</p>
                    <p className="text-gray-300 text-sm">{fighter.org}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Prati borca
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Latest News & Updates - Ultra Enhanced */}
      <motion.div
        className="mb-16 px-6 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
            <div className="text-center mb-12">
              <GlitchText 
                text="NAJNOVIJE VESTI" 
                className="text-4xl font-bold mb-4"
              />
              <p className="text-gray-300 text-lg">Pratite sve najbitnije iz sveta Balkanske MMA scene</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Rakić spreman za revanš protiv Błachowicza",
                  excerpt: "Aleksandar Rakić završio je intenzivnu pripremu u Austriji i spreman je da povrati titulu...",
                  time: "Pre 2 sata",
                  category: "Najave",
                  image: "🥊"
                },
                {
                  title: "Nova MMA promocija stiže u Zagreb",
                  excerpt: "Croatian Fighting Championship najavljuje spektakularni turnir sa najboljim regionalnim borcima...",
                  time: "Pre 4 sata", 
                  category: "Organizacije",
                  image: "🏟️"
                },
                {
                  title: "Jovana Jędrzejczyk planira povratak",
                  excerpt: "Poljska legenda razmišlja o povratku u oktagon nakon dvogodišnje pauze...",
                  time: "Pre 6 sati",
                  category: "Borci",
                  image: "👑"
                }
              ].map((news, index) => (
                <motion.div
                  key={index}
                  className="glass-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-4 text-center group-hover:animate-bounce">
                    {news.image}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">
                      {news.category}
                    </span>
                    <span className="text-gray-400 text-sm">{news.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center text-green-400 text-sm font-semibold group-hover:translate-x-2 transition-transform">
                    Pročitaj više →
                  </div>
                </motion.div>
              ))}
            </div>
      </motion.div>

      {/* Live Activity Feed (uži, još zbijen) */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <LiveActivityTight
          items={[
            { id: '1', user: 'Stefan M.', action: 'postavio predikciju za Rakić vs Błachowicz', timeAgo: 'upravo sada' },
            { id: '2', user: 'Marko P.',  action: 'komentarisao na SBC 45 diskusiju', timeAgo: 'pre 1 min' },
            { id: '3', user: 'Ana K.',    action: 'podelila analizu borbe', timeAgo: 'pre 3 min' },
            { id: '4', user: 'Nikola T.', action: 'lajkovao fighters profil', timeAgo: 'pre 5 min' },
          ]}
        />
      </motion.div>

    </Layout>
  );
}
