import ServiceDetailLayout from '@/components/layout/ServiceDetailLayout';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import { ShoppingCart } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.ecommerce' });

  const localePath = locale === 'sk' ? '/tvorba-eshopu' : '/ecommerce-development';
  const localeCode = locale === 'sk' ? 'sk_SK' : 'en_US';
  const baseUrl = 'https://rise.sk';
  const url = locale === 'sk' ? `${baseUrl}${localePath}` : `${baseUrl}/${locale}${localePath}`;

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url,
      siteName: 'Rise.sk',
      locale: localeCode,
      images: [
        {
          url: '/rise/gradient/Rise_logo_circle.png',
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
      images: ['/rise/gradient/Rise_logo_circle.png'],
    },
    alternates: {
      canonical: url,
      languages: {
        'sk': 'https://rise.sk/tvorba-eshopu',
        'en': 'https://rise.sk/en/ecommerce-development',
      }
    }
  };
}

export default async function EcommercePage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, locale === 'sk' ? 'tvorba-eshopu' : 'ecommerce-development');

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} page="ecommerce-development" />
      <ServiceDetailLayout
        serviceId="ecommerce"
        icon={<ShoppingCart className="w-8 h-8" />}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
