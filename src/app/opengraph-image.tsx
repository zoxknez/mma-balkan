import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'MMA Balkan - MMA portal za region';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #111827 0%, #0f172a 100%)',
          position: 'relative',
        }}
      >
        {/* Grid pattern background */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage:
              'linear-gradient(rgba(0,255,136,0.03) 2px, transparent 2px), linear-gradient(90deg, rgba(0,255,136,0.03) 2px, transparent 2px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Lightning Bolt */}
          <div
            style={{
              fontSize: 120,
              marginBottom: 20,
              filter: 'drop-shadow(0 0 30px rgba(0, 255, 136, 0.8))',
            }}
          >
            ⚡
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.05em',
              }}
            >
              MMA
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '0.1em',
              }}
            >
              BALKAN
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              marginTop: 30,
              fontSize: 28,
              color: '#d1d5db',
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            MMA portal za region
          </div>
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            background: 'rgba(16, 185, 129, 0.1)',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 12,
            padding: '16px 32px',
            fontSize: 20,
            color: '#10b981',
            fontWeight: 600,
          }}
        >
          Borci • Događaji • Vesti
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

