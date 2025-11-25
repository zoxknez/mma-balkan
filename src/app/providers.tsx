'use client';

import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import { swrConfig } from '@/lib/swr-config';
import { ErrorLogger } from '@/lib/errors';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Initialize error logging
if (typeof window !== 'undefined') {
  ErrorLogger.initialize();
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={swrConfig}>
      <AuthProvider>
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              // Default options for all toasts
              duration: 4000,
              style: {
                background: 'rgba(31, 41, 55, 0.95)',
                color: '#fff',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              },
              // Success toasts
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                },
              },
              // Error toasts
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                },
              },
              // Loading toasts
              loading: {
                duration: Infinity,
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: '#fff',
                },
                style: {
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                },
              },
            }}
          />
          {children}
        </AuthProvider>
    </SWRConfig>
  );
}