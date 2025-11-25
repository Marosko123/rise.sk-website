import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'testYourBusiness.meta' });

  const localePath = locale === 'sk' ? '/otestujte-podnikanie' : '/test-your-business';
  const localeCode = locale === 'sk' ? 'sk_SK' : 'en_US';
  const baseUrl = 'https://www.rise.sk';
  const url = locale === 'sk' ? `${baseUrl}${localePath}` : `${baseUrl}/${locale}${localePath}`;

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url,
      siteName: 'Rise.sk',
      locale: localeCode,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: url,
      languages: {
        'sk': 'https://www.rise.sk/otestujte-podnikanie',
        'en': 'https://www.rise.sk/en/test-your-business',
      }
    }
  };
}

export default function TestYourBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
