'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log fatal error to Sentry
    Sentry.captureException(error, {
      level: 'fatal',
      tags: {
        error_boundary: 'global',
      },
    });
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="sr">
      <head>
        <title>MMA Balkan - Greška</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(to bottom right, #111827, #0f172a)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          padding: '24px',
        }}>
          <div style={{
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
          }}>
            {/* Error Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertTriangle size={32} color="#ef4444" />
            </div>

            {/* Error Message */}
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
            }}>
              Kritična greška
            </h1>
            
            <p style={{
              color: '#d1d5db',
              marginBottom: '24px',
              lineHeight: '1.5',
            }}>
              Došlo je do ozbiljne greške u aplikaciji. Molimo vas da osvežite stranicu ili se vratite kasnije.
            </p>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{
                marginBottom: '24px',
                padding: '16px',
                background: 'rgba(31, 41, 55, 0.8)',
                borderRadius: '8px',
                textAlign: 'left',
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f87171',
                  marginBottom: '8px',
                }}>
                  Error Details:
                </h3>
                <pre style={{
                  fontSize: '12px',
                  color: '#d1d5db',
                  overflow: 'auto',
                  maxHeight: '128px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                }}>
                  {error.message}
                </pre>
                {error.digest && (
                  <p style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginTop: '8px',
                    margin: 0,
                  }}>
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={reset}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: 'linear-gradient(to right, #10b981, #3b82f6)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <RefreshCw size={16} />
              Pokušaj ponovo
            </button>

            {/* Support Info */}
            <div style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: 0,
              }}>
                Ako se problem nastavi, kontaktirajte nas na{' '}
                <a 
                  href="mailto:support@mmabalkan.com" 
                  style={{
                    color: '#10b981',
                    textDecoration: 'none',
                  }}
                >
                  support@mmabalkan.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

