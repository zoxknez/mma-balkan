'use client';

import { useState, useEffect, useCallback } from 'react';
import { monitoring } from '@/lib/monitoring';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'fight_update' | 'event_update' | 'news_update';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Track notification
    monitoring.analytics.trackAction('notification_added', 'user', {
      type: notification.type,
      title: notification.title,
    });

    // Auto-remove non-persistent notifications after 5 seconds
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  }, [removeNotification]);

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // WebSocket connection for real-time notifications
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connect = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/notifications/ws`;
        
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          console.log('Notifications WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'notification') {
              addNotification({
                type: data.notification.type,
                title: data.notification.title,
                message: data.notification.message,
                data: data.notification.data,
                persistent: data.notification.persistent,
                actions: data.notification.actions,
              });
            }
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          console.log('Notifications WebSocket disconnected');
          
          // Reconnect after 5 seconds
          reconnectTimeout = setTimeout(connect, 5000);
        };

        ws.onerror = (error) => {
          console.error('Notifications WebSocket error:', error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Error connecting to notifications WebSocket:', error);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [addNotification]);

  // Server-Sent Events fallback
  useEffect(() => {
    if (isConnected) return; // Use WebSocket if available

    let eventSource: EventSource | null = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/notifications/sse');

        eventSource.onopen = () => {
          console.log('Notifications SSE connected');
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'notification') {
              addNotification({
                type: data.notification.type,
                title: data.notification.title,
                message: data.notification.message,
                data: data.notification.data,
                persistent: data.notification.persistent,
                actions: data.notification.actions,
              });
            }
          } catch (error) {
            console.error('Error parsing SSE notification:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('Notifications SSE error:', error);
          eventSource?.close();
          
          // Reconnect after 5 seconds
          setTimeout(connectSSE, 5000);
        };
      } catch (error) {
        console.error('Error connecting to notifications SSE:', error);
      }
    };

    connectSSE();

    return () => {
      eventSource?.close();
    };
  }, [isConnected, addNotification]);

  return {
    notifications,
    isConnected,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount,
  };
}

// Notification types for common use cases
export const notificationTypes = {
  fightUpdate: (fight: { fighters: string[]; event: string }) => ({
    type: 'fight_update' as const,
    title: 'Fight Update',
    message: `${fight.fighters.join(' vs ')} - ${fight.event}`,
    data: fight,
  }),

  eventUpdate: (event: { name: string; status: string }) => ({
    type: 'event_update' as const,
    title: 'Event Update',
    message: `${event.name} is now ${event.status.toLowerCase()}`,
    data: event,
  }),

  newsUpdate: (news: { title: string; category: string }) => ({
    type: 'news_update' as const,
    title: 'New Article',
    message: `${news.category}: ${news.title}`,
    data: news,
  }),

  success: (title: string, message: string) => ({
    type: 'success' as const,
    title,
    message,
  }),

  error: (title: string, message: string) => ({
    type: 'error' as const,
    title,
    message,
    persistent: true,
  }),

  warning: (title: string, message: string) => ({
    type: 'warning' as const,
    title,
    message,
  }),

  info: (title: string, message: string) => ({
    type: 'info' as const,
    title,
    message,
  }),
};
