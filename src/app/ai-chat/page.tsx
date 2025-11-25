import React from 'react';
import { Metadata } from 'next';
import { AIChatInterface } from '@/components/ai/AIChatInterface';

export const metadata: Metadata = {
  title: 'AI Chat - MMA Balkan',
  description: 'Chat with our AI assistant about MMA fighters, events, and news',
};

export default function AIChatPage() {
  return <AIChatInterface />;
}
