import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Fix for "TypeError: localStorage.getItem is not a function" in development
// Some dependency or tool injects a broken localStorage implementation (empty object) into the global scope on the server.
// This breaks SSR rendering because it bypasses "if (typeof localStorage !== 'undefined')" checks but fails on method calls.
if (
  typeof global !== 'undefined' &&
  (global as any).localStorage &&
  typeof (global as any).localStorage.getItem !== 'function'
) {
  // Remove the broken polyfill so that standard specific window checks work correctly
  delete (global as any).localStorage;
}

const nextConfig: NextConfig = {
  // Enable source maps for production to resolve Lighthouse "Missing source maps" warning
  productionBrowserSourceMaps: true,

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
    // Optimize package imports for tree-shaking
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Transpile only what's necessary for modern browsers
  transpilePackages: [],
  compress: process.env.NODE_ENV === 'production',
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
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
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
      // Manifest - Aggressive caching
      {
        source: '/manifest.json',
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
  webpack: (config, { webpack, isServer }) => {
    config.output.environment = {
      ...config.output.environment,
      arrowFunction: true,
      asyncFunction: true,
      const: true,
      destructuring: true,
      dynamicImport: true,
      forOf: true,
      module: true,
      optionalChaining: true,
      templateLiteral: true,
    };

    if (!isServer) {
        config.resolve.alias['next/dist/build/polyfills/polyfill-module'] = false;
        config.resolve.alias['next/dist/build/polyfills/polyfill-module.js'] = false;
    }

    return config;
  },
};

export default withNextIntl(nextConfig);
