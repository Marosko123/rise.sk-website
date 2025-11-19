import { Metadata } from 'next';
import { Laptop } from 'lucide-react';
import ServiceDetailLayout from '@/components/layout/ServiceDetailLayout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.webDevelopment' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `https://rise.sk/${locale}/sluzby/tvorba-web-stranok`,
      languages: {
        'sk': 'https://rise.sk/sk/sluzby/tvorba-web-stranok',
        'en': 'https://rise.sk/en/services/web-development',
      }
    }
  };
}

export default function WebDevelopmentPage() {
  return <ServiceDetailLayout serviceId="webDevelopment" icon={<Laptop className="w-8 h-8" />} />;
}
