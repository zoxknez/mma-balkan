'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Filter } from 'lucide-react';
import { TrendingTopics } from './TrendingTopics';
import { TrendingTopic } from '../types';

interface SidebarProps {
  trendingTopics: TrendingTopic[];
}

export function Sidebar({ trendingTopics }: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <TrendingTopics topics={trendingTopics} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brze akcije</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Pronađi prijatelje
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Događaji u blizini
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Filter className="h-4 w-4 mr-2" />
            Filtriraj sadržaj
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
