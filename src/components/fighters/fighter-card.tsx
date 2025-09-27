'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Fighter } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatRecord, getCountryFlag } from '@/lib/utils';

interface FighterCardProps {
  fighter: Fighter;
  onFollow?: (fighterId: string) => void;
  isFollowing?: boolean;
  showStats?: boolean;
}

export function FighterCard({ 
  fighter, 
  onFollow, 
  isFollowing = false,
  showStats = true 
}: FighterCardProps) {
  const winPercentage = Math.round((fighter.wins / (fighter.wins + fighter.losses + fighter.draws)) * 100);
  
  return (
    <Card hover className="fighter-card group">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-1">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  {fighter.profileImage ? (
                    <img 
                      src={fighter.profileImage} 
                      alt={fighter.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-white">
                      {fighter.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
              </div>
              {/* Country flag */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-xs">
                {getCountryFlag(fighter.countryCode)}
              </div>
            </div>
            
            {/* Name and basic info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">
                {fighter.name}
              </h3>
              {fighter.nickname && (
                <p className="text-sm text-green-400 italic">"{fighter.nickname}"</p>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                <MapPin className="w-3 h-3" />
                <span>{fighter.country}</span>
                <span>•</span>
                <span className="text-green-400 font-semibold">
                  {formatRecord(fighter.wins, fighter.losses, fighter.draws)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Follow button */}
          {onFollow && (
            <Button
              variant={isFollowing ? 'solid' : 'outline'}
              size="sm"
              onClick={() => onFollow(fighter.id)}
              className="min-w-[80px]"
            >
              {isFollowing ? 'Praćen' : 'Prati'}
            </Button>
          )}
        </div>

        {/* Fighter details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-400">Kategorija:</span>
            <p className="text-white font-medium">{fighter.weightClass}</p>
          </div>
          <div>
            <span className="text-gray-400">Stil:</span>
            <p className="text-white font-medium">{fighter.stance}</p>
          </div>
          {fighter.club && (
            <div className="col-span-2">
              <span className="text-gray-400">Klub:</span>
              <p className="text-white font-medium">{fighter.club.name}</p>
            </div>
          )}
        </div>

        {/* Win statistics */}
        {showStats && (
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Procenat pobeda</span>
              <span className="text-green-400 font-bold">{winPercentage}%</span>
            </div>
            
            {/* Win methods breakdown */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-white font-bold">{fighter.koTkoWins}</div>
                <div className="text-gray-400">KO/TKO</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">{fighter.submissionWins}</div>
                <div className="text-gray-400">SUB</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">{fighter.decisionWins}</div>
                <div className="text-gray-400">DEC</div>
              </div>
            </div>
          </div>
        )}

        {/* Ranking */}
        {fighter.ranking && (
          <div className="flex items-center space-x-2 mb-4 p-2 rounded-lg bg-green-400/10 border border-green-400/20">
            <Trophy className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white">
              #{fighter.ranking.position} u {fighter.ranking.organization}
            </span>
          </div>
        )}

        {/* Status indicators */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${fighter.isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
            <span className="text-gray-400">
              {fighter.isActive ? 'Aktivan' : 'Neaktivan'}
            </span>
          </div>
          
          {fighter.lastFight && (
            <div className="flex items-center space-x-1 text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(fighter.lastFight).toLocaleDateString('sr-RS', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          )}
        </div>

        {/* Upcoming fight indicator */}
        {fighter.upcomingFight && (
          <div className="mt-3 p-2 rounded-lg bg-blue-400/10 border border-blue-400/20">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white">
                Sledeća borba: {new Date(fighter.upcomingFight.date).toLocaleDateString('sr-RS')}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}