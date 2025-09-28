'use client';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, TrendingUp, MapPin, Zap, Target, Shield } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CyberGrid } from '@/components/effects/ParticleSystem';
import { AnimatedCounter, GlitchText } from '@/components/ui/NeuralComponents';
import { /* NeuralStats, */ QuantumStatBar, MomentumGraph } from '@/components/ui/QuantumStats';

// 3D Holographic Display Component
const HolographicDisplayLocal = ({ name, wins, losses, className }: { 
  name: string; 
  wins: number; 
  losses: number; 
  className?: string; 
}) => (
  <motion.div 
    className={`relative w-32 h-32 md:w-40 md:h-40 mx-auto ${className}`}
    animate={{ rotateY: [0, 360] }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-blue-600/20 backdrop-blur-xl border border-green-400/30">
      <div className="absolute inset-4 rounded-full bg-gray-900/80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="text-xs text-green-400 font-bold">{wins}-{losses}</div>
        </div>
      </div>
      {/* Holographic rings */}
      <div className="absolute inset-0 rounded-full border-2 border-green-400/50 animate-ping" />
      <div className="absolute inset-2 rounded-full border border-blue-400/30 animate-pulse" />
    </div>
  </motion.div>
);

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
  
  return (
    <Layout>
      {/* Hero removed per request (title/description/CTAs) */}

      {/* Featured Fight Card - Ultra Enhanced (spaced from navbar and slightly smaller) */}
      <motion.div 
        className="glass-card p-6 md:p-8 mb-16 mt-20 md:mt-24 holographic relative overflow-hidden max-w-7xl mx-auto px-4"
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
          <h3 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-2">
            SBC 45: Rakić vs. Blachowicz II
          </h3>
          <p className="text-gray-300 mt-2 text-base md:text-lg">15. Decembar 2025 • Stark Arena, Beograd</p>
          
          {/* Live countdown timer */}
          <motion.div 
            className="mt-4 flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {['15', '12', '45', '30'].map((time, index) => (
              <div key={index} className="glass-card px-3 py-2 text-center">
                <div className="text-xl md:text-2xl font-bold text-green-400">
                  <AnimatedCounter value={parseInt(time)} />
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
              className="text-6xl md:text-7xl font-bold text-green-400 mb-6"
              animate={{ 
                textShadow: [
                  '0 0 20px #00ff88',
                  '0 0 40px #00ff88, 0 0 60px #00ff88',
                  '0 0 20px #00ff88'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              VS
            </motion.div>
            <div className="text-gray-300 text-base md:text-lg font-semibold mb-4">
              Light Heavyweight Championship
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
              { icon: Trophy, label: 'Titula praćeno', value: '23', color: 'text-pink-400' }
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
            <Card key={index} hover className="fighter-card">
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
                  excerpt: "Croatian Fighting Championship najavljuje spektakularni turnir sa najboljim regionalnm borcima...",
                  time: "Pre 4 sata", 
                  category: "Organizacije",
                  image: "🏟️"
                },
                {
                  title: "Jovana Jędrzejczyk planira povratak",
                  excerpt: "Poljska legenda razmišlja o povratku u okagon nakon dvogodišnje pauze...",
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

      {/* Live Activity Feed */}
      <motion.div
        className="mb-16 px-6 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  <span className="text-red-500 animate-pulse mr-2">●</span>
                  Live Aktivnost
                </h3>
                <Button variant="outline" size="sm">Prikaži sve</Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { user: "Stefan M.", action: "postavio predikciju za Rakić vs Błachowicz", time: "upravo sada" },
                  { user: "Marko P.", action: "komentarisao na SBC 45 diskusiju", time: "pre 1 min" },
                  { user: "Ana K.", action: "podelila analizu borbe", time: "pre 3 min" },
                  { user: "Nikola T.", action: "lajkovao fighters profil", time: "pre 5 min" }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-semibold text-green-400">{activity.user}</span>
                        {' '}{activity.action}
                      </p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
        </div>
      </motion.div>

      {/* Footer CTA - Ultra Enhanced */}
      <motion.div 
        className="text-center relative px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-blue-600/10 rounded-3xl" />
            <CyberGrid />
            
            <div className="relative z-10 py-16">
              <motion.h2 
                className="text-5xl font-bold text-white mb-6"
                animate={{ 
                  textShadow: [
                    '0 0 20px rgba(0,255,136,0.5)',
                    '0 0 40px rgba(0,255,136,0.8)',
                    '0 0 20px rgba(0,255,136,0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Pridruži se{' '}
                <span className="bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
                  Balkanskoj MMA
                </span>{' '}
                zajednici
              </motion.h2>
              
              <p className="text-gray-300 text-xl mb-8 max-w-3xl mx-auto">
                Dobij ekskluzivan pristup analizama, predikcijama i najnovijim vestima iz sveta MMA-a na Balkanu.
                Postani deo buducnosti borbe!
              </p>
              
              <MomentumGraph 
                data={[
                  { date: "Jan", value: 15, result: "win" },
                  { date: "Feb", value: 25, result: "win" },
                  { date: "Mar", value: 35, result: "win" },
                  { date: "Apr", value: 45, result: "win" },
                  { date: "May", value: 60, result: "win" },
                  { date: "Jun", value: 80, result: "win" },
                  { date: "Jul", value: 95, result: "win" }
                ]}
                className="mb-8 max-w-md mx-auto"
              />
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" variant="neon" className="text-xl px-12 py-4">
                  <Zap className="w-6 h-6 mr-2" />
                  Kreiraj nalog
                </Button>
                <Button size="lg" variant="outline" className="text-xl px-12 py-4">
                  <Shield className="w-6 h-6 mr-2" />
                  Saznaj više
                </Button>
              </div>
              
              <motion.div 
                className="mt-12 flex justify-center space-x-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {[
                  { icon: <Users className="w-8 h-8" />, value: "15,000+", label: "Aktivnih članova" },
                  { icon: <Trophy className="w-8 h-8" />, value: "500+", label: "Analiziranih borbi" },
                  { icon: <TrendingUp className="w-8 h-8" />, value: "89%", label: "Tačnost predikcija" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-green-400 mb-2 flex justify-center">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white mb-1">
                      <AnimatedCounter value={parseInt(stat.value.replace(/[^0-9]/g, ''))} />
                      {stat.value.replace(/[0-9]/g, '')}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
      </motion.div>
    </Layout>
  );
}
