'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface SecurityTabProps {
  user: { lastLogin?: Date };
  showChangePassword: boolean;
  setShowChangePassword: (show: boolean) => void;
  isLoading: boolean;
}

export function SecurityTab({ 
  user, 
  showChangePassword, 
  setShowChangePassword, 
  isLoading 
}: SecurityTabProps) {
  const { changePassword } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Lozinke se ne poklapaju');
      return;
    }

    const success = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    if (success) {
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordError('');
    } else {
      setPasswordError('Greška pri promeni lozinke');
    }
  };

  if (showChangePassword) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">Promena lozinke</h4>
          <button
            onClick={() => setShowChangePassword(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Trenutna lozinka
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nova lozinka
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Potvrdite novu lozinku
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
              disabled={isLoading}
              required
            />
          </div>

          {passwordError && (
            <p className="text-red-400 text-sm">{passwordError}</p>
          )}

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowChangePassword(false)}
              className="flex-1"
            >
              Otkaži
            </Button>
            <Button
              type="submit"
              variant="neon-gradient"
              className="flex-1"
              loading={isLoading}
            >
              Sačuvaj
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-white">Bezbednost</h4>

      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h5 className="font-medium text-white mb-2">Lozinka</h5>
          <p className="text-gray-400 text-sm mb-3">
            Poslednja prijava: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('sr-RS') : 'Nikad'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChangePassword(true)}
          >
            Promeni lozinku
          </Button>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h5 className="font-medium text-white mb-2">Dvofaktorska autentifikacija</h5>
          <p className="text-gray-400 text-sm mb-3">
            Dodajte dodatni sloj bezbednosti vašem nalogu
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled
          >
            Uskoro dostupno
          </Button>
        </div>
      </div>
    </div>
  );
}
