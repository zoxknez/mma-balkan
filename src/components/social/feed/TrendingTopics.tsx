'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { TrendingTopic } from '../types';

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

export function TrendingTopics({ topics }: TrendingTopicsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending teme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topics.map((topic) => (
          <div key={topic.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{topic.name}</p>
              <p className="text-xs text-gray-500">{topic.posts} objava</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {topic.category}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
