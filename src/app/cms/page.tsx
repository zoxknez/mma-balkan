import React from 'react';
import { Metadata } from 'next';
import { CMSDashboard } from '@/components/cms/CMSDashboard';

export const metadata: Metadata = {
  title: 'CMS Dashboard - MMA Balkan',
  description: 'Content Management System for MMA Balkan platform',
};

export default function CMSPage() {
  return <CMSDashboard />;
}