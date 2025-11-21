import { ImageResponse } from 'next/og';
import { getPostData, formatDate } from '@/utils/blog-server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export const alt = 'Rise.sk Blog Post';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Image({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostData(slug, locale);

  // Fallback if post not found
  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'black',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Rise.sk
        </div>
      ),
      { ...size }
    );
  }

  // Load fonts/images
  // Note: In a real app, you might want to load a custom font here
  // For now we use system fonts or standard sans-serif
  
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
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(circle at top right, #1a1a1a 0%, #000000 100%)',
          padding: '60px 80px',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <img
            src={logoBase64}
            alt="Rise.sk"
            style={{
              height: '60px',
              objectFit: 'contain',
            }}
          />
          <div style={{ 
            color: '#b09155', 
            fontSize: 24, 
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Blog
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {post.tags.slice(0, 3).map((tag) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: 'rgba(176, 145, 85, 0.1)',
                    border: '1px solid rgba(176, 145, 85, 0.3)',
                    color: '#b09155',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              maxWidth: '90%',
            }}
          >
            {post.title}
          </div>

          {/* Excerpt (optional, truncated) */}
          <div
            style={{
              fontSize: 28,
              color: '#888888',
              lineHeight: 1.4,
              maxWidth: '80%',
              marginTop: '10px',
            }}
          >
            {post.excerpt?.slice(0, 120)}{post.excerpt?.length > 120 ? '...' : ''}
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '30px',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Author Avatar Placeholder */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#b09155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'black',
              fontWeight: 'bold',
              fontSize: 24,
            }}>
              {post.author?.name ? post.author.name.charAt(0) : 'R'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>
                {post.author?.name || 'Rise.sk Team'}
              </span>
              <span style={{ color: '#666', fontSize: 16 }}>
                {formatDate(post.date, locale, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div style={{ color: '#b09155', fontSize: 20, fontWeight: 600 }}>
            rise.sk
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
