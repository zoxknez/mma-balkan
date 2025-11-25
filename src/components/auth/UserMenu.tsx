'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  Calendar
} from 'lucide-react';
import { useAuth, authUtils } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { AuthModal } from './AuthModal';
import { UserProfile } from './UserProfile';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="neon-gradient"
          size="sm"
          onClick={() => setShowAuthModal(true)}
          className="relative overflow-hidden group h-9 px-4 leading-none whitespace-nowrap"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-20"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <span className="relative z-10 font-semibold">Prijavi se</span>

          <motion.div
            className="absolute inset-0 bg-green-400/30 rounded-lg opacity-0 group-hover:opacity-100"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        </Button>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* User Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white rounded-lg transition-colors group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {authUtils.getInitials(user!)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium">{user!.firstName && user!.lastName ? `${user!.firstName} ${user!.lastName}` : user!.username}</p>
            <p className="text-xs text-gray-400">{authUtils.getRoleDisplayName(user!.role)}</p>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {authUtils.getInitials(user!)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{user!.firstName && user!.lastName ? `${user!.firstName} ${user!.lastName}` : user!.username}</h3>
                    <p className="text-sm text-gray-400">{user!.email}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                      authUtils.getRoleColor(user!.role)
                    }`}>
                      {authUtils.getRoleDisplayName(user!.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setShowUserProfile(true);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Moj profil</span>
                </button>

                <button
                  onClick={() => {
                    // Navigate to settings
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Podešavanja</span>
                </button>

                {authUtils.isModerator(user) && (
                  <button
                    onClick={() => {
                      // Navigate to admin
                      window.location.href = '/admin';
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin panel</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    // Navigate to watchlist
                    window.location.href = '/watchlist';
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Praćenje</span>
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-700 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Odjavite se</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </>
  );
}
