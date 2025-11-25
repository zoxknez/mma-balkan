'use client';

import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { authUtils } from '@/lib/auth';

interface ProfileTabProps {
  user: { 
    username: string; 
    firstName?: string; 
    lastName?: string; 
    email: string; 
    role: string; 
    joinedAt: string | Date 
  };
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isLoading: boolean;
}

export function ProfileTab({ 
  user, 
  isEditing, 
  setIsEditing, 
  isLoading 
}: ProfileTabProps) {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: user.username,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email
  });

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">Osnovne informacije</h4>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Uredi
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              <X className="w-4 h-4 mr-2" />
              Otkaži
            </Button>
            <Button
              variant="neon-gradient"
              size="sm"
              onClick={handleSave}
              loading={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Sačuvaj
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Korisničko ime
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
              disabled={isLoading}
            />
          ) : (
            <p className="text-white">{user.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
              disabled={isLoading}
            />
          ) : (
            <p className="text-white">{user.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ime
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
              disabled={isLoading}
            />
          ) : (
            <p className="text-white">{user.firstName || '-'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Prezime
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
              disabled={isLoading}
            />
          ) : (
            <p className="text-white">{user.lastName || '-'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Uloga
          </label>
          <p className={`${authUtils.getRoleColor(user.role)}`}>
            {authUtils.getRoleDisplayName(user.role)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Datum registracije
          </label>
          <p className="text-white">
            {new Date(user.joinedAt).toLocaleDateString('sr-RS')}
          </p>
        </div>
      </div>
    </div>
  );
}
