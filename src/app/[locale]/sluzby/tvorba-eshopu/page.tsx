import { Metadata } from 'next';
import { ShoppingCart } from 'lucide-react';
import ServiceDetailLayout from '@/components/layout/ServiceDetailLayout';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.ecommerce' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `https://rise.sk/${locale}/sluzby/tvorba-eshopu`,
      languages: {
        'sk': 'https://rise.sk/sk/sluzby/tvorba-eshopu',
        'en': 'https://rise.sk/en/services/ecommerce-development',
      }
    }
  };
}

export default function EcommercePage() {
  return <ServiceDetailLayout serviceId="ecommerce" icon={<ShoppingCart className="w-8 h-8" />} />;
}
