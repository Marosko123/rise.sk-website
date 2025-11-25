import type { Metadata } from 'next';

import Contact from '@/components/features/MultiStepContactForm';
import GlobalBackgroundWrapper from '@/components/GlobalBackgroundWrapper';
import Navigation from '@/components/layout/Navigation';
import About from '@/components/sections/About';
import Footer from '@/components/sections/Footer';
import Hero from '@/components/sections/Hero';
import LatestPosts from '@/components/sections/LatestPosts';
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
  const baseUrl = 'https://www.rise.sk';
  const url = locale === 'sk' ? `${baseUrl}${localePath}` : `${baseUrl}/${locale}${localePath}`;

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url,
      siteName: 'Rise.sk',
      locale: localeCode,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
    alternates: {
      canonical: url,
      languages: {
        'sk': 'https://www.rise.sk/vyvoj',
        'en': 'https://www.rise.sk/en/development',
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

  const sectionMap = locale === 'sk' ? {
    development: 'vyvoj',
    about: 'o-nas',
    services: 'sluzby',
    portfolio: 'portfolio',
    reviews: 'recenzie',
    contact: 'kontakt'
  } : {
    development: 'development',
    about: 'about',
    services: 'services',
    portfolio: 'portfolio',
    reviews: 'reviews',
    contact: 'contact'
  };

  return (
    <div className='min-h-screen relative'>
      <GlobalBackgroundWrapper />
      <BreadcrumbSchema items={breadcrumbs} page="vyvoj" />
      <Navigation transparent={true} />
      <main className="-mt-20">
        <div id={sectionMap.development}>
          <Hero contactSectionId={sectionMap.contact} />
        </div>
        <div id={sectionMap.about}>
          <About />
        </div>
        <div id={sectionMap.services}>
          <ServicesEnhanced />
        </div>
        <div id={sectionMap.portfolio}>
          <Portfolio />
        </div>
        <div id={sectionMap.reviews}>
          <Reviews />
        </div>
        <LatestPosts locale={locale} />
        <div id={sectionMap.contact}>
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
