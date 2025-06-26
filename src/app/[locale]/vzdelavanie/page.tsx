import type { Metadata } from 'next';

import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/BreadcrumbSchema';

import EducationContent from '../education/EducationContent';

export const metadata: Metadata = {
  title: 'Programátorské Vzdelávanie a Školenia | Rise.sk - IT Kurzy Slovensko',
  description: 'Profesionálne programátorské vzdelávanie a IT školenia na Slovensku. Naučte sa webový vývoj, vývoj mobilných aplikácií a softvérové inžinierstvo od odborníkov z praxe v Rise.sk.',
  keywords: 'programátorské vzdelávanie Slovensko, IT školenia, webový vývoj školenia, kurzy vývoja mobilných aplikácií, vzdelávanie softvérového inžinierstva, programátorský bootcamp Slovensko',
  openGraph: {
    title: 'Programátorské Vzdelávanie a Školenia | Rise.sk - IT Kurzy Slovensko',
    description: 'Profesionálne programátorské vzdelávanie a IT školenia na Slovensku. Naučte sa webový vývoj, vývoj mobilných aplikácií a softvérové inžinierstvo od odborníkov z praxe.',
    url: 'https://rise.sk/sk/vzdelavanie',
    siteName: 'Rise.sk',
    locale: 'sk_SK',
    images: [
      {
        url: '/rise/logo-circle-bronze-bg.png',
        width: 1200,
        height: 630,
        alt: 'Rise.sk - Programátorské Vzdelávanie a Školenia',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Programátorské Vzdelávanie a Školenia | Rise.sk - IT Kurzy Slovensko',
    description: 'Profesionálne programátorské vzdelávanie a IT školenia na Slovensku. Naučte sa webový vývoj, vývoj mobilných aplikácií a softvérové inžinierstvo.',
    images: ['/rise/logo-circle-bronze-bg.png'],
  },
  alternates: {
    canonical: 'https://rise.sk/sk/vzdelavanie',
    languages: {
      'en': 'https://rise.sk/en/education',
    },
  },
};

export default async function EducationPageSK({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'vzdelavanie');
  
  return (
    <div className="min-h-screen bg-black">
      <BreadcrumbSchema items={breadcrumbs} page="vzdelavanie" />
      <EducationContent />
    </div>
  );
}
