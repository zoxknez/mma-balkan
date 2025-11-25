'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth, authUtils } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister, onForgotPassword }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear auth error
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors['email'] = 'Email je obavezan';
    } else if (!authUtils.validateEmail(formData.email)) {
      errors['email'] = 'Email nije validan';
    }

    if (!formData.password) {
      errors['password'] = 'Lozinka je obavezna';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await login(formData);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          >
            <Lock className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Dobrodošli nazad</h2>
          <p className="text-gray-400">Prijavite se na svoj nalog</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email adresa
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-colors ${
                  validationErrors['email'] ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="unesite@email.com"
                disabled={isLoading}
              />
            </div>
            {validationErrors['email'] && (
              <p className="mt-1 text-sm text-red-400">{validationErrors['email']}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Lozinka
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-colors ${
                  validationErrors['password'] ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Unesite lozinku"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {validationErrors['password'] && (
              <p className="mt-1 text-sm text-red-400">{validationErrors['password']}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 bg-gray-900 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-gray-300">Zapamti me</span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
              disabled={isLoading}
            >
              Zaboravili ste lozinku?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="neon-gradient"
            size="lg"
            className="w-full"
            loading={isLoading}
          >
            Prijavite se
          </Button>
        </form>

        {/* Switch to Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Nemate nalog?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
              disabled={isLoading}
            >
              Registrujte se
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
