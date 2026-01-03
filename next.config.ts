import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  images: {
    // Prefer AVIF for better compression, reduce variants
    formats: ['image/avif', 'image/webp'],
    // Reduced device sizes to minimize Image Optimization transformations
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256],
    // Extended cache TTL for images
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
  async redirects() {
    return [
      // Old WordPress redirects
      {
        source: '/product-tag/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-category/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tag/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/author/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/kurzy/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/kosik',
        destination: '/',
        permanent: true,
      },
      {
        source: '/category/:path*',
        destination: '/blog',
        permanent: true,
      },
      // Specific old pages
      {
        source: '/education',
        destination: '/',
        permanent: true,
      },
      {
        source: '/sk/education',
        destination: '/',
        permanent: true,
      },
    ];
  },
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
      // Static assets - aggressive caching
      {
        source: '/optimized/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/rise/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Pages - CDN caching with stale-while-revalidate
      {
        source: '/((?!api|_next|_vercel|keystatic).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400'
          }
        ]
      }
    ];
  },
};

export default withNextIntl(nextConfig);
