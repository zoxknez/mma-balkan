'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Modal } from '@/components/ui/modal';
import { useAuth } from '@/lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login', onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    setMode(defaultMode);
    setShowForgotPassword(false);
  }, [defaultMode]);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setShowForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="md"
      className="!p-0"
    >
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <AnimatePresence mode="wait">
          {showForgotPassword ? (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ForgotPasswordForm
                onBack={handleBackToLogin}
                onSuccess={handleSuccess}
              />
            </motion.div>
          ) : mode === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <LoginForm
                onSuccess={handleSuccess}
                onSwitchToRegister={() => handleSwitchMode('register')}
                onForgotPassword={handleForgotPassword}
              />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterForm
                onSuccess={handleSuccess}
                onSwitchToLogin={() => handleSwitchMode('login')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}

// Forgot Password Form Component
function ForgotPasswordForm({ onBack }: { onBack: () => void; onSuccess?: () => void }) {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setValidationError('Email je obavezan');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Email nije validan');
      return;
    }

    setValidationError('');
    clearError();

    const success = await resetPassword(email);
    if (success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-green-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        >
          <X className="w-8 h-8 text-green-400 rotate-45" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Email poslat</h2>
        <p className="text-gray-400 mb-6">
          Poslali smo vam link za resetovanje lozinke na {email}
        </p>
        <button
          onClick={onBack}
          className="text-green-400 hover:text-green-300 font-medium transition-colors"
        >
          Nazad na prijavu
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Zaboravili ste lozinku?</h2>
        <p className="text-gray-400">
          Unesite vaš email i poslaćemo vam link za resetovanje lozinke
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
        >
          <span className="text-red-400 text-sm">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email adresa
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationError) setValidationError('');
              if (error) clearError();
            }}
            className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-colors ${
              validationError ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="unesite@email.com"
            disabled={isLoading}
          />
          {validationError && (
            <p className="mt-1 text-sm text-red-400">{validationError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
        >
          {isLoading ? 'Slanje...' : 'Pošaljite link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          Nazad na prijavu
        </button>
      </div>
    </div>
  );
}
