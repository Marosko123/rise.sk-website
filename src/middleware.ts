import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Simple in-memory rate limiter with lazy cleanup
// Note: On Edge runtime, this Map is per-instance and won't persist across requests
// For production, consider using Vercel KV or similar
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

  return intlMiddleware(request);
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
    '/((?!api|_next|_vercel|optimized|images|rise|public|.*\\.(?:ico|png|jpg|jpeg|gif|webp|avif|svg|css|js|woff|woff2|ttf|eot|json|xml|txt|webmanifest)).*)'
  ]
};
