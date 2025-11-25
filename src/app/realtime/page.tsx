'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeFighters, useRealtimeEvents, useWebSocket, realtimeUtils } from '@/lib/realtime';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { DataTable } from '@/components/ui/data-table';
import { Wifi, WifiOff, RefreshCw, Activity, Users, Calendar } from 'lucide-react';

export default function RealtimePage() {
  const [selectedTab, setSelectedTab] = useState<'fighters' | 'events' | 'messages'>('fighters');
  const [messageFilter, setMessageFilter] = useState<string>('all');

  // Real-time data hooks
  const fightersData = useRealtimeFighters();
  const eventsData = useRealtimeEvents();
  
  // WebSocket connection for general messages
  const { 
    status: wsStatus, 
    messages: wsMessages, 
    connect: wsConnect, 
    disconnect: wsDisconnect,
    sendMessage: sendWsMessage 
  } = useWebSocket({
    url: process.env['NEXT_PUBLIC_WS_URL'] || 'ws://localhost:3001/ws',
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000
  });

  // Connect to WebSocket on mount
  useEffect(() => {
    wsConnect();
    return () => wsDisconnect();
  }, [wsConnect, wsDisconnect]);

  // Filter messages
  const filteredMessages = messageFilter === 'all' 
    ? wsMessages 
    : realtimeUtils.filterMessagesByType(wsMessages, messageFilter as 'fighter_update' | 'event_update' | 'news_update' | 'system_message');

  const tabs = [
    { id: 'fighters', label: 'Borci', icon: Users, count: fightersData.fighters.length },
    { id: 'events', label: 'Događaji', icon: Calendar, count: eventsData.events.length },
    { id: 'messages', label: 'Poruke', icon: Activity, count: wsMessages.length },
  ];

  const messageTypes = [
    { value: 'all', label: 'Sve poruke' },
    { value: 'fighter_update', label: 'Ažuriranja boraca' },
    { value: 'event_update', label: 'Ažuriranja događaja' },
    { value: 'news_update', label: 'Ažuriranja vesti' },
    { value: 'system_message', label: 'Sistemske poruke' },
  ];

  const fightersColumns = [
    { key: 'name', label: 'Ime', sortable: true },
    { key: 'weightClass', label: 'Kategorija', sortable: true },
    { key: 'record', label: 'Rekord', sortable: true },
    { key: 'nationality', label: 'Nacionalnost', sortable: true },
  ];

  const eventsColumns = [
    { key: 'name', label: 'Naziv', sortable: true },
    { key: 'date', label: 'Datum', sortable: true },
    { key: 'location', label: 'Lokacija', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  const sendTestMessage = () => {
    sendWsMessage({
      type: 'system_message',
      data: { message: 'Test poruka iz real-time demo stranice' },
      source: 'client'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Real-time <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Demo
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Live ažuriranja i real-time funkcionalnosti MMA Balkan aplikacije
          </p>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <InteractiveCard
            title="WebSocket Status"
            className={`${wsStatus === 'connected' ? 'border-green-500' : 'border-red-500'}`}
          >
            <div className="flex items-center space-x-3">
              {wsStatus === 'connected' ? (
                <Wifi className="w-6 h-6 text-green-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-400" />
              )}
              <div>
                <p className={`font-medium ${realtimeUtils.getStatusColor(wsStatus)}`}>
                  {realtimeUtils.getStatusText(wsStatus)}
                </p>
                <p className="text-sm text-gray-400">
                  {wsMessages.length} poruka primljeno
                </p>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard
            title="Borci Connection"
            className={`${fightersData.connectionStatus === 'connected' ? 'border-green-500' : 'border-red-500'}`}
          >
            <div className="flex items-center space-x-3">
              {fightersData.connectionStatus === 'connected' ? (
                <Wifi className="w-6 h-6 text-green-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-400" />
              )}
              <div>
                <p className={`font-medium ${realtimeUtils.getStatusColor(fightersData.connectionStatus)}`}>
                  {realtimeUtils.getStatusText(fightersData.connectionStatus)}
                </p>
                <p className="text-sm text-gray-400">
                  {fightersData.fighters.length} boraca učitano
                </p>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard
            title="Događaji Connection"
            className={`${eventsData.connectionStatus === 'connected' ? 'border-green-500' : 'border-red-500'}`}
          >
            <div className="flex items-center space-x-3">
              {eventsData.connectionStatus === 'connected' ? (
                <Wifi className="w-6 h-6 text-green-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-400" />
              )}
              <div>
                <p className={`font-medium ${realtimeUtils.getStatusColor(eventsData.connectionStatus)}`}>
                  {realtimeUtils.getStatusText(eventsData.connectionStatus)}
                </p>
                <p className="text-sm text-gray-400">
                  {eventsData.events.length} događaja učitano
                </p>
              </div>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as 'fighters' | 'events' | 'messages')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {selectedTab === 'fighters' && (
              <motion.div
                key="fighters"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <InteractiveCard
                  title="Real-time Borci"
                  description="Live ažuriranja boraca sa mogućnošću sortiranja"
                  className="p-0"
                >
                  <DataTable
                    data={fightersData.fighters}
                    columns={fightersColumns}
                    loading={fightersData.isLoading}
                    emptyMessage="Nema boraca ili se učitavaju..."
                  />
                </InteractiveCard>
              </motion.div>
            )}

            {selectedTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <InteractiveCard
                  title="Real-time Događaji"
                  description="Live ažuriranja događaja sa mogućnošću sortiranja"
                  className="p-0"
                >
                  <DataTable
                    data={eventsData.events}
                    columns={eventsColumns}
                    loading={eventsData.isLoading}
                    emptyMessage="Nema događaja ili se učitavaju..."
                  />
                </InteractiveCard>
              </motion.div>
            )}

            {selectedTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <InteractiveCard
                  title="Real-time Poruke"
                  description="Live poruke i ažuriranja iz real-time sistema"
                  className="p-6"
                >
                  <div className="space-y-4">
                    {/* Message Filter */}
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-300">
                        Filter poruka:
                      </label>
                      <select
                        value={messageFilter}
                        onChange={(e) => setMessageFilter(e.target.value)}
                        className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:border-green-400 focus:outline-none"
                      >
                        {messageTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={sendTestMessage}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center space-x-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Pošalji test poruku</span>
                      </button>
                    </div>

                    {/* Messages List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredMessages.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                          Nema poruka ili se učitavaju...
                        </p>
                      ) : (
                        filteredMessages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-gray-800 border border-gray-700 rounded-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    message.type === 'fighter_update' ? 'bg-blue-500/20 text-blue-400' :
                                    message.type === 'event_update' ? 'bg-green-500/20 text-green-400' :
                                    message.type === 'news_update' ? 'bg-purple-500/20 text-purple-400' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {message.type}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {realtimeUtils.formatTimestamp(message.timestamp)}
                                  </span>
                                </div>
                                
                                <div className="text-sm text-gray-300">
                                  <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(message.data, null, 2)}
                                  </pre>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-500 ml-4">
                                {message.source}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </InteractiveCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Live Activity Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="fixed bottom-6 right-6"
        >
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            wsStatus === 'connected' ? 'bg-green-600' : 'bg-red-600'
          } text-white shadow-lg`}>
            <div className={`w-2 h-2 rounded-full ${
              wsStatus === 'connected' ? 'bg-green-300 animate-pulse' : 'bg-red-300'
            }`} />
            <span className="text-sm font-medium">
              {wsStatus === 'connected' ? 'Live' : 'Offline'}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
