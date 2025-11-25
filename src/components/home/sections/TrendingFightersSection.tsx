'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Fighter } from '@/lib/types';

interface TrendingFightersSectionProps {
  trendingFighters: Fighter[];
}

export function TrendingFightersSection({ trendingFighters }: TrendingFightersSectionProps) {
  return (
    <motion.section 
      data-testid="trending-fighters"
      className="mb-16 px-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
        <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
        Popularni borci
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingFighters.map((fighter: Fighter, index: number) => (
          <Card
            key={index}
            data-testid="fighter-card"
            className="fighter-card transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-1 mr-4">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="font-bold">{fighter.name.split(' ').map((n: string) => n[0]).join('')}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white">{fighter.name}</h4>
                  <p className="text-green-400 text-sm">{fighter.wins}-{fighter.losses}-{fighter.draws}</p>
                  <p className="text-gray-300 text-sm">{fighter.country}</p>
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
  );
}
