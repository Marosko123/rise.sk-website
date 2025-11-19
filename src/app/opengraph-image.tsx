import { ImageResponse } from 'next/og';
import { join } from 'path';
import { readFileSync } from 'fs';

export const runtime = 'nodejs';

export const alt = 'Rise.sk - Expert Programming Teams';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // Load the logo
  const logoPath = join(process.cwd(), 'public/rise/gradient/Rise_logo_text_rectangle.png');
  const logoData = readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
        }}
      >
        {/* Logo */}
        <img
          src={logoBase64}
          alt="Rise.sk"
          style={{
            width: '900px',
            objectFit: 'contain',
          }}
        />
        
        {/* Tagline */}
        <div
          style={{
            marginTop: '20px',
            fontSize: 32,
            color: '#888888',
            fontFamily: 'sans-serif',
            fontWeight: 500,
            letterSpacing: '1px',
          }}
        >
          Expert Programming Teams & Custom Software Development
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
