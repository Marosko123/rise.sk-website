import type { Metadata } from 'next';

import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/BreadcrumbSchema';
import FAQSchema, { getFAQsForPage } from '@/components/FAQSchema';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ServicesEnhanced from '@/components/ServicesEnhanced';

export const metadata: Metadata = {
  title: 'IT Services & Solutions | Programming & Development Services Slovakia',
  description: 'Comprehensive IT services and software solutions in Slovakia. Web development, mobile apps, enterprise software, cloud solutions, and dedicated programming teams. Professional IT consulting.',
  keywords: 'IT services Slovakia, programming services, software solutions, web development services, mobile app development, enterprise software, cloud solutions, IT consulting Slovakia',
  openGraph: {
    title: 'IT Services & Solutions | Programming & Development Services Slovakia',
    description: 'Comprehensive IT services and software solutions in Slovakia. Web development, mobile apps, enterprise software, cloud solutions, and dedicated programming teams.',
    url: 'https://rise.sk/en/services',
    siteName: 'Rise.sk',
    images: [
      {
        url: '/rise/logo-circle-bronze-bg.png',
        width: 1200,
        height: 630,
        alt: 'Rise.sk - IT Services & Solutions',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT Services & Solutions | Programming & Development Services Slovakia',
    description: 'Comprehensive IT services and software solutions in Slovakia. Web development, mobile apps, enterprise software, cloud solutions.',
    images: ['/rise/logo-circle-bronze-bg.png'],
  },
  alternates: {
    canonical: 'https://rise.sk/en/services',
    languages: {
      'sk': 'https://rise.sk/sk/sluzby',
    },
  },
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'services');

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={breadcrumbs} page="services" />
      <FAQSchema faqs={getFAQsForPage('services')} page="services" />
      <Navigation />
      <main>
        <ServicesEnhanced />
      </main>
      <Footer />
    </div>
  );
}
