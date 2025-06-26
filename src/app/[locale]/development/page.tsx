import type { Metadata } from 'next';

import About from '@/components/About';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/BreadcrumbSchema';
import Contact from '@/components/Contact';
import FAQSchema, { getFAQsForPage } from '@/components/FAQSchema';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import Portfolio from '@/components/Portfolio';
import Reviews from '@/components/Reviews';
import ServicesEnhanced from '@/components/ServicesEnhanced';

export const metadata: Metadata = {
  title: 'Custom Software Development Services | Programming Teams Slovakia',
  description: 'Professional custom software development services in Slovakia. Hire dedicated programming teams for web applications, mobile apps, and enterprise solutions. Quick delivery, reliable code.',
  keywords: 'custom software development, programming services Slovakia, web development, mobile app development, dedicated development teams, software solutions Slovakia',
  openGraph: {
    title: 'Custom Software Development Services | Programming Teams Slovakia',
    description: 'Professional custom software development services in Slovakia. Hire dedicated programming teams for web applications, mobile apps, and enterprise solutions.',
    url: 'https://rise.sk/en/development',
    siteName: 'Rise.sk',
    images: [
      {
        url: '/rise/logo-circle-bronze-bg.png',
        width: 1200,
        height: 630,
        alt: 'Rise.sk - Custom Software Development',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Software Development Services | Programming Teams Slovakia',
    description: 'Professional custom software development services in Slovakia. Hire dedicated programming teams for web applications, mobile apps, and enterprise solutions.',
    images: ['/rise/logo-circle-bronze-bg.png'],
  },
  alternates: {
    canonical: 'https://rise.sk/en/development',
    languages: {
      'sk': 'https://rise.sk/sk/vyvoj',
    },
  },
};

export default async function DevelopmentPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'development');

  return (
    <div className="min-h-screen bg-black">
      <BreadcrumbSchema items={breadcrumbs} page="development" />
      <FAQSchema faqs={getFAQsForPage('development')} page="development" />
      <Navigation />
      <Hero />
      <About />
      <ServicesEnhanced />
      <Portfolio />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
}
