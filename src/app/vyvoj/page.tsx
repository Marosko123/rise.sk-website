import type { Metadata } from 'next';

import About from '@/components/About';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/BreadcrumbSchema';
import Contact from '@/components/MultiStepContactForm';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Hiring from '@/components/Hiring';
import Navigation from '@/components/Navigation';
import Portfolio from '@/components/Portfolio';
import Reviews from '@/components/Reviews';
import ServicesEnhanced from '@/components/ServicesEnhanced';

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
        url: '/rise/Rise_logo_circle.png',
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
    images: ['/rise/Rise_logo_circle.png'],
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
