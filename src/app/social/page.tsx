import React from 'react';
import { Metadata } from 'next';
import { SocialFeed } from '@/components/social/SocialFeed';

export const metadata: Metadata = {
  title: 'Socijalna mreža - MMA Balkan',
  description: 'Povezujte se sa drugim MMA fanovima, delite mišljenja i prati najnovije trendove',
};

export default function SocialPage() {
  return <SocialFeed />;
}