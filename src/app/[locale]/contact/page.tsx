import type { Metadata } from 'next';

import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/BreadcrumbSchema';
import Contact from '@/components/Contact';
import FAQSchema, { getFAQsForPage } from '@/components/FAQSchema';

export const metadata: Metadata = {
  title: 'Contact Us | Rise.sk - Professional Programming Teams Slovakia',
  description: 'Contact Rise.sk for professional programming services in Slovakia. Get your development team in 7 days. Email: rise@rise.sk, Phone: +421-911-670-188. Bratislava office.',
  keywords: 'contact Rise.sk, programming teams contact, hire developers Slovakia, software development contact, Bratislava programming company',
  openGraph: {
    title: 'Contact Us | Rise.sk - Professional Programming Teams Slovakia',
    description: 'Contact Rise.sk for professional programming services in Slovakia. Get your development team in 7 days. Email: rise@rise.sk, Phone: +421-911-670-188.',
    url: 'https://rise.sk/en/contact',
    siteName: 'Rise.sk',
    images: [
      {
        url: '/rise/logo-circle-bronze-bg.png',
        width: 1200,
        height: 630,
        alt: 'Contact Rise.sk - Professional Programming Teams',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Rise.sk - Professional Programming Teams Slovakia',
    description: 'Contact Rise.sk for professional programming services in Slovakia. Get your development team in 7 days.',
    images: ['/rise/logo-circle-bronze-bg.png'],
  },
  alternates: {
    canonical: 'https://rise.sk/en/contact',
    languages: {
      'sk': 'https://rise.sk/sk/kontakt',
    },
  },
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'contact');

  return (
    <div className="min-h-screen bg-black">
      <BreadcrumbSchema items={breadcrumbs} page="contact" />
      <FAQSchema faqs={getFAQsForPage('contact')} page="contact" />
      <Contact />
    </div>
  );
}
