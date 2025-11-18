import type { Metadata } from 'next';

import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/BreadcrumbSchema';
import Portfolio from '@/components/Portfolio';

export const metadata: Metadata = {
  title: 'Portfolio | Rise.sk - Software Development Projects & Case Studies',
  description: 'Explore Rise.sk portfolio of successful software development projects. Custom web applications, mobile apps, enterprise solutions, and innovative programming projects in Slovakia.',
  keywords: 'Rise.sk portfolio, software development projects, web application portfolio, mobile app development examples, programming case studies Slovakia, custom software projects',
  openGraph: {
    title: 'Portfolio | Rise.sk - Software Development Projects & Case Studies',
    description: 'Explore Rise.sk portfolio of successful software development projects. Custom web applications, mobile apps, enterprise solutions, and innovative programming projects.',
    url: 'https://rise.sk/en/portfolio',
    siteName: 'Rise.sk',
    images: [
      {
        url: '/rise/bronze/Rise_logo_circle.png',
        width: 1200,
        height: 630,
        alt: 'Rise.sk Portfolio - Software Development Projects',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Rise.sk - Software Development Projects & Case Studies',
    description: 'Explore Rise.sk portfolio of successful software development projects. Custom web applications, mobile apps, enterprise solutions.',
    images: ['/rise/bronze/Rise_logo_circle.png'],
  },
  alternates: {
    canonical: 'https://rise.sk/en/portfolio',
  },
};

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'portfolio');

  return (
    <div className="min-h-screen bg-black">
      <BreadcrumbSchema items={breadcrumbs} page="portfolio" />
      <Portfolio />
    </div>
  );
}
