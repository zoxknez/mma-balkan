'use client';

import React from 'react';
import { LiveTicker } from '@/components/ui/live-ticker';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SkipToMainContent } from '@/components/Accessibility';
import { 
  AnalyticsProvider, 
  PageViewTracker, 
  PerformanceTracker, 
  ErrorTracker, 
  InteractionTracker, 
  ScrollDepthTracker, 
  BusinessMetricsTracker 
} from '@/components/AnalyticsProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <AnalyticsProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900">
          <SkipToMainContent />
          
          {/* Analytics Trackers */}
          <PageViewTracker />
          <PerformanceTracker />
          <ErrorTracker />
          <InteractionTracker />
          <ScrollDepthTracker />
          <BusinessMetricsTracker />
          
          <Navbar />

          {/* Main Content */}
          <main id="main-content" className="pt-16">
            {/* Live ticker for ongoing events moved below navbar */}
            <LiveTicker />
            {children}
          </main>

          <Footer />
        </div>
      </ErrorBoundary>
    </AnalyticsProvider>
  );
}
