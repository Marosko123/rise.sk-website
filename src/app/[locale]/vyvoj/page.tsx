import type { Metadata } from 'next';

import About from '@/components/sections/About';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import Footer from '@/components/sections/Footer';
import Hero from '@/components/sections/Hero';
import Hiring from '@/components/sections/Hiring';
import Contact from '@/components/features/MultiStepContactForm';
import Navigation from '@/components/layout/Navigation';
import Portfolio from '@/components/sections/Portfolio';
import Reviews from '@/components/sections/Reviews';
import ServicesEnhanced from '@/components/sections/ServicesEnhanced';

export const metadata: Metadata = {
  title: 'Vývoj Softvéru na Mieru | Programátorské Tímy Slovensko - Rise.sk',
  description: 'Profesionálny vývoj softvéru na mieru na Slovensku. Najímajte dedikované programátorské tímy pre webové aplikácie, mobilné aplikácie a enterprise riešenia. Rýchle dodanie, spoľahlivý kód.',
  keywords: 'vývoj softvéru na mieru, programátorské služby Slovensko, webový vývoj, vývoj mobilných aplikácií, dedikované vývojárske tímy, softvérové riešenia Slovensko',
  openGraph: {
    title: 'Vývoj Softvéru na Mieru | Programátorské Tímy Slovensko - Rise.sk',
    description: 'Profesionálny vývoj softvéru na mieru na Slovensku. Najímajte dedikované programátorské tímy pre webové aplikácie, mobilné aplikácie a enterprise riešenia.',
    url: 'https://rise.sk/sk/vyvoj',
    siteName: 'Rise.sk',
    locale: 'sk_SK',
    images: [
      {
        url: '/rise/bronze/Rise_logo_circle.png',
        width: 1200,
        height: 630,
        alt: 'Rise.sk - Vývoj Softvéru na Mieru',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vývoj Softvéru na Mieru | Programátorské Tímy Slovensko - Rise.sk',
    description: 'Profesionálny vývoj softvéru na mieru na Slovensku. Najímajte dedikované programátorské tímy pre webové aplikácie, mobilné aplikácie a enterprise riešenia.',
    images: ['/rise/bronze/Rise_logo_circle.png'],
  },
  alternates: {
    canonical: 'https://rise.sk/sk/vyvoj',
    languages: {
      'en': 'https://rise.sk/en/development',
    },
  },
};

export default async function DevelopmentPageSK({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'vyvoj');

  return (
    <div className='min-h-screen'>
      <BreadcrumbSchema items={breadcrumbs} page="vyvoj" />
      <Navigation />
      <main>
        <div id='hero'>
          <Hero />
        </div>
        <div id='about'>
          <About />
        </div>
        <div id='services'>
          <ServicesEnhanced />
        </div>
        <div id='portfolio'>
          <Portfolio />
        </div>
        <div id='reviews'>
          <Reviews />
        </div>
        <div id='hiring'>
          <Hiring />
        </div>
        <div id='contact'>
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
