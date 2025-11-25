// PWA Configuration and utilities
import { useState, useEffect } from 'react';

export const PWA_CONFIG = {
  name: 'MMA Balkan',
  shortName: 'MMA Balkan',
  description: 'MMA portal sa borcima, događajima, vestima i klubovima sa Balkana',
  themeColor: '#00ff88',
  backgroundColor: '#0f0f0f',
  display: 'standalone',
  orientation: 'portrait',
  startUrl: '/',
  scope: '/',
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png',
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png',
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png',
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
};

// Service Worker registration
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}

// Install prompt handling
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<unknown>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    const prompt = deferredPrompt as { prompt: () => void; userChoice: Promise<{ outcome: string }> };
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
      return true;
    }
    
    return false;
  };

  return { isInstallable, installApp };
}

// Offline detection
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}

// Background sync
export function useBackgroundSync() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'sync' in (ServiceWorkerRegistration.prototype as unknown as { sync?: unknown })) {
      setIsSupported(true);
    }
  }, []);

  const syncInBackground = async (tag: string, data?: unknown) => {
    if (!isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as unknown as { sync: { register: (tag: string) => Promise<void> } }).sync.register(tag);
      
      if (data) {
        // Store data for background sync
        const cache = await caches.open('background-sync');
        await cache.put(`sync-${tag}`, new Response(JSON.stringify(data)));
      }
      
      return true;
    } catch (error) {
      console.error('Background sync failed:', error);
      return false;
    }
  };

  return { isSupported, syncInBackground };
}

// Push notifications
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return false;

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const subscribeToPush = async () => {
    if (!isSupported || permission !== 'granted') return null;

    try {
      const vapidKey = process.env['NEXT_PUBLIC_VAPID_PUBLIC_KEY'];
      if (!vapidKey) {
        console.error('VAPID public key not found');
        return null;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  };

  const unsubscribeFromPush = async () => {
    if (!isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      return false;
    }
  };

  return {
    isSupported,
    permission,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
  };
}

// App manifest generation
export function generateManifest() {
  return {
    name: PWA_CONFIG.name,
    short_name: PWA_CONFIG.shortName,
    description: PWA_CONFIG.description,
    start_url: PWA_CONFIG.startUrl,
    display: PWA_CONFIG.display,
    orientation: PWA_CONFIG.orientation,
    theme_color: PWA_CONFIG.themeColor,
    background_color: PWA_CONFIG.backgroundColor,
    scope: PWA_CONFIG.scope,
    icons: PWA_CONFIG.icons,
    categories: ['sports', 'news', 'entertainment'],
    lang: 'sr',
    dir: 'ltr',
  };
}

// Cache strategies
export const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only',
} as const;

export type CacheStrategy = typeof CACHE_STRATEGIES[keyof typeof CACHE_STRATEGIES];

// Cache configuration
export const CACHE_CONFIG = {
  static: {
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    maxAge: 86400000, // 24 hours
  },
  api: {
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    maxAge: 300000, // 5 minutes
  },
  images: {
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    maxAge: 604800000, // 7 days
  },
  fonts: {
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    maxAge: 31536000000, // 1 year
  },
} as const;
