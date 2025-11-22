import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['sk', 'en'],

  // Used when no locale matches
  defaultLocale: 'sk',

  // Use "as-needed" to hide the locale prefix for the default locale (sk)
  localePrefix: 'as-needed',

  // Disable automatic locale detection based on Accept-Language header
  localeDetection: false,

  // Localized pathnames
  pathnames: {
    '/': '/',
    '/vyvoj': {
      sk: '/vyvoj',
      en: '/development'
    },
    '/sluzby': {
      sk: '/sluzby',
      en: '/services'
    },
    '/portfolio': {
      sk: '/portfolio',
      en: '/portfolio'
    },
    '/kontakt': {
      sk: '/kontakt',
      en: '/contact'
    },
    '/sluzby/tvorba-web-stranok': {
      sk: '/sluzby/tvorba-web-stranok',
      en: '/services/web-development'
    },
    '/sluzby/tvorba-eshopu': {
      sk: '/sluzby/tvorba-eshopu',
      en: '/services/ecommerce-development'
    },
    '/sluzby/vyvoj-mobilnych-aplikacii': {
      sk: '/sluzby/vyvoj-mobilnych-aplikacii',
      en: '/services/mobile-app-development'
    },
    '/sluzby/softver-na-mieru': {
      sk: '/sluzby/softver-na-mieru',
      en: '/services/custom-software-development'
    },
    '/sluzby/ai-automatizacia': {
      sk: '/sluzby/ai-automatizacia',
      en: '/services/ai-automation'
    },
    '/sluzby/it-outsourcing': {
      sk: '/sluzby/it-outsourcing',
      en: '/services/it-outsourcing'
    },
    '/blog': {
      sk: '/blog',
      en: '/blog'
    },
    '/team': {
      sk: '/tim',
      en: '/team'
    },
    '/kariera': {
      sk: '/kariera',
      en: '/careers'
    },
    '/o-nas': {
      sk: '/o-nas',
      en: '/about'
    },
    '/recenzie': {
      sk: '/recenzie',
      en: '/reviews'
    }
  }
});

export type AppPathnames = keyof typeof routing.pathnames;

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
