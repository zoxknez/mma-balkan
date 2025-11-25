'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Real-time connection types
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
export type MessageType = 'fighter_update' | 'event_update' | 'news_update' | 'system_message';

export interface RealtimeMessage {
  id: string;
  type: MessageType;
  data: Record<string, unknown>;
  timestamp: number;
  source: string;
}

export interface RealtimeConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

// WebSocket connection hook
export function useWebSocket(config: RealtimeConfig) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      setStatus('connecting');
      setError(null);
      
      const ws = new WebSocket(config.url);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        // Start heartbeat
        if (config.heartbeatInterval) {
          heartbeatTimeoutRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' }));
            }
          }, config.heartbeatInterval);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'pong') {
            // Heartbeat response, do nothing
            return;
          }

          const message: RealtimeMessage = {
            id: data.id || Date.now().toString(),
            type: data.type,
            data: data.data || {},
            timestamp: data.timestamp || Date.now(),
            source: data.source || 'server'
          };

          setMessages(prev => [...prev.slice(-99), message]); // Keep last 100 messages
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        
        // Clear heartbeat
        if (heartbeatTimeoutRef.current) {
          clearInterval(heartbeatTimeoutRef.current);
          heartbeatTimeoutRef.current = null;
        }

        // Attempt reconnection
        if (reconnectAttemptsRef.current < (config.maxReconnectAttempts || 5)) {
          reconnectAttemptsRef.current++;
          const delay = (config.reconnectInterval || 3000) * Math.pow(2, reconnectAttemptsRef.current - 1);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setError('Max reconnection attempts reached');
        }
      };

      ws.onerror = () => {
        setStatus('error');
        setError('WebSocket connection error');
      };

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, [config]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message: Omit<RealtimeMessage, 'id' | 'timestamp'>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullMessage: RealtimeMessage = {
        ...message,
        id: Date.now().toString(),
        timestamp: Date.now()
      };
      
      wsRef.current.send(JSON.stringify(fullMessage));
      return true;
    }
    return false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    status,
    messages,
    error,
    connect,
    disconnect,
    sendMessage,
    isConnected: status === 'connected'
  };
}

// Server-Sent Events hook
export function useServerSentEvents(url: string) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) return;

    try {
      setStatus('connecting');
      setError(null);
      
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setStatus('connected');
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          const message: RealtimeMessage = {
            id: data.id || Date.now().toString(),
            type: data.type,
            data: data.data || {},
            timestamp: data.timestamp || Date.now(),
            source: data.source || 'server'
          };

          setMessages(prev => [...prev.slice(-99), message]);
        } catch (err) {
          console.error('Error parsing SSE message:', err);
        }
      };

      eventSource.onerror = () => {
        setStatus('error');
        setError('Server-Sent Events connection error');
      };

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setStatus('disconnected');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    status,
    messages,
    error,
    connect,
    disconnect,
    isConnected: status === 'connected'
  };
}

// Real-time data hooks
export function useRealtimeFighters() {
  const [fighters, setFighters] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { status, messages, connect, disconnect } = useWebSocket({
    url: process.env['NEXT_PUBLIC_WS_URL'] || 'ws://localhost:3001/ws',
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000
  });

  useEffect(() => {
    // Initial data fetch
    const fetchFighters = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/fighters');
        if (response.ok) {
          const data = await response.json();
          setFighters(data.fighters || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch fighters');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFighters();
    connect();
  }, [connect]);

  // Handle real-time updates
  useEffect(() => {
    messages.forEach(message => {
      if (message.type === 'fighter_update') {
        const { action, fighter } = message.data as { action: string; fighter: Record<string, unknown> };
        
        switch (action) {
          case 'create':
            setFighters(prev => [...prev, fighter]);
            break;
          case 'update':
            setFighters(prev => prev.map(f => f['id'] === fighter['id'] ? fighter : f));
            break;
          case 'delete':
            setFighters(prev => prev.filter(f => f['id'] !== fighter['id']));
            break;
        }
      }
    });
  }, [messages]);

  return {
    fighters,
    isLoading,
    error,
    connectionStatus: status,
    connect,
    disconnect
  };
}

export function useRealtimeEvents() {
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { status, messages, connect, disconnect } = useWebSocket({
    url: process.env['NEXT_PUBLIC_WS_URL'] || 'ws://localhost:3001/ws',
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
    connect();
  }, [connect]);

  useEffect(() => {
    messages.forEach(message => {
      if (message.type === 'event_update') {
        const { action, event } = message.data as { action: string; event: Record<string, unknown> };
        
        switch (action) {
          case 'create':
            setEvents(prev => [...prev, event]);
            break;
          case 'update':
            setEvents(prev => prev.map(e => e['id'] === event['id'] ? event : e));
            break;
          case 'delete':
            setEvents(prev => prev.filter(e => e['id'] !== event['id']));
            break;
        }
      }
    });
  }, [messages]);

  return {
    events,
    isLoading,
    error,
    connectionStatus: status,
    connect,
    disconnect
  };
}

// Real-time utilities
export const realtimeUtils = {
  // Format connection status
  getStatusColor: (status: ConnectionStatus) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'disconnected': return 'text-gray-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  },

  // Format connection status text
  getStatusText: (status: ConnectionStatus) => {
    switch (status) {
      case 'connected': return 'Povezan';
      case 'connecting': return 'Povezuje se...';
      case 'disconnected': return 'Nije povezan';
      case 'error': return 'Greška';
      default: return 'Nepoznato';
    }
  },

  // Format message timestamp
  formatTimestamp: (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('sr-RS');
  },

  // Filter messages by type
  filterMessagesByType: (messages: RealtimeMessage[], type: MessageType) => {
    return messages.filter(message => message.type === type);
  },

  // Get latest message of type
  getLatestMessage: (messages: RealtimeMessage[], type: MessageType) => {
    const filtered = messages.filter(message => message.type === type);
    return filtered[filtered.length - 1] || null;
  }
};
