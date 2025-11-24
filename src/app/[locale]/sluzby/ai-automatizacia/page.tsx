import ServiceDetailLayout from '@/components/layout/ServiceDetailLayout';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import { getSortedPostsData } from '@/utils/blog-server';
import { Brain } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.ai' });

  const localePath = locale === 'sk' ? '/sluzby/ai-automatizacia' : '/services/ai-automation';
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
      canonical: `https://rise.sk/${locale}${localePath}`,
      languages: {
        'sk': 'https://rise.sk/sluzby/ai-automatizacia',
        'en': 'https://rise.sk/en/services/ai-automation',
      }
    }
  };
}

export default async function AiAutomationPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, locale === 'sk' ? 'ai-automatizacia' : 'ai-automation');

  const allPosts = getSortedPostsData(locale);
  const relatedSlugs = ['ai-chat-zvysenie-dopytov', 'automatizovane-leady-z-webu'];
  const relatedPosts = allPosts.filter(post => relatedSlugs.includes(post.slug));

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} page="ai-automation" />
      <ServiceDetailLayout
        serviceId="ai"
        icon={<Brain className="w-8 h-8" />}
        breadcrumbs={breadcrumbs}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
