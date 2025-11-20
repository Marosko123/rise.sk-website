import type { Metadata } from 'next';

import Contact from '@/components/features/MultiStepContactForm';
import Navigation from '@/components/layout/Navigation';
import About from '@/components/sections/About';
import Footer from '@/components/sections/Footer';
import Hero from '@/components/sections/Hero';
import Hiring from '@/components/sections/Hiring';
import Portfolio from '@/components/sections/Portfolio';
import Reviews from '@/components/sections/Reviews';
import ServicesEnhanced from '@/components/sections/ServicesEnhanced';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.development' });

  const localePath = locale === 'sk' ? '/vyvoj' : '/development';
  const localeCode = locale === 'sk' ? 'sk_SK' : 'en_US';

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `https://rise.sk/${locale}${localePath}`,
      siteName: 'Rise.sk',
      locale: localeCode,
      images: [
        {
          url: '/rise/bronze/Rise_logo_circle.png',
          width: 1200,
          height: 630,
          alt: `Rise.sk - ${t('meta.title')}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: ['/rise/bronze/Rise_logo_circle.png'],
    },
    alternates: {
      canonical: `https://rise.sk/${locale}${localePath}`,
      languages: {
        'sk': 'https://rise.sk/vyvoj',
        'en': 'https://rise.sk/en/development',
      },
    },
  };
}

export default async function DevelopmentPageSK({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'vyvoj');

  return (
    <div className='min-h-screen'>
      <BreadcrumbSchema items={breadcrumbs} page="vyvoj" />
      <Navigation transparent={true} />
      <main className="-mt-20">
        <div id='hero'>
          <Hero />
        </div>
        <div id='about'>
          <About />
        </div>
        <div id='services'>
          <ServicesEnhanced />
        </div>
        <div id='portfolio'>
          <Portfolio />
        </div>
        <div id='reviews'>
          <Reviews />
        </div>
        <div id='hiring'>
          <Hiring />
        </div>
        <div id='contact'>
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
