import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'sk', 'cs', 'de', 'es', 'hu', 'fr'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Localized pathnames
  pathnames: {
    '/': '/',
    '/development': {
      en: '/development',
      sk: '/vyvoj',
      cs: '/vyvoj',
      de: '/entwicklung',
      es: '/desarrollo',
      hu: '/fejlesztes',
      fr: '/developpement'
    },
    '/services': {
      en: '/services',
      sk: '/sluzby',
      cs: '/sluzby',
      de: '/dienstleistungen',
      es: '/servicios',
      hu: '/szolgaltatasok',
      fr: '/services'
    },
    '/portfolio': {
      en: '/portfolio',
      sk: '/portfolio',
      cs: '/portfolio',
      de: '/portfolio',
      es: '/portafolio',
      hu: '/portfolio',
      fr: '/portfolio'
    },
    '/contact': {
      en: '/contact',
      sk: '/kontakt',
      cs: '/kontakt',
      de: '/kontakt',
      es: '/contacto',
      hu: '/kapcsolat',
      fr: '/contact'
    }
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
