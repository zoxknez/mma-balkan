'use client';

import React, { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { NotificationSettings, Theme, Language, Script } from '@/lib/types';

interface SettingsTabProps {
  user: { 
    preferences?: { 
      theme: Theme; 
      language: Language; 
      notifications: NotificationSettings; 
      script: Script 
    } 
  };
  isLoading: boolean;
}

export function SettingsTab({ user, isLoading }: SettingsTabProps) {
  const { updateProfile } = useAuth();
  const [preferences, setPreferences] = useState({
    theme: user.preferences?.theme || Theme.DARK,
    language: user.preferences?.language || Language.SERBIAN,
    notifications: user.preferences?.notifications?.email ?? true
  });

  const handlePreferenceChange = async (key: string, value: string | boolean) => {
    let newPreferences;
    
    if (key === 'notifications') {
      newPreferences = {
        theme: preferences.theme,
        language: preferences.language,
        script: user.preferences?.script || Script.LATIN,
        notifications: {
          ...user.preferences?.notifications,
          email: value as boolean,
          push: value as boolean,
          fightResults: user.preferences?.notifications?.fightResults ?? true,
          upcomingFights: user.preferences?.notifications?.upcomingFights ?? true,
          fighterNews: user.preferences?.notifications?.fighterNews ?? true,
          weightIns: user.preferences?.notifications?.weightIns ?? true,
          predictions: user.preferences?.notifications?.predictions ?? true,
        }
      };
      setPreferences(prev => ({ ...prev, notifications: value as boolean }));
    } else {
      newPreferences = {
        theme: key === 'theme' ? (value as Theme) : preferences.theme,
        language: key === 'language' ? (value as Language) : preferences.language,
        script: user.preferences?.script || Script.LATIN,
        notifications: user.preferences?.notifications || {
          email: true,
          push: true,
          fightResults: true,
          upcomingFights: true,
          fighterNews: true,
          weightIns: true,
          predictions: true
        }
      };
      setPreferences(prev => ({ ...prev, [key]: value }));
    }
    
    await updateProfile({
      preferences: newPreferences
    });
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-white">Podešavanja</h4>

      <div className="space-y-6">
        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Tema
          </label>
          <div className="flex space-x-2">
            {[
              { value: Theme.LIGHT, label: 'Svetla', icon: Sun },
              { value: Theme.DARK, label: 'Tamna', icon: Moon },
              { value: Theme.ULTRA_PREMIUM, label: 'Premium', icon: Monitor }
            ].map((theme) => (
              <button
                key={theme.value}
                onClick={() => handlePreferenceChange('theme', theme.value)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                  preferences.theme === theme.value
                    ? 'border-green-400 bg-green-400/10 text-green-400'
                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
                disabled={isLoading}
              >
                <theme.icon className="w-4 h-4" />
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Jezik
          </label>
          <select
            value={preferences.language}
            onChange={(e) => handlePreferenceChange('language', e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400"
            disabled={isLoading}
          >
            <option value={Language.SERBIAN}>Srpski</option>
            <option value={Language.ENGLISH}>English</option>
            <option value={Language.CROATIAN}>Hrvatski</option>
            <option value={Language.BOSNIAN}>Bosanski</option>
          </select>
        </div>

        {/* Notifications */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-900 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
              disabled={isLoading}
            />
            <span className="text-gray-300">Primaj notifikacije</span>
          </label>
        </div>
      </div>
    </div>
  );
}
