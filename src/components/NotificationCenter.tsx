'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  Settings,
  Trash2
} from 'lucide-react';
import { useNotifications, notificationUtils, Notification, NotificationType } from '@/lib/notifications';
import { Modal } from '@/components/ui/modal';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearByType
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleActionClick = (action: () => void, event: React.MouseEvent) => {
    event.stopPropagation();
    action();
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const filterOptions = [
    { value: 'all', label: 'Sve', count: notifications.length },
    { value: 'info', label: 'Info', count: notifications.filter(n => n.type === 'info').length },
    { value: 'success', label: 'Uspešno', count: notifications.filter(n => n.type === 'success').length },
    { value: 'warning', label: 'Upozorenje', count: notifications.filter(n => n.type === 'warning').length },
    { value: 'error', label: 'Greška', count: notifications.filter(n => n.type === 'error').length },
  ];

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Notification Bell */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3 text-gray-400 hover:text-green-400 rounded-xl transition-all duration-200 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 border border-transparent group-hover:border-green-400/30 rounded-xl transition-colors" />
          
          <Bell className="w-5 h-5 relative z-10 group-hover:drop-shadow-lg" />
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}

          {/* Pulse effect for unread notifications */}
          {unreadCount > 0 && (
            <motion.div
              className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Scan effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/30 to-transparent opacity-0 group-hover:opacity-100"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.5, ease: "linear" }}
          />
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Notifikacije</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 mt-3">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value as 'all' | NotificationType)}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        filter === option.value
                          ? 'bg-green-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                      {option.count > 0 && (
                        <span className="ml-1 bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded-full text-xs">
                          {option.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-green-400 hover:text-green-300 transition-colors flex items-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Označi sve kao pročitano</span>
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Obriši sve</span>
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nema notifikacija</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-blue-500/5' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium ${
                                  !notification.read ? 'text-white' : 'text-gray-300'
                                }`}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className="text-xs text-gray-500">
                                    {notificationUtils.formatTimestamp(notification.timestamp)}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    notificationUtils.getNotificationBgColor(notification.type)
                                  }`}>
                                    {notification.type}
                                  </span>
                                  {notification.priority === 'urgent' && (
                                    <span className="text-xs text-red-400 font-bold">
                                      URGENTNO
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-1">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex space-x-2 mt-3">
                                {notification.actions.map((action, index) => (
                                  <button
                                    key={index}
                                    onClick={(e) => handleActionClick(action.action, e)}
                                    className={`px-3 py-1 text-xs rounded transition-colors ${
                                      action.variant === 'primary'
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : action.variant === 'danger'
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                                    }`}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {filteredNotifications.length > 0 && (
                <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                  <button className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors">
                    Pogledaj sve notifikacije
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Podešavanja Notifikacija"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Tipovi Notifikacija</h4>
            <div className="space-y-3">
              {filterOptions.slice(1).map((option) => (
                <div key={option.value} className="flex items-center justify-between">
                  <span className="text-gray-300">{option.label}</span>
                  <button
                    onClick={() => clearByType(option.value as NotificationType)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    Obriši sve
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Opcije</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Zvuk notifikacija</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Vibracija</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Push notifikacije</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}