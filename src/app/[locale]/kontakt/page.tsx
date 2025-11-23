import type { Metadata } from 'next';

import Contact from '@/components/features/MultiStepContactForm';
import GlobalBackgroundWrapper from '@/components/GlobalBackgroundWrapper';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.contact' });

  const localePath = locale === 'sk' ? '/kontakt' : '/contact';
  const localeCode = locale === 'sk' ? 'sk_SK' : 'en_US';
  const canonicalUrl = locale === 'sk'
    ? 'https://rise.sk/kontakt'
    : `https://rise.sk/${locale}${localePath}`;

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
        'sk': 'https://rise.sk/kontakt',
        'en': 'https://rise.sk/en/contact',
      },
    },
  };
}

export default async function ContactPageSK({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'kontakt');

  return (
    <div className="min-h-screen relative">
      <GlobalBackgroundWrapper showFullWebsite={true} />
      <div className="sticky top-0 z-[100]">
        <Navigation />
      </div>
      <BreadcrumbSchema items={breadcrumbs} page="kontakt" />
      <div className="pt-12">
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
