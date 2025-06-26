import type { Metadata } from 'next';

import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/BreadcrumbSchema';

import EducationContent from './EducationContent';

export const metadata: Metadata = {
  title: 'Programming Education & Training | Rise.sk - IT Courses Slovakia',
  description: 'Professional programming education and IT training courses in Slovakia. Learn web development, mobile app development, and software engineering from industry experts at Rise.sk.',
  keywords: 'programming education Slovakia, IT training courses, web development training, mobile app development courses, software engineering education, programming bootcamp Slovakia',
  openGraph: {
    title: 'Programming Education & Training | Rise.sk - IT Courses Slovakia',
    description: 'Professional programming education and IT training courses in Slovakia. Learn web development, mobile app development, and software engineering from industry experts.',
    url: 'https://rise.sk/en/education',
    siteName: 'Rise.sk',
    images: [
      {
        url: '/rise/logo-circle-bronze-bg.png',
        width: 1200,
        height: 630,
        alt: 'Rise.sk - Programming Education & Training',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Programming Education & Training | Rise.sk - IT Courses Slovakia',
    description: 'Professional programming education and IT training courses in Slovakia. Learn web development, mobile app development, and software engineering.',
    images: ['/rise/logo-circle-bronze-bg.png'],
  },
  alternates: {
    canonical: 'https://rise.sk/en/education',
    languages: {
      'sk': 'https://rise.sk/sk/vzdelavanie',
    },
  },
};

export default async function EducationPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'education');
  
  return (
    <div className="min-h-screen bg-black">
      <BreadcrumbSchema items={breadcrumbs} page="education" />
      <EducationContent />
    </div>
  );
}
