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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'www.vectorlogo.zone',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  // REMOVED REDIRECT TO PREVENT LOOP WITH VERCEL
  // Vercel is currently configured to redirect rise.sk -> www.rise.sk
  // Our code was redirecting www.rise.sk -> rise.sk
  // This caused an infinite loop.
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*',
  //       has: [{ type: 'host', value: 'www.rise.sk' }],
  //       destination: 'https://rise.sk/:path*',
  //       permanent: true,
  //     },
  //   ];
  // },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
        ],
      },
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
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googletagmanager.com https://*.google-analytics.com https://*.vercel-scripts.com https://vercel.live https://rise.sk https://www.rise.sk; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live; img-src 'self' blob: data: https://*.googletagmanager.com https://*.google-analytics.com https://cdn.jsdelivr.net https://www.vectorlogo.zone https://upload.wikimedia.org https://images.unsplash.com https://plus.unsplash.com https://vercel.live https://rise.sk https://www.rise.sk; font-src 'self' data: https://fonts.gstatic.com https://vercel.live; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://vitals.vercel-analytics.com https://*.emailjs.com https://lottie.host https://*.lottiefiles.com https://vercel.live https://rise.sk https://www.rise.sk; frame-src 'self' https://vercel.live;"
          },
          {
            key: 'Vary',
            value: 'Accept-Language, Cookie'
          }
        ]
      },
      {
        source: '/((?!_next|static|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
          }
        ]
      }
    ];
  },
};

export default withNextIntl(nextConfig);
