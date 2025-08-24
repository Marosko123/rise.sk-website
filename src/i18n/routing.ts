import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['sk'],

  // Used when no locale matches
  defaultLocale: 'sk',
  
  // Never show locale prefix
  localePrefix: 'never',

  // Localized pathnames
  pathnames: {
    '/': '/',
    '/vyvoj': '/vyvoj',
    '/sluzby': '/sluzby', 
    '/portfolio': '/portfolio',
    '/kontakt': '/kontakt'
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
