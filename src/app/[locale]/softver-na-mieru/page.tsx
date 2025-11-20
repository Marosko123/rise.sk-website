import ServiceDetailLayout from '@/components/layout/ServiceDetailLayout';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import { Code2 } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.customSoftware' });

  const localePath = locale === 'sk' ? '/softver-na-mieru' : '/custom-software-development';
  const localeCode = locale === 'sk' ? 'sk_SK' : 'en_US';

  return {
    title: t('meta.title'),
    description: t('meta.description'),
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
        'sk': 'https://rise.sk/softver-na-mieru',
        'en': 'https://rise.sk/en/custom-software-development',
      }
    }
  };
}

export default async function CustomSoftwarePage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, locale === 'sk' ? 'softver-na-mieru' : 'custom-software-development');

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} page="custom-software-development" />
      <ServiceDetailLayout
        serviceId="customSoftware"
        icon={<Code2 className="w-8 h-8" />}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
