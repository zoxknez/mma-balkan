'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/nextjs';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
    console.error('Application error:', error);
  }, [error]);

  return (
    <html lang="sr">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-black flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <div className="glass-card p-8 text-center relative overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5" />
              
              {/* Error Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 relative"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-20" />
                <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </motion.div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-white mb-4">
                Ups! Nešto je pošlo po zlu
              </h1>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Došlo je do neočekivane greške. Naš tim je obavešten i radi na rešavanju problema.
              </p>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-red-400 mb-2">Error Details:</h3>
                  <pre className="text-xs text-gray-300 overflow-auto max-h-32 whitespace-pre-wrap break-words">
                    {error.message}
                  </pre>
                  {error.digest && (
                    <p className="text-xs text-gray-400 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={reset}
                  variant="neon"
                  className="w-full relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-20"
                    whileHover={{ opacity: 0.4 }}
                  />
                  <RefreshCw className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">Pokušaj ponovo</span>
                </Button>

                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Vrati se nazad
                </Button>

                <Button
                  onClick={() => window.location.href = '/'}
                  variant="ghost"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Početna stranica
                </Button>
              </div>

              {/* Support Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  Ako se problem nastavi, kontaktirajte nas na{' '}
                  <a 
                    href="mailto:support@mmabalkan.com" 
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    support@mmabalkan.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}

