import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { MorphingCursor } from '@/components/InteractiveElements';
import LanguagePreferenceHandler from '@/components/LanguagePreferenceHandler';
import { ScrollProgress } from '@/components/ScrollEffects';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { routing } from '@/i18n/routing';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rise - Professional Web Development & IT Solutions',
  description:
    'Transform your digital presence with our expert web development and IT services. We create modern, scalable solutions for businesses of all sizes.',
  keywords:
    'web development, IT solutions, modern websites, digital transformation, professional services',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScrollProvider>
          <ScrollProgress />
          <MorphingCursor />
          <NextIntlClientProvider messages={messages}>
            <LanguagePreferenceHandler />
            {children}
          </NextIntlClientProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
