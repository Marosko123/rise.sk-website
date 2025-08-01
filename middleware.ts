import createMiddleware from 'next-intl/middleware';

import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Note: Root path serves Slovak (default), /en serves English
  matcher: ['/', '/(en|sk|cs|de|es|hu|fr)/:path*'],
};
