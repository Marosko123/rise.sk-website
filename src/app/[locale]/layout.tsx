import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import GoogleAnalytics from '@/components/GoogleAnalytics';
import LanguagePreferenceHandler from '@/components/LanguagePreferenceHandler';
import RiseIconRain from '@/components/RiseIconRain';
import { ScrollProgress } from '@/components/ScrollEffects';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import StructuredData from '@/components/StructuredData';
import WebVitalsReporter from '@/components/WebVitalsReporter';
import { routing } from '@/i18n/routing';
import '../globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Rise.sk - Expert Programming Teams | Custom Software Development Slovakia',
    template: '%s | Rise.sk - Professional IT Solutions'
  },
  description: 'Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps. Quick delivery, reliable code, 100% on-time projects. Get your development team in 7 days.',
  keywords: [
    // Primary keywords
    'programming teams Slovakia',
    'hire programmers Slovakia',
    'custom software development',
    'web development Slovakia',
    'mobile app development',
    'IT solutions Slovakia',

    // Secondary keywords
    'software development company',
    'programming services',
    'outsourcing development',
    'dedicated development teams',
    'full-stack developers',
    'React developers Slovakia',
    'Node.js developers',
    'Python developers',

    // Location-based
    'programmers Bratislava',
    'IT company Slovakia',
    'software development Bratislava',
    'tech company Slovakia',

    // Service-specific
    'quick software development',
    'reliable programming',
    'enterprise software solutions',
    'startup development',
    'MVP development',
    'e-commerce development',
    'API development',
    'database development'
  ].join(', '),
  authors: [{ name: 'Rise.sk Development Team' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/rise/logo-bronze-transparent.png',
    shortcut: '/rise/logo-bronze-transparent.png',
    apple: '/rise/logo-bronze-transparent.png',
  },
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    alternateLocale: ['en_US'],
    title: 'Rise.sk - Expert Programming Teams | Custom Software Development',
    description: 'Hire expert programming teams in Slovakia. Quick delivery, reliable code, 100% on-time projects. Get your development team in 7 days.',
    siteName: 'Rise.sk',
    url: 'https://rise.sk',
    images: [
      {
        url: '/rise/logo-circle-bronze-bg.png',
        width: 1200,
        height: 630,
        alt: 'Rise.sk - Professional Programming Teams',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rise.sk - Expert Programming Teams | Custom Software Development',
    description: 'Hire expert programming teams in Slovakia. Quick delivery, reliable code, 100% on-time projects.',
    images: ['/rise/logo-circle-bronze-bg.png'],
  },
  alternates: {
    canonical: 'https://rise.sk',
    languages: {
      'sk': 'https://rise.sk',
      'en': 'https://rise.sk/en',
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'google-site-verification-placeholder',
    other: {
      'google-site-verification': [process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'google-site-verification-placeholder'],
    },
  },
  // TODO: Consider adding more specific meta tags for different pages
  // TODO: Add JSON-LD structured data for LocalBusiness schema
  // TODO: Consider adding meta tags for specific social media platforms (Facebook, LinkedIn)
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (
    !routing.locales.includes(
      locale as 'en' | 'sk' | 'cs' | 'de' | 'es' | 'hu' | 'fr'
    )
  ) {
    notFound();
  }

  // Providing all messages to the client for the specific locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <link rel="alternate" hrefLang="en" href="https://rise.sk/en" />
        <link rel="alternate" hrefLang="sk" href="https://rise.sk/sk" />
        <link rel="alternate" hrefLang="x-default" href="https://rise.sk" />
      </head>
      <body
        className="antialiased font-sans"
      >
        <GoogleAnalytics />
        <WebVitalsReporter />
        <ServiceWorkerRegistration />
        <StructuredData />
        <SmoothScrollProvider>
          <ScrollProgress />
          <RiseIconRain />
          <NextIntlClientProvider messages={messages}>
            <LanguagePreferenceHandler />
            {children}
          </NextIntlClientProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
