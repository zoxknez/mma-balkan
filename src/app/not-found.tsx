'use client';

import Link from 'next/link';
import { Layout } from '@/components/layout';
import { motion } from 'framer-motion';
import { Zap, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              404
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-white">Stranica nije pronađena</h1>
            <p className="mt-3 text-gray-400">
              Izgleda da ste zalutali u kavez bez izlaza. Vratite se na početnu i nastavite borbu!
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/">
                <Button variant="neon" className="gap-2">
                  <Home className="w-5 h-5" />
                  Početna
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" className="gap-2">
                  <Zap className="w-5 h-5" />
                  Događaji
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
