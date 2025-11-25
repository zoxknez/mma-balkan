import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'MMA Borac - MMA Balkan';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  const id = params.id;
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3003';

  try {
    // Fetch fighter data
    const res = await fetch(`${apiUrl}/api/fighters/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Fighter not found');
    }

    const { data: fighter } = await res.json();
    const record = `${fighter.wins}-${fighter.losses}-${fighter.draws}`;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #111827 0%, #0f172a 100%)',
            position: 'relative',
          }}
        >
          {/* Fighter Info Side */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px',
              width: '60%',
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 8,
                padding: '8px 20px',
                fontSize: 16,
                color: '#10b981',
                fontWeight: 600,
                marginBottom: 20,
                width: 'fit-content',
              }}
            >
              MMA BORAC
            </div>

            {/* Name */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              {fighter.name}
            </div>

            {/* Nickname */}
            {fighter.nickname && (
              <div
                style={{
                  fontSize: 32,
                  color: '#10b981',
                  marginBottom: 24,
                }}
              >
                &quot;{fighter.nickname}&quot;
              </div>
            )}

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                gap: 40,
                marginTop: 20,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#10b981' }}>
                  {record}
                </div>
                <div style={{ fontSize: 18, color: '#9ca3af' }}>Rekord</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#3b82f6' }}>
                  {fighter.weightClass}
                </div>
                <div style={{ fontSize: 18, color: '#9ca3af' }}>Kategorija</div>
              </div>
            </div>

            {/* Country */}
            <div
              style={{
                marginTop: 30,
                fontSize: 24,
                color: '#d1d5db',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 32 }}>🏴</span>
              {fighter.country}
            </div>
          </div>

          {/* Logo Side */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40%',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 100 }}>⚡</div>
            <div
              style={{
                fontSize: 28,
                color: '#6b7280',
                marginTop: 20,
              }}
            >
              MMA BALKAN
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch {
    // Fallback OG image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #111827, #0f172a)',
          }}
        >
          <div style={{ fontSize: 80, color: '#10b981' }}>
            MMA Borac
          </div>
        </div>
      ),
      { ...size }
    );
  }
}

