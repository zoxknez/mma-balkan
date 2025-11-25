'use client';

import { useState, useEffect, useCallback } from 'react';

// PWA configuration
export const pwaConfig = {
  name: 'MMA Balkan',
  shortName: 'MMA Balkan',
  description: 'Prva MMA platforma na Balkanu',
  themeColor: '#00ff88',
  backgroundColor: '#1a1a1a',
  display: 'standalone',
  orientation: 'portrait',
  startUrl: '/',
  scope: '/',
  icons: [
    { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
    { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
    { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
    { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
    { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
    { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
  ]
} as const;

// PWA installation hook
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<{ prompt: () => Promise<{ outcome: string }>; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as unknown as { prompt: () => Promise<{ outcome: string }>; userChoice: Promise<{ outcome: string }> });
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error installing app:', error);
      return false;
    }
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    installApp
  };
}

// Offline detection hook
export function useOfflineDetection() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // App came back online
        console.log('App is back online');
        // You can trigger sync here
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      console.log('App went offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}

// Background sync hook
export function useBackgroundSync() {
  const [isSupported, setIsSupported] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      setIsSupported(true);
    }
  }, []);

  const syncInBackground = useCallback(async (tag: string, data?: unknown) => {
    if (!isSupported) return false;

    try {
      setSyncStatus('syncing');
      const registration = await navigator.serviceWorker.ready;
      
      // Register background sync
      await (registration as unknown as { sync: { register: (tag: string) => Promise<void> } }).sync.register(tag);
      
      // Store data for background sync
      if (data) {
        const cache = await caches.open('background-sync');
        await cache.put(`sync-${tag}`, new Response(JSON.stringify(data)));
      }
      
      setSyncStatus('success');
      return true;
    } catch (error) {
      console.error('Background sync failed:', error);
      setSyncStatus('error');
      return false;
    }
  }, [isSupported]);

  return {
    isSupported,
    syncStatus,
    syncInBackground
  };
}

// Push notifications hook
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const subscribeToPush = useCallback(async () => {
    if (!isSupported || permission !== 'granted') return false;

    try {
      const vapidKey = process.env['NEXT_PUBLIC_VAPID_PUBLIC_KEY'];
      if (!vapidKey) {
        console.error('VAPID public key not found');
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey
      });

      setSubscription(subscription);
      
      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }, [isSupported, permission]);

  const unsubscribeFromPush = useCallback(async () => {
    if (!subscription) return false;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }, [subscription]);

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush
  };
}

// Cache management hook
export function useCacheManagement() {
  const [cacheSize, setCacheSize] = useState(0);
  const [cacheKeys, setCacheKeys] = useState<string[]>([]);

  const updateCacheInfo = useCallback(async () => {
    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;
      const allKeys: string[] = [];

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        allKeys.push(...keys.map(request => request.url));
        
        // Estimate cache size (rough calculation)
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      setCacheSize(totalSize);
      setCacheKeys(allKeys);
    } catch (error) {
      console.error('Error updating cache info:', error);
    }
  }, []);

  const clearCache = useCallback(async (cacheName?: string) => {
    try {
      if (cacheName) {
        await caches.delete(cacheName);
      } else {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      await updateCacheInfo();
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }, [updateCacheInfo]);

  const clearOldCache = useCallback(async (maxAge: number = 7 * 24 * 60 * 60 * 1000) => {
    try {
      const cacheNames = await caches.keys();
      const cutoffTime = Date.now() - maxAge;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const dateHeader = response.headers.get('date');
            if (dateHeader) {
              const responseDate = new Date(dateHeader).getTime();
              if (responseDate < cutoffTime) {
                await cache.delete(request);
              }
            }
          }
        }
      }

      await updateCacheInfo();
      return true;
    } catch (error) {
      console.error('Error clearing old cache:', error);
      return false;
    }
  }, [updateCacheInfo]);

  useEffect(() => {
    updateCacheInfo();
  }, [updateCacheInfo]);

  return {
    cacheSize,
    cacheKeys,
    updateCacheInfo,
    clearCache,
    clearOldCache
  };
}

// App update detection hook
export function useAppUpdate() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleServiceWorkerUpdate = () => {
        setIsUpdateAvailable(true);
      };

      window.addEventListener('sw-update', handleServiceWorkerUpdate);

      return () => {
        window.removeEventListener('sw-update', handleServiceWorkerUpdate);
      };
    }
    return undefined;
  }, []);

  const updateApp = useCallback(async () => {
    if (!isUpdateAvailable) return false;

    try {
      setIsUpdating(true);
      
      // Reload the page to get the new service worker
      window.location.reload();
      
      return true;
    } catch (error) {
      console.error('Error updating app:', error);
      setIsUpdating(false);
      return false;
    }
  }, [isUpdateAvailable]);

  return {
    isUpdateAvailable,
    isUpdating,
    updateApp
  };
}

// PWA utilities
export const pwaUtils = {
  // Check if app is running in standalone mode
  isStandalone: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  },

  // Check if app is running on mobile
  isMobile: () => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Get app version from manifest
  getAppVersion: async () => {
    if (typeof window === 'undefined') return '1.0.0';
    try {
      const response = await fetch('/manifest.json');
      const manifest = await response.json();
      return manifest.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  },

  // Show install prompt
  showInstallPrompt: () => {
    if (typeof window === 'undefined') return;
    const event = new CustomEvent('show-install-prompt');
    window.dispatchEvent(event);
  },

  // Hide install prompt
  hideInstallPrompt: () => {
    if (typeof window === 'undefined') return;
    const event = new CustomEvent('hide-install-prompt');
    window.dispatchEvent(event);
  },

  // Check if app is installed
  isAppInstalled: () => {
    if (typeof window === 'undefined') return false;
    return pwaUtils.isStandalone() || 
           localStorage.getItem('app-installed') === 'true';
  },

  // Mark app as installed
  markAppAsInstalled: () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('app-installed', 'true');
  }
};
