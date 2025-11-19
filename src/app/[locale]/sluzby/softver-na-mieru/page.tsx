import { Metadata } from 'next';
import { Code2 } from 'lucide-react';
import ServiceDetailLayout from '@/components/layout/ServiceDetailLayout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.customSoftware' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `https://rise.sk/${locale}/sluzby/softver-na-mieru`,
      languages: {
        'sk': 'https://rise.sk/sk/sluzby/softver-na-mieru',
        'en': 'https://rise.sk/en/services/custom-software-development',
      }
    }
  };
}

export default function CustomSoftwarePage() {
  return <ServiceDetailLayout serviceId="customSoftware" icon={<Code2 className="w-8 h-8" />} />;
}
