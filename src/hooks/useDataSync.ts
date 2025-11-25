'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { monitoring } from '@/lib/monitoring';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  failedChanges: number;
}

export interface SyncOptions {
  autoSync?: boolean;
  syncInterval?: number;
  retryAttempts?: number;
  retryDelay?: number;
  batchSize?: number;
}

export function useDataSync(options: SyncOptions = {}) {
  const {
    autoSync = true,
    syncInterval = 30000, // 30 seconds
    batchSize = 10,
  } = options;

  const [status, setStatus] = useState<SyncStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0,
    failedChanges: 0,
  });

  const syncQueue = useRef<Array<() => Promise<void>>>([]);
  const syncTimeout = useRef<NodeJS.Timeout | null>(null);
  const retryTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Add item to sync queue
  const addToSyncQueue = useCallback((syncFn: () => Promise<void>) => {
    syncQueue.current.push(syncFn);
    setStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));
  }, []);

  // Process sync queue
  const processSyncQueue = useCallback(async () => {
    if (syncQueue.current.length === 0 || status.isSyncing) return;

    setStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      const batch = syncQueue.current.splice(0, batchSize);
      const promises = batch.map(async (syncFn, index) => {
        try {
          await syncFn();
          setStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges - 1 }));
        } catch (error) {
          console.error(`Sync item ${index} failed:`, error);
          setStatus(prev => ({ 
            ...prev, 
            failedChanges: prev.failedChanges + 1,
            pendingChanges: prev.pendingChanges - 1
          }));
          throw error;
        }
      });

      await Promise.allSettled(promises);
      
      setStatus(prev => ({ 
        ...prev, 
        lastSync: new Date(),
        isSyncing: false 
      }));

      // Track sync success
      monitoring.analytics.trackAction('data_sync_completed', 'data_sync', {
        batchSize: batch.length,
        pendingRemaining: syncQueue.current.length,
      });

    } catch (error) {
      console.error('Sync queue processing failed:', error);
      setStatus(prev => ({ ...prev, isSyncing: false }));
      
      // Track sync error
      monitoring.errorTracking.trackUserError('data_sync_failed', error as Error, {
        queueLength: syncQueue.current.length,
      });
    }
  }, [status.isSyncing, batchSize]);


  // Manual sync trigger
  const triggerSync = useCallback(async () => {
    if (status.isSyncing) return;
    
    await processSyncQueue();
  }, [processSyncQueue, status.isSyncing]);

  // Clear failed changes
  const clearFailedChanges = useCallback(() => {
    setStatus(prev => ({ ...prev, failedChanges: 0 }));
    
    // Clear retry timeouts
    retryTimeouts.current.forEach(timeout => clearTimeout(timeout));
    retryTimeouts.current.clear();
  }, []);

  // Clear all pending changes
  const clearPendingChanges = useCallback(() => {
    syncQueue.current = [];
    setStatus(prev => ({ 
      ...prev, 
      pendingChanges: 0,
      failedChanges: 0 
    }));
    
    // Clear retry timeouts
    retryTimeouts.current.forEach(timeout => clearTimeout(timeout));
    retryTimeouts.current.clear();
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      
      // Trigger sync when coming back online
      if (autoSync && syncQueue.current.length > 0) {
        triggerSync();
      }
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoSync, triggerSync]);

  // Auto sync interval
  useEffect(() => {
    if (!autoSync || !status.isOnline) return;

    const scheduleSync = () => {
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }

      syncTimeout.current = setTimeout(() => {
        if (syncQueue.current.length > 0) {
          processSyncQueue();
        }
        scheduleSync();
      }, syncInterval);
    };

    scheduleSync();

    return () => {
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
    };
  }, [autoSync, status.isOnline, syncInterval, processSyncQueue]);

  // Cleanup on unmount
  useEffect(() => {
    const currentRetryTimeouts = retryTimeouts.current;
    return () => {
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
      currentRetryTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return {
    // State
    status,
    
    // Actions
    addToSyncQueue,
    triggerSync,
    clearFailedChanges,
    clearPendingChanges,
  };
}

// Hook for specific data synchronization
export function useEntityDataSync<T>(
  entityType: string,
  apiClient: {
    create: (data: T) => Promise<T>;
    update: (id: string, data: Partial<T>) => Promise<T>;
    delete: (id: string) => Promise<void>;
  }
) {
  const { status, addToSyncQueue, triggerSync } = useDataSync({
    autoSync: true,
    syncInterval: 30000,
  });

  // Sync create operation
  const syncCreate = useCallback((data: T) => {
    addToSyncQueue(async () => {
      await apiClient.create(data);
    });
  }, [addToSyncQueue, apiClient]);

  // Sync update operation
  const syncUpdate = useCallback((id: string, data: Partial<T>) => {
    addToSyncQueue(async () => {
      await apiClient.update(id, data);
    });
  }, [addToSyncQueue, apiClient]);

  // Sync delete operation
  const syncDelete = useCallback((id: string) => {
    addToSyncQueue(async () => {
      await apiClient.delete(id);
    });
  }, [addToSyncQueue, apiClient]);

  // Batch sync operations
  const syncBatch = useCallback((operations: Array<{
    type: 'create' | 'update' | 'delete';
    data?: T;
    id?: string;
    updateData?: Partial<T>;
  }>) => {
    addToSyncQueue(async () => {
      for (const operation of operations) {
        switch (operation.type) {
          case 'create':
            if (operation.data) {
              await apiClient.create(operation.data);
            }
            break;
          case 'update':
            if (operation.id && operation.updateData) {
              await apiClient.update(operation.id, operation.updateData);
            }
            break;
          case 'delete':
            if (operation.id) {
              await apiClient.delete(operation.id);
            }
            break;
        }
      }
    });
  }, [addToSyncQueue, apiClient]);

  return {
    status,
    syncCreate,
    syncUpdate,
    syncDelete,
    syncBatch,
    triggerSync,
  };
}
