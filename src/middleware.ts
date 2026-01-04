import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Simple in-memory rate limiter with lazy cleanup
// On Hetzner (single server/container), this Map persists and works reliably
// Cloudflare Free tier provides additional DDoS protection at CDN level
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 150; // 150 requests per minute
const MAX_MAP_SIZE = 10000; // Prevent unbounded growth
const ipMap = new Map<string, { count: number; resetTime: number }>();

// Lazy cleanup - runs on each request but only cleans if map is large
function cleanupOldEntries() {
  if (ipMap.size < MAX_MAP_SIZE / 2) return;

  const now = Date.now();
  for (const [ip, data] of ipMap.entries()) {
    if (now > data.resetTime) {
      ipMap.delete(ip);
    }
  }
}

function checkRateLimit(ip: string): boolean {
  // Lazy cleanup to prevent memory issues
  cleanupOldEntries();

  const now = Date.now();
  const record = ipMap.get(ip);

  if (!record || now > record.resetTime) {
    ipMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  return true;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate Limiting (Skip for static files and API routes often called by internals, but matcher handles most)
  // We identify user by IP - prioritize Cloudflare header, then x-forwarded-for, then request.ip
  const ip = request.headers.get('cf-connecting-ip') ||
             request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             (request as any).ip ||
             '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
      },
    });
  }

  // Protect /keystatic route with Basic Auth
  if (pathname.startsWith('/keystatic')) {
    // Only enforce in production or if env vars are set
    const user = process.env.KEYSTATIC_USER;
    const pwd = process.env.KEYSTATIC_PASSWORD;

    if (user && pwd) {
      const basicAuth = request.headers.get('authorization');

      if (basicAuth) {
        try {
          const authValue = basicAuth.split(' ')[1];
          if (authValue) {
            const decoded = atob(authValue);
            const colonIndex = decoded.indexOf(':');

            if (colonIndex > 0) {
              const u = decoded.substring(0, colonIndex);
              const p = decoded.substring(colonIndex + 1);

              // Constant-time comparison to prevent timing attacks
              if (u.length === user.length && p.length === pwd.length) {
                let userMatch = true;
                let pwdMatch = true;

                for (let i = 0; i < u.length; i++) {
                  if (u[i] !== user[i]) userMatch = false;
                }
                for (let i = 0; i < p.length; i++) {
                  if (p[i] !== pwd[i]) pwdMatch = false;
                }

                if (userMatch && pwdMatch) {
                  return NextResponse.next();
                }
              }
            }
          }
        } catch {
          // Invalid base64 encoding - fall through to 401
        }
      }

      return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Keystatic Admin"',
        },
      });
    }

    // If no env vars set, allow access (or block? allowing for now to not break dev)
    return NextResponse.next();
  }

  // CSP Nonce generation
  const nonce = crypto.randomUUID();
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://rise.sk https://www.rise.sk;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.googletagmanager.com https://*.google-analytics.com https://cdn.jsdelivr.net https://www.vectorlogo.zone https://upload.wikimedia.org https://images.unsplash.com https://plus.unsplash.com https://rise.sk https://www.rise.sk;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.emailjs.com https://lottie.host https://*.lottiefiles.com https://rise.sk https://www.rise.sk;
    frame-src 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  // Set the nonce in the request headers so it's available to Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Clone request with new headers
  const response = intlMiddleware(request);

  // Set CSP header on the response
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-nonce', nonce); // Optional: if client needs it

  return response;
}

export const config = {
  // Optimized matcher - exclude static files, images, and assets
  // to reduce Edge Requests and Fast Origin Transfer
  matcher: [
    // Only run middleware on pages that need locale handling
    '/(sk|en)',
    '/(sk|en)/:path*',
    // Root path for locale detection
    '/',
    // Keystatic admin
    '/keystatic/:path*',
    // Exclude: api, _next, _vercel, static files, images
    '/((?!api|_next|_vercel|optimized|images|rise|public|manifest.json|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|avif|svg|css|js|woff|woff2|ttf|eot|json|xml|txt|webmanifest)).*)'
  ]
};
