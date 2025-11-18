import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { type ReactNode } from 'react';

import GDPRConsent from '@/components/GDPRConsent';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SEOHead from '@/components/SEOHead';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import ThemeProvider from '@/components/ThemeProvider';
import WebVitalsReporter from '@/components/WebVitalsReporter';
import { companyConfig } from '@/config/company';

import './globals.css';

export const metadata: Metadata = {
  title: 'Rise.sk - Expert Programming Teams | Custom Software Development Slovakia',
  description: 'Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps. Quick delivery, reliable code, 100% on-time projects.',
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
    languages: {
      'sk': 'https://rise.sk',
      'en': 'https://rise.sk/en',
    }
  },
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
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
    card: 'summary',
    title: 'Rise.sk - Expert Programming Teams',
    description: 'Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps.',
    images: [companyConfig.website.logo.circle],
  },
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
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
        <SEOHead />
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
