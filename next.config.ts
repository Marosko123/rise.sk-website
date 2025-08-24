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
