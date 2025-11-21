import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /keystatic route with Basic Auth
  if (pathname.startsWith('/keystatic')) {
    // Only enforce in production or if env vars are set
    const user = process.env.KEYSTATIC_USER;
    const pwd = process.env.KEYSTATIC_PASSWORD;

    if (user && pwd) {
      const basicAuth = request.headers.get('authorization');

      if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        const [u, p] = atob(authValue).split(':');

        if (u === user && p === pwd) {
          return NextResponse.next();
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
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next`, `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // Removed 'keystatic' from exclusion so middleware runs for it
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
