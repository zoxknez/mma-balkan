'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth, authUtils } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<{ isValid: boolean; score: number; feedback: string[] }>({ isValid: false, score: 0, feedback: [] });

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

    // Check password strength
    if (name === 'password') {
      const strength = authUtils.validatePassword(value);
      setPasswordStrength(strength);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors['username'] = 'Korisničko ime je obavezno';
    } else if (formData.username.trim().length < 2) {
      errors['username'] = 'Korisničko ime mora imati najmanje 2 karaktera';
    }

    if (!formData.email) {
      errors['email'] = 'Email je obavezan';
    } else if (!authUtils.validateEmail(formData.email)) {
      errors['email'] = 'Email nije validan';
    }

    if (!formData.password) {
      errors['password'] = 'Lozinka je obavezna';
    } else if (!passwordStrength.isValid) {
      errors['password'] = 'Lozinka nije dovoljno jaka';
    }

    if (!formData.confirmPassword) {
      errors['confirmPassword'] = 'Potvrda lozinke je obavezna';
    } else if (formData.password !== formData.confirmPassword) {
      errors['confirmPassword'] = 'Lozinke se ne poklapaju';
    }

    if (!formData.acceptTerms) {
      errors['acceptTerms'] = 'Morate prihvatiti uslove korišćenja';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await register(formData);
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
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Kreirajte nalog</h2>
          <p className="text-gray-400">Pridružite se MMA Balkan zajednici</p>
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
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Korisničko ime
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-colors ${
                  validationErrors['username'] ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Unesite korisničko ime"
                disabled={isLoading}
              />
            </div>
            {validationErrors['username'] && (
              <p className="mt-1 text-sm text-red-400">{validationErrors['username']}</p>
            )}
          </div>

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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score < 2 ? 'bg-red-500' :
                        passwordStrength.score < 4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    authUtils.getPasswordStrengthColor(passwordStrength.score)
                  }`}>
                    {authUtils.getPasswordStrengthText(passwordStrength.score)}
                  </span>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs text-gray-400 space-y-1">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <span className="text-red-400">•</span>
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {validationErrors['password'] && (
              <p className="mt-1 text-sm text-red-400">{validationErrors['password']}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Potvrdite lozinku
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-colors ${
                  validationErrors['confirmPassword'] ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Potvrdite lozinku"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {validationErrors['confirmPassword'] && (
              <p className="mt-1 text-sm text-red-400">{validationErrors['confirmPassword']}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className={`w-4 h-4 text-green-600 bg-gray-900 border-gray-600 rounded focus:ring-green-500 focus:ring-2 mt-1 ${
                  validationErrors['acceptTerms'] ? 'border-red-500' : ''
                }`}
                disabled={isLoading}
              />
              <span className="text-sm text-gray-300">
                Prihvatam{' '}
                <a href="/terms" className="text-green-400 hover:text-green-300 underline">
                  uslove korišćenja
                </a>{' '}
                i{' '}
                <a href="/privacy" className="text-green-400 hover:text-green-300 underline">
                  politiku privatnosti
                </a>
              </span>
            </label>
            {validationErrors['acceptTerms'] && (
              <p className="mt-1 text-sm text-red-400">{validationErrors['acceptTerms']}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="neon-gradient"
            size="lg"
            className="w-full"
            loading={isLoading}
          >
            Kreirajte nalog
          </Button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Već imate nalog?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
              disabled={isLoading}
            >
              Prijavite se
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
