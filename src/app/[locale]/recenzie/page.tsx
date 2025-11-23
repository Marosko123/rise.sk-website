import { useLocale, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import Contact from '@/components/features/MultiStepContactForm';
import GlobalBackgroundWrapper from '@/components/GlobalBackgroundWrapper';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import Reviews from '@/components/sections/Reviews';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import EnhancedSchema from '@/components/seo/EnhancedSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'reviews' });

  return {
    title: `${t('title')} | Rise.sk`,
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | Rise.sk`,
      description: t('subtitle'),
      url: `https://rise.sk/${locale}/recenzie`,
      siteName: 'Rise.sk',
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | Rise.sk`,
      description: t('subtitle'),
    },
  };
}

export default function ReviewsPage() {
  const t = useTranslations('reviews');
  const locale = useLocale();
  const breadcrumbs = getBreadcrumbsForPage(locale as 'en' | 'sk', 'recenzie');

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <GlobalBackgroundWrapper />
      <Navigation />

      <div className="relative z-10 pt-20">
        <BreadcrumbSchema items={breadcrumbs} page="recenzie" />
        <EnhancedSchema
          type="CollectionPage"
          data={{
            name: t('title'),
            description: t('subtitle'),
            url: "https://rise.sk/recenzie"
          }}
        />

        <Reviews className="pb-0" />
        <Contact className="pt-0" />
      </div>
      <Footer />
    </main>
  );
}
