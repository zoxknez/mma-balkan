'use client';

import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth, authUtils } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ProfileTab } from './profile/ProfileTab';
import { SettingsTab } from './profile/SettingsTab';
import { SecurityTab } from './profile/SecurityTab';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Podešavanja', icon: Settings },
    { id: 'security', label: 'Bezbednost', icon: Shield },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Korisnički Profil"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 pb-6 border-b border-gray-700">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            {authUtils.getInitials(user)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}</h3>
            <p className="text-gray-400">{user.email}</p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              authUtils.getRoleColor(user.role)
            }`}>
              {authUtils.getRoleDisplayName(user.role)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'settings' | 'security')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'profile' && (
            <ProfileTab 
              user={user} 
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              user={user}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab 
              user={user}
              showChangePassword={showChangePassword}
              setShowChangePassword={setShowChangePassword}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <Button
            variant="ghost"
            onClick={logout}
            className="text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Odjavite se
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Zatvori
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
