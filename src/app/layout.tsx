import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
const allowLocal = /localhost|127\.0\.0\.1/.test(siteUrl);
if (process.env.NODE_ENV === 'production' && !allowLocal && !siteUrl.startsWith('https://')) {
  throw new Error('NEXT_PUBLIC_SITE_URL mora biti https u produkciji');
}

export const metadata: Metadata = {
  title: {
    default: 'MMA Balkan — Futuristička MMA platforma',
    template: '%s · MMA Balkan',
  },
  description: 'Premium MMA portal sa borcima, događajima, vestima i klubovima — neuralni UI, live statistika i futuristički vizuali.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'MMA Balkan',
    description: 'Premium MMA portal sa borcima, događajima, vestima i klubovima.',
    type: 'website',
    url: '/',
    siteName: 'MMA Balkan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MMA Balkan',
    description: 'Premium MMA portal sa borcima, događajima, vestima i klubovima.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
