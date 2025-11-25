'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  usePWAInstall, 
  useOfflineDetection, 
  useBackgroundSync, 
  usePushNotifications, 
  useCacheManagement, 
  useAppUpdate,
  pwaUtils 
} from '@/lib/pwa-advanced';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { Modal } from '@/components/ui/modal';
import { Download, Wifi, WifiOff, Bell, BellOff, RefreshCw, Smartphone, Monitor } from 'lucide-react';

export default function PWADemoPage() {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [, setCacheInfo] = useState<{ size: number; keys: string[] }>({ size: 0, keys: [] });

  // PWA Hooks
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const { isOnline, wasOffline } = useOfflineDetection();
  const { isSupported: syncSupported, syncStatus, syncInBackground } = useBackgroundSync();
  const { 
    isSupported: pushSupported, 
    permission, 
    subscription, 
    requestPermission, 
    subscribeToPush, 
    unsubscribeFromPush 
  } = usePushNotifications();
  const { cacheSize, cacheKeys, updateCacheInfo, clearCache, clearOldCache } = useCacheManagement();
  const { isUpdateAvailable, isUpdating, updateApp } = useAppUpdate();

  const [isMounted, setIsMounted] = useState(false);

  // Update cache info on mount
  useEffect(() => {
    setIsMounted(true);
    updateCacheInfo();
    setCacheInfo({ size: cacheSize, keys: cacheKeys });
  }, [cacheSize, cacheKeys, updateCacheInfo]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowInstallModal(false);
    }
  };

  const handlePushSubscribe = async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }
    await subscribeToPush();
  };

  const handlePushUnsubscribe = async () => {
    await unsubscribeFromPush();
  };

  const handleBackgroundSync = async () => {
    await syncInBackground('demo-sync', { message: 'Demo background sync', timestamp: Date.now() });
  };

  const handleClearCache = async () => {
    await clearCache();
    await updateCacheInfo();
  };

  const handleClearOldCache = async () => {
    await clearOldCache();
    await updateCacheInfo();
  };

  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MMA Balkan', {
        body: notificationMessage || 'Test notifikacija iz MMA Balkan aplikacije!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'test-notification'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            PWA <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Demo
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Testiranje naprednih PWA funkcionalnosti MMA Balkan aplikacije
          </p>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Installation Status */}
          <InteractiveCard
            title="Instalacija"
            className={`text-center ${isInstalled ? 'border-green-500' : isInstallable ? 'border-yellow-500' : 'border-gray-600'}`}
            actions={isInstallable && !isInstalled ? [
              {
                label: 'Instaliraj',
                icon: Download,
                onClick: () => setShowInstallModal(true),
                variant: 'primary'
              }
            ] : []}
          >
            <div className="text-3xl mb-2">
              {isInstalled ? '✅' : isInstallable ? '📱' : '❌'}
            </div>
            <p className="text-gray-400">
              {isInstalled ? 'Instalirano' : isInstallable ? 'Dostupno' : 'Nije dostupno'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {pwaUtils.isStandalone() ? 'Standalone mode' : 'Browser mode'}
            </p>
          </InteractiveCard>

          {/* Online Status */}
          <InteractiveCard
            title="Mreža"
            className={`text-center ${isOnline ? 'border-green-500' : 'border-red-500'}`}
          >
            <div className="text-3xl mb-2">
              {isOnline ? <Wifi className="w-8 h-8 text-green-400 mx-auto" /> : <WifiOff className="w-8 h-8 text-red-400 mx-auto" />}
            </div>
            <p className="text-gray-400">
              {isOnline ? 'Online' : 'Offline'}
            </p>
            {wasOffline && (
              <p className="text-xs text-yellow-400 mt-1">
                Bilo je offline
              </p>
            )}
          </InteractiveCard>

          {/* Push Notifications */}
          <InteractiveCard
            title="Notifikacije"
            className={`text-center ${subscription ? 'border-green-500' : 'border-gray-600'}`}
            actions={pushSupported ? [
              {
                label: subscription ? 'Odjavi se' : 'Prijavi se',
                icon: subscription ? BellOff : Bell,
                onClick: subscription ? handlePushUnsubscribe : handlePushSubscribe,
                variant: subscription ? 'danger' : 'primary'
              }
            ] : []}
          >
            <div className="text-3xl mb-2">
              {subscription ? '🔔' : '🔕'}
            </div>
            <p className="text-gray-400">
              {subscription ? 'Aktivno' : 'Neaktivno'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {permission === 'granted' ? 'Dozvoljeno' : permission === 'denied' ? 'Odbijeno' : 'Nije pitano'}
            </p>
          </InteractiveCard>

          {/* App Updates */}
          <InteractiveCard
            title="Ažuriranje"
            className={`text-center ${isUpdateAvailable ? 'border-yellow-500' : 'border-gray-600'}`}
            actions={isUpdateAvailable ? [
              {
                label: isUpdating ? 'Ažurira se...' : 'Ažuriraj',
                icon: RefreshCw,
                onClick: updateApp,
                variant: 'primary'
              }
            ] : []}
          >
            <div className="text-3xl mb-2">
              {isUpdateAvailable ? '🔄' : '✅'}
            </div>
            <p className="text-gray-400">
              {isUpdateAvailable ? 'Dostupno' : 'Ažurno'}
            </p>
          </InteractiveCard>
        </motion.div>

        {/* PWA Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Background Sync */}
          <InteractiveCard
            title="Background Sync"
            description="Sinhronizacija podataka u pozadini"
            className="p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  syncStatus === 'success' ? 'bg-green-500/20 text-green-400' :
                  syncStatus === 'syncing' ? 'bg-yellow-500/20 text-yellow-400' :
                  syncStatus === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {syncStatus === 'idle' ? 'Neaktivan' :
                   syncStatus === 'syncing' ? 'Sinhronizuje se...' :
                   syncStatus === 'success' ? 'Uspešno' :
                   syncStatus === 'error' ? 'Greška' : 'Nepoznato'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Podrška:</span>
                <span className={syncSupported ? 'text-green-400' : 'text-red-400'}>
                  {syncSupported ? 'Da' : 'Ne'}
                </span>
              </div>

              <button
                onClick={handleBackgroundSync}
                disabled={!syncSupported || syncStatus === 'syncing'}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {syncStatus === 'syncing' ? 'Sinhronizuje se...' : 'Pokreni sync'}
              </button>
            </div>
          </InteractiveCard>

          {/* Cache Management */}
          <InteractiveCard
            title="Cache Management"
            description="Upravljanje keš memorijom"
            className="p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Veličina keša:</span>
                <span className="text-blue-400 font-mono">
                  {formatBytes(cacheSize)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Broj ključeva:</span>
                <span className="text-blue-400 font-mono">
                  {cacheKeys.length}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleClearCache}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Obriši sav keš
                </button>
                <button
                  onClick={handleClearOldCache}
                  className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  Obriši stari keš
                </button>
                <button
                  onClick={updateCacheInfo}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Osveži informacije
                </button>
              </div>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Device Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <InteractiveCard
            title="Informacije o uređaju"
            description="Detalji o trenutnom uređaju i browseru"
            className="p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {pwaUtils.isMobile() ? <Smartphone className="w-5 h-5 text-blue-400" /> : <Monitor className="w-5 h-5 text-blue-400" />}
                  <span className="text-gray-300">Tip uređaja:</span>
                  <span className="text-white font-medium">
                    {pwaUtils.isMobile() ? 'Mobilni' : 'Desktop'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Standalone:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    pwaUtils.isStandalone() ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {pwaUtils.isStandalone() ? 'Da' : 'Ne'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">User Agent:</span>
                  <span className="text-xs text-gray-400 font-mono">
                    {isMounted ? navigator.userAgent.substring(0, 50) : 'Loading...'}...
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Platforma:</span>
                  <span className="text-white font-medium">
                    {isMounted ? navigator.platform : 'Loading...'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Jezik:</span>
                  <span className="text-white font-medium">
                    {isMounted ? navigator.language : 'Loading...'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Online:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    isMounted && navigator.onLine ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {isMounted && navigator.onLine ? 'Da' : 'Ne'}
                  </span>
                </div>
              </div>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Test Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <InteractiveCard
            title="Test Notifikacije"
            description="Pošalji test notifikaciju"
            className="p-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Poruka notifikacije:
                </label>
                <input
                  type="text"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Unesite poruku..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
                />
              </div>
              
              <button
                onClick={sendTestNotification}
                disabled={!isMounted || !('Notification' in window) || Notification.permission !== 'granted'}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Pošalji notifikaciju
              </button>
              
              {isMounted && !('Notification' in window) && (
                <p className="text-red-400 text-sm">
                  Browser ne podržava notifikacije
                </p>
              )}
              
              {isMounted && ('Notification' in window) && Notification.permission !== 'granted' && (
                <p className="text-yellow-400 text-sm">
                  Prvo dozvolite notifikacije u browseru
                </p>
              )}
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Install Modal */}
        <Modal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
          title="Instaliraj MMA Balkan"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-300">
              Instaliraj MMA Balkan aplikaciju na svoj uređaj za bolje iskustvo:
            </p>
            
            <ul className="space-y-2 text-gray-400">
              <li>• Brži pristup aplikaciji</li>
              <li>• Rad offline</li>
              <li>• Push notifikacije</li>
              <li>• Native app iskustvo</li>
            </ul>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Instaliraj
              </button>
              <button
                onClick={() => setShowInstallModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Odustani
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
