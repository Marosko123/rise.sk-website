import { Metadata } from 'next';
import { Smartphone } from 'lucide-react';
import ServiceDetailLayout from '@/components/layout/ServiceDetailLayout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.mobileApps' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `https://rise.sk/${locale}/sluzby/vyvoj-mobilnych-aplikacii`,
      languages: {
        'sk': 'https://rise.sk/sk/sluzby/vyvoj-mobilnych-aplikacii',
        'en': 'https://rise.sk/en/services/mobile-app-development',
      }
    }
  };
}

export default function MobileAppsPage() {
  return <ServiceDetailLayout serviceId="mobileApps" icon={<Smartphone className="w-8 h-8" />} />;
}
