'use client';

import { useState, useCallback, useRef } from 'react';
import { monitoring } from '@/lib/monitoring';

export interface OptimisticUpdate<T> {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: T;
  timestamp: Date;
  status: 'pending' | 'success' | 'error';
  error?: string;
  rollback?: () => void;
}

export interface OptimisticUpdateOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error, rollback: () => void) => void;
  onSettled?: () => void;
  retryAttempts?: number;
  retryDelay?: number;
}

export function useOptimisticUpdates<T extends { id: string }>() {
  const [updates, setUpdates] = useState<OptimisticUpdate<T>[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const retryTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Add optimistic update
  const addUpdate = useCallback((
    type: 'create' | 'update' | 'delete',
    data: T
  ) => {
    const updateId = `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const update: OptimisticUpdate<T> = {
      id: updateId,
      type,
      data,
      timestamp: new Date(),
      status: 'pending',
    };

    setUpdates(prev => [update, ...prev]);

    // Track optimistic update
    monitoring.analytics.trackAction('optimistic_update_added', 'data_sync', {
      type,
      dataId: data.id,
    });

    return updateId;
  }, []);

  // Execute update with rollback support
  const executeUpdate = useCallback(async (
    updateId: string,
    apiCall: () => Promise<unknown>,
    rollbackFn?: () => void
  ) => {
    const update = updates.find(u => u.id === updateId);
    if (!update) return;

    try {
      setIsProcessing(true);
      
      // Update status to processing
      setUpdates(prev => 
        prev.map(u => 
          u.id === updateId 
            ? { ...u, status: 'pending' as const }
            : u
        )
      );

      // Execute API call
      const result = await apiCall();

      // Mark as success
      setUpdates(prev => 
        prev.map(u => 
          u.id === updateId 
            ? { ...u, status: 'success' as const }
            : u
        )
      );

      // Track success
      monitoring.analytics.trackAction('optimistic_update_success', 'data_sync', {
        updateId,
        type: update.type,
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      // Mark as error
      setUpdates(prev => 
        prev.map(u => 
          u.id === updateId 
            ? { 
                ...u, 
                status: 'error' as const, 
                error: errorMessage,
                ...(rollbackFn ? { rollback: rollbackFn } : {})
              }
            : u
        )
      );

      // Track error
      monitoring.errorTracking.trackUserError('optimistic_update_failed', err as Error, {
        updateId,
        type: update.type,
      });

      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [updates]);

  // Retry failed update
  const retryUpdate = useCallback(async (
    updateId: string,
    apiCall: () => Promise<unknown>,
    options: OptimisticUpdateOptions = {}
  ) => {
    const update = updates.find(u => u.id === updateId);
    if (!update) return;

    const { retryAttempts = 3, retryDelay = 1000 } = options;
    let attempts = 0;

    const retry = async (): Promise<void> => {
      try {
        attempts++;
        await executeUpdate(updateId, apiCall, update.rollback);
    } catch {
      if (attempts < retryAttempts) {
        // Schedule retry
        const timeout = setTimeout(() => {
          retry();
        }, retryDelay * attempts);
        
        retryTimeouts.current.set(updateId, timeout);
      } else {
        // Max retries reached
        console.error(`Max retries reached for update ${updateId}`);
      }
    }
    };

    await retry();
  }, [executeUpdate, updates]);

  // Rollback update
  const rollbackUpdate = useCallback((updateId: string) => {
    const update = updates.find(u => u.id === updateId);
    if (!update || !update.rollback) return;

    try {
      update.rollback();
      
      // Remove from updates
      setUpdates(prev => prev.filter(u => u.id !== updateId));
      
      // Track rollback
      monitoring.analytics.trackAction('optimistic_update_rollback', 'data_sync', {
        updateId,
        type: update.type,
      });
    } catch (error) {
      console.error('Rollback failed:', error);
    }
  }, [updates]);

  // Clear completed updates
  const clearCompleted = useCallback(() => {
    setUpdates(prev => prev.filter(u => u.status === 'pending'));
  }, []);

  // Clear all updates
  const clearAll = useCallback(() => {
    // Clear retry timeouts
    retryTimeouts.current.forEach(timeout => clearTimeout(timeout));
    retryTimeouts.current.clear();
    
    setUpdates([]);
  }, []);

  // Get updates by status
  const getUpdatesByStatus = useCallback((status: OptimisticUpdate<T>['status']) => {
    return updates.filter(u => u.status === status);
  }, [updates]);

  // Get pending updates count
  const pendingCount = updates.filter(u => u.status === 'pending').length;

  // Get error updates count
  const errorCount = updates.filter(u => u.status === 'error').length;

  return {
    // State
    updates,
    isProcessing,
    pendingCount,
    errorCount,
    
    // Actions
    addUpdate,
    executeUpdate,
    retryUpdate,
    rollbackUpdate,
    clearCompleted,
    clearAll,
    getUpdatesByStatus,
  };
}

// Hook for specific entity optimistic updates
export function useEntityOptimisticUpdates<T extends { id: string }>(
  entityType: string,
  apiClient: {
    create: (data: Omit<T, 'id'>) => Promise<T>;
    update: (id: string, data: Partial<T>) => Promise<T>;
    delete: (id: string) => Promise<void>;
  }
) {
  const {
    updates,
    isProcessing,
    pendingCount,
    errorCount,
    addUpdate,
    executeUpdate,
    retryUpdate,
    rollbackUpdate,
    clearCompleted,
    clearAll,
  } = useOptimisticUpdates<T>();

  // Optimistic create
  const optimisticCreate = useCallback(async (
    data: Omit<T, 'id'>,
    options: OptimisticUpdateOptions = {}
  ) => {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tempData = { ...data, id: tempId } as T;
    
    const updateId = addUpdate('create', tempData);
    
    try {
      const result = await executeUpdate(
        updateId,
        () => apiClient.create(data),
        () => {
          // Rollback: remove from local state
          console.log('Rolling back create operation');
        }
      );
      
      return result;
    } catch (error) {
      // Retry on failure
      await retryUpdate(updateId, () => apiClient.create(data), options);
      throw error;
    }
  }, [addUpdate, executeUpdate, retryUpdate, apiClient]);

  // Optimistic update
  const optimisticUpdate = useCallback(async (
    id: string,
    data: Partial<T>,
    originalData: T,
    options: OptimisticUpdateOptions = {}
  ) => {
    const updatedData = { ...originalData, ...data } as T;
    const updateId = addUpdate('update', updatedData);
    
    try {
      const result = await executeUpdate(
        updateId,
        () => apiClient.update(id, data),
        () => {
          // Rollback: restore original data
          console.log('Rolling back update operation');
        }
      );
      
      return result;
    } catch (error) {
      // Retry on failure
      await retryUpdate(updateId, () => apiClient.update(id, data), options);
      throw error;
    }
  }, [addUpdate, executeUpdate, retryUpdate, apiClient]);

  // Optimistic delete
  const optimisticDelete = useCallback(async (
    id: string,
    originalData: T,
    options: OptimisticUpdateOptions = {}
  ) => {
    const updateId = addUpdate('delete', originalData);
    
    try {
      await executeUpdate(
        updateId,
        () => apiClient.delete(id),
        () => {
          // Rollback: restore original data
          console.log('Rolling back delete operation');
        }
      );
    } catch (error) {
      // Retry on failure
      await retryUpdate(updateId, () => apiClient.delete(id), options);
      throw error;
    }
  }, [addUpdate, executeUpdate, retryUpdate, apiClient]);

  return {
    // State
    updates,
    isProcessing,
    pendingCount,
    errorCount,
    
    // Actions
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
    rollbackUpdate,
    clearCompleted,
    clearAll,
  };
}
