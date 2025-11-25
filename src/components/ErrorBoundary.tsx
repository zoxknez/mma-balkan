'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { monitoring } from '@/lib/monitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Capture error with monitoring
    monitoring.errorBoundary.captureError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-850 to-black flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <div className="glass-card p-8 text-center relative overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5" />
              
              {/* Error Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 relative"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-20" />
                <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </motion.div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-white mb-4">
                Ups! Nešto je pošlo po zlu
              </h1>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Došlo je do neočekivane greške. Naš tim je obavešten i radi na rešavanju problema.
              </p>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-red-400 mb-2">Error Details:</h3>
                  <pre className="text-xs text-gray-300 overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-400 cursor-pointer">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-gray-300 mt-1 overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={this.handleRetry}
                  variant="neon"
                  className="w-full relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-20"
                    whileHover={{ opacity: 0.4 }}
                  />
                  <RefreshCw className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">Pokušaj ponovo</span>
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Vrati se na početnu
                </Button>
              </div>

              {/* Support Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  Ako se problem nastavi, kontaktirajte nas na{' '}
                  <a 
                    href="mailto:support@mmabalkan.com" 
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    support@mmabalkan.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error reporting
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: string) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: { errorInfo } });
    }
  };

  return { handleError };
}
