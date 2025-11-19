import type { Metadata } from 'next';

import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import Contact from '@/components/features/MultiStepContactForm';

export const metadata: Metadata = {
  title: 'Kontakt | Rise.sk - Profesionálne Programátorské Tímy Slovensko',
  description: 'Kontaktujte Rise.sk pre profesionálne programátorské služby na Slovensku. Získajte svoj vývojársky tím za 7 dní. Email: rise@rise.sk, Telefón: +421-911-670-188. Kancelária v Bratislave.',
  keywords: 'kontakt Rise.sk, kontakt programátorské tímy, najať vývojárov Slovensko, kontakt vývoj softvéru, Bratislava programátorská spoločnosť',
  openGraph: {
    title: 'Kontakt | Rise.sk - Profesionálne Programátorské Tímy Slovensko',
    description: 'Kontaktujte Rise.sk pre profesionálne programátorské služby na Slovensku. Získajte svoj vývojársky tím za 7 dní. Email: rise@rise.sk, Telefón: +421-911-670-188.',
    url: 'https://rise.sk/sk/kontakt',
    siteName: 'Rise.sk',
    locale: 'sk_SK',
    images: [
      {
        url: '/rise/bronze/Rise_logo_circle.png',
        width: 1200,
        height: 630,
        alt: 'Kontakt Rise.sk - Profesionálne Programátorské Tímy',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kontakt | Rise.sk - Profesionálne Programátorské Tímy Slovensko',
    description: 'Kontaktujte Rise.sk pre profesionálne programátorské služby na Slovensku. Získajte svoj vývojársky tím za 7 dní.',
    images: ['/rise/bronze/Rise_logo_circle.png'],
  },
  alternates: {
    canonical: 'https://rise.sk/sk/kontakt',
    languages: {
      'en': 'https://rise.sk/en/contact',
    },
  },
};

export default async function ContactPageSK({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'kontakt');

  return (
    <div className="min-h-screen bg-black">
      <BreadcrumbSchema items={breadcrumbs} page="kontakt" />
      <Contact />
    </div>
  );
}
