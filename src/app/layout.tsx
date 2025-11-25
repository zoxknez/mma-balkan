import type { Metadata, Viewport } from "next";
import { MotionConfig } from 'framer-motion';
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { PWAInstaller } from "@/components/PWAInstaller";
import { WebVitalsReporter } from "@/components/WebVitalsReporter";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { env } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const siteUrl = env.NEXT_PUBLIC_SITE_URL;

// Viewport configuration (Next.js 15+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00ff88' },
    { media: '(prefers-color-scheme: dark)', color: '#00ff88' },
  ],
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  // Title
  title: {
    default: 'MMA Balkan — MMA portal za region',
    template: '%s · MMA Balkan',
  },
  
  // Description & Keywords
  description: 'MMA portal sa borcima, događajima, vestima i klubovima sa Balkana — sve na jednom mestu.',
  keywords: ['MMA', 'Mixed Martial Arts', 'Balkan', 'Srbija', 'Hrvatska', 'Bosna', 'borci', 'borbe', 'događaji', 'klubovi', 'statistike', 'UFC', 'KSW', 'FNC'],
  
  // Authors & Creator
  authors: [{ name: 'MMA Balkan Team' }],
  creator: 'MMA Balkan',
  publisher: 'MMA Balkan',
  
  // Base URL
  metadataBase: new URL(siteUrl),
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  
  // Canonical
  alternates: { 
    canonical: '/',
    languages: {
      'sr': '/',
      'sr-RS': '/',
    }
  },
  
  // Manifest
  manifest: '/manifest.json',
  
  // App Configuration (PWA)
  applicationName: 'MMA Balkan',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MMA Balkan',
  },
  
  // Format Detection
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    siteName: 'MMA Balkan',
    title: 'MMA Balkan — MMA portal za region',
    description: 'MMA portal sa borcima, događajima, vestima i klubovima sa Balkana — sve na jednom mestu.',
    url: '/',
    locale: 'sr_RS',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MMA Balkan - MMA portal za region',
        type: 'image/jpeg',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'MMA Balkan — MMA portal za region',
    description: 'MMA portal sa borcima, događajima, vestima i klubovima sa Balkana — sve na jednom mestu.',
    site: '@mmabalkan',
    creator: '@mmabalkan',
    images: ['/og-image.jpg'],
  },
  
  // Verification (add your codes here)
  verification: {
    google: '', // Add Google Search Console verification code
    // yandex: '',
    // bing: '',
  },
  
  // Category
  category: 'sports',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MMA Balkan" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <Providers>
            <PWAInstaller />
            <WebVitalsReporter />
            <MotionConfig
              reducedMotion="user"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {children}
            </MotionConfig>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
