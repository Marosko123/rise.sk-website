import type { Metadata } from 'next';

import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/BreadcrumbSchema';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ServicesEnhanced from '@/components/ServicesEnhanced';

export const metadata: Metadata = {
  title: 'IT Služby a Riešenia | Programátorské a Vývojárske Služby Slovensko',
  description: 'Komplexné IT služby a softvérové riešenia na Slovensku. Webový vývoj, mobilné aplikácie, enterprise softvér, cloudové riešenia a dedikované programátorské tímy. Profesionálne IT poradenstvo.',
  keywords: 'IT služby Slovensko, programátorské služby, softvérové riešenia, webové vývojárske služby, vývoj mobilných aplikácií, enterprise softvér, cloudové riešenia, IT poradenstvo Slovensko',
  openGraph: {
    title: 'IT Služby a Riešenia | Programátorské a Vývojárske Služby Slovensko',
    description: 'Komplexné IT služby a softvérové riešenia na Slovensku. Webový vývoj, mobilné aplikácie, enterprise softvér, cloudové riešenia a dedikované programátorské tímy.',
    url: 'https://rise.sk/sk/sluzby',
    siteName: 'Rise.sk',
    locale: 'sk_SK',
    images: [
      {
        url: '/rise/logo-circle-bronze-bg.png',
        width: 1200,
        height: 630,
        alt: 'Rise.sk - IT Služby a Riešenia',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT Služby a Riešenia | Programátorské a Vývojárske Služby Slovensko',
    description: 'Komplexné IT služby a softvérové riešenia na Slovensku. Webový vývoj, mobilné aplikácie, enterprise softvér, cloudové riešenia.',
    images: ['/rise/logo-circle-bronze-bg.png'],
  },
  alternates: {
    canonical: 'https://rise.sk/sk/sluzby',
    languages: {
      'en': 'https://rise.sk/en/services',
    },
  },
};

export default async function ServicesPageSK({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'sluzby');

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={breadcrumbs} page="sluzby" />
      <Navigation />
      <main>
        <ServicesEnhanced />
      </main>
      <Footer />
    </div>
  );
}
