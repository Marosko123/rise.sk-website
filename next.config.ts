import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.vercel-scripts.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: *.googletagmanager.com *.google-analytics.com; font-src 'self' data: fonts.gstatic.com; connect-src 'self' *.google-analytics.com *.analytics.google.com *.googletagmanager.com vitals.vercel-analytics.com *.emailjs.com;"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      // Redirect /sk/* to /* (remove Slovak prefix) - only for specific paths to avoid loops
      {
        source: '/sk/vyvoj',
        destination: '/vyvoj',
        permanent: true,
      },
      {
        source: '/sk/sluzby',
        destination: '/sluzby',
        permanent: true,
      },
      {
        source: '/sk/portfolio',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/sk/kontakt',
        destination: '/kontakt',
        permanent: true,
      },
      // Redirect English paths to Slovak for better SEO
      {
        source: '/development',
        destination: '/vyvoj',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/sluzby',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/kontakt',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
