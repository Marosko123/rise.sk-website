import { NextRequest, NextResponse } from 'next/server';

export default function middleware(_request: NextRequest) {
  // Simple middleware - no locale prefixes, just serve pages directly
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
