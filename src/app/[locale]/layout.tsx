import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { type ReactNode } from 'react';

import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import GoogleTagManager from '@/components/analytics/GoogleTagManager';
import WebVitalsReporter from '@/components/analytics/WebVitalsReporter';
import GDPRConsent from '@/components/features/GDPRConsent';
import ServiceWorkerRegistration from '@/components/features/ServiceWorkerRegistration';
import NavigationProgress from '@/components/layout/NavigationProgress';
import InlineCriticalCSS from '@/components/performance/InlineCriticalCSS';
import { AnimationProvider } from '@/components/providers/AnimationProvider';
import LazyMotionProvider from '@/components/providers/LazyMotionProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import EnhancedSchema from '@/components/seo/EnhancedSchema';
import DeferredStyles from '@/components/ui/DeferredStyles';
import LoadingScreen from '@/components/ui/LoadingScreen';
import PullToRefresh from '@/components/ui/PullToRefresh';
import SkipLink from '@/components/ui/SkipLink';
import { routing } from '@/i18n/routing';

import '../animations.css';
import '../globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rise.sk'),
  title: {
    default: 'Rise.sk | Premium Software Development & Tech Consulting',
    template: '%s | Rise.sk'
  },
  description: 'We build high-performance web & mobile applications. Hire expert programming teams in Slovakia delivering scalable solutions for ambitious companies. Start your project today.',
  applicationName: 'Rise.sk',
  authors: [{ name: 'Rise.sk s.r.o.' }],
  generator: 'Next.js',
  keywords: [
    'software development company',
    'custom software development',
    'web application development',
    'mobile app development',
    'Slovakia tech outsourcing',
    'dedicated programming teams',
    'IT consulting services',
    'enterprise software solutions',
    'digital transformation',
    'React Next.js experts',
    'TypeScript development',
    'Node.js backend',
    'Bratislava software house',
    'Rise.sk',
    // Slovak keywords
    'vývoj softvéru na mieru',
    'tvorba webových aplikácií',
    'vývoj mobilných aplikácií',
    'programátorské tímy',
    'IT outsourcing Slovensko',
    'technologické konzultácie',
    'firemné softvérové riešenia',
    'digitálna transformácia firiem',
    'programovanie webov',
    'webdizajn a vývoj'
  ],
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
      { url: '/rise/gradient/Rise_logo_circle.png', sizes: '192x192', type: 'image/png' },
      { url: '/rise/gradient/Rise_logo_circle.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/rise/gradient/Rise_logo_circle.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: './',
  },
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
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    alternateLocale: 'en_US',
    url: 'https://rise.sk',
    siteName: 'Rise.sk',
    title: 'Rise.sk | Premium Software Development & Tech Consulting',
    description: 'We build high-performance web & mobile applications. Hire expert programming teams in Slovakia delivering scalable solutions for ambitious companies.',
    images: [
      {
        url: 'https://rise.sk/rise/gradient/Rise_logo_text_rectangle.png',
        width: 1200,
        height: 630,
        alt: 'Rise.sk - Expert Programming Teams',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rise_sk',
    creator: '@rise_sk',
    title: 'Rise.sk | Premium Software Development & Tech Consulting',
    description: 'We build high-performance web & mobile applications. Hire expert programming teams in Slovakia delivering scalable solutions for ambitious companies.',
    images: ['https://rise.sk/rise/gradient/Rise_logo_text_rectangle.png'],
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
  params: Promise<{ locale: string }>;
};

// Root layout for all pages
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';

  const breadcrumbs = getBreadcrumbsForPage(locale as 'en' | 'sk', 'home');

  return (
    <html lang={locale} suppressHydrationWarning style={{ overscrollBehaviorY: 'contain' }}>
      <head>
        <InlineCriticalCSS />
        <GoogleTagManager nonce={nonce} />
        <GoogleAnalytics nonce={nonce} />
        <EnhancedSchema type="Organization" />
        <EnhancedSchema type="LocalBusiness" />
        <EnhancedSchema type="WebSite" />
        <EnhancedSchema type="Service" data={{
          name: "Web Development Services",
          description: "Professional web development and design services in Slovakia",
          serviceType: "Custom Software Development"
        }} />
        <BreadcrumbSchema items={breadcrumbs} page="home" />
      </head>
      <body style={{ overscrollBehaviorY: 'contain' }}>
        <LazyMotionProvider>
          <NavigationProgress />
          <LoadingScreen />
          <SkipLink />
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <AnimationProvider>
                <PullToRefresh />
                <main id="main-content" tabIndex={-1} className="focus:outline-none">
                  {children}
                </main>
              </AnimationProvider>
              <ServiceWorkerRegistration />
              <WebVitalsReporter />
              <GDPRConsent />
              <DeferredStyles />
            </ThemeProvider>
          </NextIntlClientProvider>
        </LazyMotionProvider>
      </body>
    </html>
  );
}
