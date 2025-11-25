'use client';

import { motion } from 'framer-motion';
import { Calendar, Target } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from '@/components/ui/UIPrimitives';
import { useCountdown } from '@/hooks/useCountdown';
import { Event, Fight } from '@/lib/types';

const AvatarPrsten = dynamic(() => import('@/components/effects/AvatarPrsten'), {
  loading: () => <div className="w-64 h-64 mx-auto animate-pulse bg-gray-800/50 rounded-full" />,
  ssr: false,
});

interface FeaturedEventSectionProps {
  featuredEvent: Event & { fights?: Fight[] };
}

export function FeaturedEventSection({ featuredEvent }: FeaturedEventSectionProps) {
  const { d, h, m, s } = useCountdown(featuredEvent.startAt.toString());
  
  // Find main event fight
  const mainFight = featuredEvent.fights?.find((f: Fight) => f.section === 'MAIN' && f.orderNo === 1) || featuredEvent.fights?.[0];

  return (
    <motion.div 
      data-testid="featured-fight"
      id="featured"
      className="glass-card p-6 md:p-8 mb-16 mt-10 md:mt-12 holographic relative overflow-hidden max-w-7xl mx-auto px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-blue-600/5" />
      
      <div className="text-center mb-8 relative z-10">
        <motion.span 
          className="text-green-400 font-semibold text-sm uppercase tracking-wider animate-pulse"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚡ Istaknuti meč nedelje ⚡
        </motion.span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-2">
          {featuredEvent.name}
        </h2>
        <p className="text-gray-300 mt-2 text-base md:text-lg">
          {new Date(featuredEvent.startAt).toLocaleDateString('sr-RS')} • {featuredEvent.venue}, {featuredEvent.city}
        </p>
        
        <motion.div 
          data-testid="countdown-timer"
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
        {mainFight && mainFight.redFighter && mainFight.blueFighter ? (
          <>
            {/* Fighter 1 */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <AvatarPrsten 
                name={mainFight.redFighter.name} 
                wins={mainFight.redFighter.wins} 
                losses={mainFight.redFighter.losses}
                className="mb-4" 
              />
              <h4 className="text-2xl font-bold text-white mb-2">{mainFight.redFighter.name}</h4>
              <p className="text-green-400 text-xl font-bold mb-2">
                {mainFight.redFighter.wins}-{mainFight.redFighter.losses}-{mainFight.redFighter.draws}
              </p>
              <div className="flex items-center justify-center mb-4">
                <span className="text-gray-300 font-medium">{mainFight.redFighter.country}</span>
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
                {mainFight.weightClass || 'Main Event'}
              </div>
            </motion.div>

            {/* Fighter 2 */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <AvatarPrsten 
                name={mainFight.blueFighter.name} 
                wins={mainFight.blueFighter.wins} 
                losses={mainFight.blueFighter.losses}
                className="mb-4" 
              />
              <h4 className="text-2xl font-bold text-white mb-2">{mainFight.blueFighter.name}</h4>
              <p className="text-blue-400 text-xl font-bold mb-2">
                {mainFight.blueFighter.wins}-{mainFight.blueFighter.losses}-{mainFight.blueFighter.draws}
              </p>
              <div className="flex items-center justify-center mb-4">
                <span className="text-gray-300 font-medium">{mainFight.blueFighter.country}</span>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="text-center text-gray-400 col-span-3">
            Detalji borbe uskoro...
          </div>
        )}
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
  );
}
