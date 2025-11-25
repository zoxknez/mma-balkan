'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * PWA Installer Component
 * Handles:
 * - Service Worker registration
 * - Install prompt
 * - Update notifications
 * - Offline ready notification
 */
export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Service Worker registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register SW
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('✅ Service Worker registered:', reg.scope);
          setRegistration(reg);
          setIsOfflineReady(true);

          // Check for updates periodically
          setInterval(() => {
            reg.update().catch((err) => {
              console.warn('SW update check failed:', err);
            });
          }, 60 * 60 * 1000); // Check every hour

          // Listen for waiting SW
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New SW waiting to activate
                  setShowUpdatePrompt(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.error('❌ Service Worker registration failed:', err);
        });

      // Handle install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        const promptEvent = e as BeforeInstallPromptEvent;
        setDeferredPrompt(promptEvent);
        setShowInstallPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Handle app installed
      const handleAppInstalled = () => {
        console.log('✅ PWA installed');
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
    return undefined;
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User choice: ${outcome}`);

    // Clear prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleUpdateClick = () => {
    if (registration?.waiting) {
      // Tell SW to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload page when new SW activates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  return (
    <>
      {/* Install Prompt Banner */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <div className="glass-card p-4 flex items-center justify-between gap-4 border-green-400/30">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white">
                    Instaliraj MMA Balkan
                  </h3>
                  <p className="text-xs text-gray-300">
                    Koristi kao aplikaciju na telefonu
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  variant="neon"
                  className="text-xs px-3 py-1 h-auto"
                >
                  Instaliraj
                </Button>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                  aria-label="Zatvori"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Available Prompt */}
      <AnimatePresence>
        {showUpdatePrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <div className="glass-card p-4 flex items-center justify-between gap-4 border-blue-400/30">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Novo ažuriranje dostupno!
                </h3>
                <p className="text-xs text-gray-300">
                  Klikni da učitaš najnoviju verziju
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleUpdateClick}
                  size="sm"
                  variant="neon"
                  className="text-xs px-3 py-1 h-auto"
                >
                  Ažuriraj
                </Button>
                <button
                  onClick={() => setShowUpdatePrompt(false)}
                  className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                  aria-label="Zatvori"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Ready Notification (auto-dismiss) */}
      <AnimatePresence>
        {isOfflineReady && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 1 }}
            className="fixed bottom-4 right-4 z-[100]"
            onAnimationComplete={() => {
              setTimeout(() => setIsOfflineReady(false), 3000);
            }}
          >
            <div className="glass-card p-4 flex items-center gap-3 border-green-400/30 max-w-xs">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <p className="text-xs text-gray-300">
                ✅ Aplikacija spremna za offline rad
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Extend Window interface for BeforeInstallPromptEvent
declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

