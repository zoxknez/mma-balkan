'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  metadata?: Record<string, unknown>;
}

export interface NotificationConfig {
  maxNotifications?: number;
  autoCloseDelay?: number;
  enableSound?: boolean;
  enableVibration?: boolean;
  enablePush?: boolean;
}

// Notification service
class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];
  private config: NotificationConfig = {
    maxNotifications: 50,
    autoCloseDelay: 5000,
    enableSound: true,
    enableVibration: true,
    enablePush: true
  };

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Subscribe to notifications
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.notifications);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Add notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      read: false
    };

    this.notifications.unshift(newNotification);
    
    // Limit notifications
    if (this.notifications.length > this.config.maxNotifications!) {
      this.notifications = this.notifications.slice(0, this.config.maxNotifications);
    }

    this.notifyListeners();

    // Auto close if not persistent
    if (!newNotification.persistent && this.config.autoCloseDelay) {
      setTimeout(() => {
        this.removeNotification(id);
      }, this.config.autoCloseDelay);
    }

    // Play sound
    if (this.config.enableSound) {
      this.playNotificationSound(newNotification.type);
    }

    // Vibrate
    if (this.config.enableVibration && 'vibrate' in navigator) {
      this.vibrate(newNotification.priority);
    }

    // Push notification
    if (this.config.enablePush && 'Notification' in window && Notification.permission === 'granted') {
      this.showPushNotification(newNotification);
    }

    return id;
  }

  // Remove notification
  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Mark as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  // Clear by type
  clearByType(type: NotificationType): void {
    this.notifications = this.notifications.filter(n => n.type !== type);
    this.notifyListeners();
  }

  // Get notifications
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Update config
  updateConfig(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Notify listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Play notification sound
  private playNotificationSound(type: NotificationType): void {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different types
    const frequencies = {
      info: 800,
      success: 1000,
      warning: 600,
      error: 400
    };

    oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  // Vibrate based on priority
  private vibrate(priority: NotificationPriority): void {
    const patterns = {
      low: [100],
      medium: [200],
      high: [300, 100, 300],
      urgent: [400, 100, 400, 100, 400]
    };

    navigator.vibrate(patterns[priority]);
  }

  // Show push notification
  private showPushNotification(notification: Notification): void {
    const icon = this.getNotificationIcon(notification.type);
    
    new Notification(notification.title, {
      body: notification.message,
      icon,
      badge: icon,
      tag: notification.id,
      requireInteraction: !!notification.persistent,
      silent: false
    });
  }

  // Get notification icon
  private getNotificationIcon(type: NotificationType): string {
    const icons = {
      info: '/icons/notification-info.png',
      success: '/icons/notification-success.png',
      warning: '/icons/notification-warning.png',
      error: '/icons/notification-error.png'
    };
    return icons[type];
  }
}

// React hooks
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const service = useRef(NotificationService.getInstance());

  useEffect(() => {
    const unsubscribe = service.current.subscribe((newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(service.current.getUnreadCount());
    });

    return unsubscribe;
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    return service.current.addNotification(notification);
  }, []);

  const removeNotification = useCallback((id: string) => {
    service.current.removeNotification(id);
  }, []);

  const markAsRead = useCallback((id: string) => {
    service.current.markAsRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    service.current.markAllAsRead();
  }, []);

  const clearAll = useCallback(() => {
    service.current.clearAll();
  }, []);

  const clearByType = useCallback((type: NotificationType) => {
    service.current.clearByType(type);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearByType
  };
}

// Notification utilities
export const notificationUtils = {
  // Create notification from error
  createErrorNotification: (error: Error, title?: string): Omit<Notification, 'id' | 'timestamp' | 'read'> => ({
    type: 'error',
    priority: 'high',
    title: title || 'Greška',
    message: error.message,
    persistent: true
  }),

  // Create notification from API response
  createApiNotification: (response: { success: boolean; message: string }, title?: string): Omit<Notification, 'id' | 'timestamp' | 'read'> => ({
    type: response.success ? 'success' : 'error',
    priority: response.success ? 'medium' : 'high',
    title: title || (response.success ? 'Uspešno' : 'Greška'),
    message: response.message,
    persistent: !response.success
  }),

  // Create system notification
  createSystemNotification: (message: string, type: NotificationType = 'info'): Omit<Notification, 'id' | 'timestamp' | 'read'> => ({
    type,
    priority: 'low',
    title: 'Sistem',
    message,
    persistent: false
  }),

  // Create user action notification
  createUserActionNotification: (action: string, success: boolean): Omit<Notification, 'id' | 'timestamp' | 'read'> => ({
    type: success ? 'success' : 'error',
    priority: 'medium',
    title: success ? 'Akcija uspešna' : 'Akcija neuspešna',
    message: action,
    persistent: !success
  }),

  // Get notification color
  getNotificationColor: (type: NotificationType): string => {
    const colors = {
      info: 'text-blue-400',
      success: 'text-green-400',
      warning: 'text-yellow-400',
      error: 'text-red-400'
    };
    return colors[type];
  },

  // Get notification background color
  getNotificationBgColor: (type: NotificationType): string => {
    const colors = {
      info: 'bg-blue-500/20 border-blue-500/30',
      success: 'bg-green-500/20 border-green-500/30',
      warning: 'bg-yellow-500/20 border-yellow-500/30',
      error: 'bg-red-500/20 border-red-500/30'
    };
    return colors[type];
  },

  // Get priority color
  getPriorityColor: (priority: NotificationPriority): string => {
    const colors = {
      low: 'text-gray-400',
      medium: 'text-blue-400',
      high: 'text-yellow-400',
      urgent: 'text-red-400'
    };
    return colors[priority];
  },

  // Format timestamp
  formatTimestamp: (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Upravo sada';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minuta`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} sati`;
    return new Date(timestamp).toLocaleDateString('sr-RS');
  }
};

// Export singleton instance
export const notificationService = NotificationService.getInstance();
