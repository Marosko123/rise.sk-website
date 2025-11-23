import LandingPage from '@/components/LandingPage';
import LatestPosts from '@/components/sections/LatestPosts';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.home.meta' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://rise.sk/${locale === 'sk' ? '' : locale}`,
      locale: locale === 'sk' ? 'sk_SK' : 'en_US',
      type: 'website',
      siteName: 'Rise.sk',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: `https://rise.sk/${locale === 'sk' ? '' : 'en'}`,
      languages: {
        'sk': 'https://rise.sk',
        'en': 'https://rise.sk/en',
      }
    }
  };
}

// This is the main Slovak homepage - no redirect needed
export default async function RootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <LandingPage latestPosts={<LatestPosts locale={locale} />} />
  );
}
