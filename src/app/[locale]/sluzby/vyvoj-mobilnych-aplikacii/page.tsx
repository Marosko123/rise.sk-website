import ServiceDetailLayout from '@/components/layout/ServiceDetailLayout';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import { getSortedPostsData } from '@/utils/blog-server';
import { Smartphone } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.mobileApps' });

  const localePath = locale === 'sk' ? '/sluzby/vyvoj-mobilnych-aplikacii' : '/services/mobile-app-development';
  const localeCode = locale === 'sk' ? 'sk_SK' : 'en_US';
  const canonicalUrl = locale === 'sk'
    ? 'https://rise.sk/sluzby/vyvoj-mobilnych-aplikacii'
    : `https://rise.sk/${locale}${localePath}`;

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords').split(',').map(k => k.trim()),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: canonicalUrl,
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
      canonical: canonicalUrl,
      languages: {
        'sk': 'https://rise.sk/sluzby/vyvoj-mobilnych-aplikacii',
        'en': 'https://rise.sk/en/services/mobile-app-development',
      }
    }
  };
}

export default async function MobileAppsPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, locale === 'sk' ? 'vyvoj-mobilnych-aplikacii' : 'mobile-app-development');

  const allPosts = getSortedPostsData(locale);
  const relatedSlugs = ['kedy-mobilnu-aplikaciu', 'prepojenie-aplikacie-webu-seo'];
  const relatedPosts = allPosts.filter(post => relatedSlugs.includes(post.slug));

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} page="mobile-app-development" />
      <ServiceDetailLayout
        serviceId="mobileApps"
        icon={<Smartphone className="w-8 h-8" />}
        breadcrumbs={breadcrumbs}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
