import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { type ReactNode } from 'react';

import EnhancedSchema from '@/components/EnhancedSchema';
import GDPRConsent from '@/components/GDPRConsent';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import ThemeProvider from '@/components/ThemeProvider';
import WebVitalsReporter from '@/components/WebVitalsReporter';
import { companyConfig } from '@/config/company';

import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#b09155',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rise.sk'),
  title: 'Rise.sk - Expert Programming Teams | Custom Software Development Slovakia',
  description: 'Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps. Quick delivery, reliable code, 100% on-time projects.',
  applicationName: 'Rise.sk',
  authors: [{ name: 'Rise.sk s.r.o.' }],
  generator: 'Next.js',
  keywords: ['software development', 'web development', 'mobile apps', 'Slovakia', 'programming teams', 'outsourcing', 'IT consulting'],
  referrer: 'origin-when-cross-origin',
  creator: 'Rise.sk s.r.o.',
  publisher: 'Rise.sk s.r.o.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://rise.sk',
    languages: {
      'sk': 'https://rise.sk',
      'en': 'https://rise.sk/en',
      'x-default': 'https://rise.sk',
    }
  },
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    alternateLocale: 'en_US',
    url: 'https://rise.sk',
    siteName: 'Rise.sk',
    title: 'Rise.sk - Expert Programming Teams',
    description: 'Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps.',
    images: [
      {
        url: companyConfig.website.logo.circle,
        width: 1200,
        height: 1200,
        alt: 'Rise.sk Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rise_sk',
    creator: '@rise_sk',
    title: 'Rise.sk - Expert Programming Teams | Custom Software Development Slovakia',
    description: 'Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps. Quick delivery, reliable code, 100% on-time projects.',
    images: [companyConfig.website.logo.circle],
  },
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    'geo.region': 'SK',
    'geo.placename': 'Bratislava',
    'business:contact_data:locality': 'Bratislava',
    'business:contact_data:region': 'Bratislava Region',
    'business:contact_data:postal_code': '831 06',
    'business:contact_data:country_name': 'Slovakia',
  }
};

type Props = {
  children: ReactNode;
};

// Root layout for all pages
export default function RootLayout({ children }: Props) {
  return (
    <html lang="sk">
      <head>
        <GoogleAnalytics />
        <EnhancedSchema type="Organization" />
        <EnhancedSchema type="LocalBusiness" />
        <EnhancedSchema type="WebSite" />
        <EnhancedSchema type="Service" data={{
          name: "Web Development Services",
          description: "Professional web development and design services in Slovakia",
          serviceType: "Custom Software Development"
        }} />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <ServiceWorkerRegistration />
          <WebVitalsReporter />
          <GDPRConsent />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
