'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AnimatedCounter, GlitchText } from '@/components/ui/UIPrimitives';
import { buildICS, downloadICS } from '@/lib/ics';
import { Event } from '@/lib/types';

const CyberGrid = dynamic(() => import('@/components/effects/ParticleSystem').then(mod => ({ default: mod.CyberGrid })), {
  loading: () => null,
  ssr: false,
});

interface HeroSectionProps {
  featuredEvent: Event;
}

export function HeroSection({ featuredEvent }: HeroSectionProps) {
  const router = useRouter();

  return (
    <motion.section 
      data-testid="hero-section"
      className="relative overflow-hidden max-w-7xl mx-auto px-6 mt-6 md:mt-8 pt-8 md:pt-12 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
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

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            data-testid="cta-button"
            size="lg"
            variant="neon"
            className="text-lg md:text-xl px-10 py-3.5"
            onClick={() => router.push('/community')}
          >
            Kreiraj nalog
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg md:text-xl px-10 py-3.5"
            onClick={() => {
              const ics = buildICS({
                uid: featuredEvent.id,
                title: featuredEvent.name,
                description: `Meč u ${featuredEvent.city}`,
                location: `${featuredEvent.venue}, ${featuredEvent.city}`,
                start: new Date(featuredEvent.startAt),
                url: (typeof window !== 'undefined' ? window.location.origin : '') + `/events/${featuredEvent.id}`,
              });
              downloadICS(`${featuredEvent.slug || 'event'}.ics`, ics);
            }}
          >
            Saznaj više
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Aktivnih članova', value: 14929, suffix: '+', accent: 'from-green-400 to-blue-600' },
            { label: 'Analiziranih borbi', value: 500, suffix: '+', accent: 'from-purple-400 to-pink-500' },
            { label: 'Tačnost predikcija', value: 89, suffix: '%', accent: 'from-cyan-400 to-green-500' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="glass-card p-4 rounded-2xl flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${s.accent} opacity-80 mb-1`} />
              <div className="text-xl font-extrabold text-white leading-none">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
