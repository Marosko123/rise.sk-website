import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import GoogleAnalytics from '@/components/GoogleAnalytics';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import WebVitalsReporter from '@/components/WebVitalsReporter';
import SEOHead from '@/components/SEOHead';

import './globals.css';

export const metadata: Metadata = {
  title: 'Rise.sk - Expert Programming Teams | Custom Software Development Slovakia',
  description: 'Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps. Quick delivery, reliable code, 100% on-time projects.',
  alternates: {
    languages: {
      'sk': 'https://rise.sk',
      'en': 'https://rise.sk/en',
    }
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
        {children}
        <ServiceWorkerRegistration />
        <WebVitalsReporter />
      </body>
    </html>
  );
}
