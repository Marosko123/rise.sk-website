import type { Metadata } from 'next';

import MultiStepContactForm from '@/components/features/MultiStepContactForm';

// ISR - revalidate every 2 hours
export const revalidate = 7200;
import GlobalBackgroundWrapper from '@/components/GlobalBackgroundWrapper';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import Portfolio from '@/components/sections/Portfolio';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import EnhancedSchema from '@/components/seo/EnhancedSchema';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.portfolio' });
  // Removed unused tProjects variable

  const localePath = '/portfolio';
  const localeCode = locale === 'sk' ? 'sk_SK' : 'en_US';
  const baseUrl = 'https://www.rise.sk';
  const canonicalUrl = locale === 'sk'
    ? `${baseUrl}${localePath}`
    : `${baseUrl}/${locale}${localePath}`;

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: canonicalUrl,
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
      canonical: canonicalUrl,
      languages: {
        'sk': 'https://www.rise.sk/portfolio',
        'en': 'https://www.rise.sk/en/portfolio',
      },
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'portfolio');
  const t = await getTranslations({ locale, namespace: 'pages.portfolio' });
  const tProjects = await getTranslations({ locale, namespace: 'portfolio.projects.descriptions' });

  // Extract project data for schema
  const projects = [
    { name: 'Horilla HR', description: tProjects('horilla') },
    { name: 'Viac ako Nick', description: tProjects('viacAkoNick') },
    { name: 'Lumturi Auction', description: tProjects('lumturi') },
    { name: 'Pixel Corporation', description: tProjects('pixelCorporation') },
    { name: 'Trulink', description: tProjects('trulink') },
    { name: 'Rise.sk Web', description: tProjects('riseWeb') },
    { name: 'Doučma', description: tProjects('doucma') },
    { name: 'Rozvoj Dopravy', description: tProjects('rozvojDopravy') },
  ];

  return (
    <div className="min-h-screen relative">
      <GlobalBackgroundWrapper showFullWebsite={true} />
      <div className="sticky top-0 z-[100]">
        <Navigation />
      </div>
      <BreadcrumbSchema items={breadcrumbs} page="portfolio" />
      <EnhancedSchema
        type="CollectionPage"
        data={{
          name: t('meta.title'),
          description: t('meta.description'),
          url: locale === 'sk' ? 'https://www.rise.sk/portfolio' : 'https://www.rise.sk/en/portfolio',
          items: projects
        }}
      />
      <Portfolio />
      <MultiStepContactForm id={locale === 'sk' ? 'kontakt' : 'contact'} />
      <Footer />
    </div>
  );
}
