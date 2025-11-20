import LandingPage from '@/components/LandingPage';
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
export default function RootPage() {
  return (
    <LandingPage />
  );
}
