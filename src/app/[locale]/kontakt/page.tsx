import type { Metadata } from 'next';

import Contact from '@/components/features/MultiStepContactForm';
import Navigation from '@/components/layout/Navigation';
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
    <div className="min-h-screen bg-black">
      <BreadcrumbSchema items={breadcrumbs} page="kontakt" />
      <Navigation transparent={true} />
      <div className="-mt-20 pt-24">
        <Contact />
      </div>
    </div>
  );
}
