import type { Metadata } from 'next';

import LandingPage from '@/components/LandingPage';
import { AnimationProvider } from '@/components/AnimationProvider';

export const metadata: Metadata = {
  title: 'Rise.sk - Expert Programming Teams | Custom Software Development Slovakia',
  description: 'Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps. Quick delivery, reliable code, 100% on-time projects. Get your development team in 7 days.',
  keywords: 'programming teams Slovakia, hire programmers Slovakia, custom software development, web development Slovakia, mobile app development, IT solutions Slovakia',
  openGraph: {
    title: 'Rise.sk - Expert Programming Teams | Custom Software Development Slovakia',
    description: 'Hire expert programming teams in Slovakia. Quick delivery, reliable code, 100% on-time projects. Get your development team in 7 days.',
    url: 'https://rise.sk',
    siteName: 'Rise.sk',
    images: [
      {
        url: '/rise/logo-circle-bronze-bg.png',
        width: 1200,
        height: 630,
        alt: 'Rise.sk - Professional Programming Teams',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rise.sk - Expert Programming Teams | Custom Software Development Slovakia',
    description: 'Hire expert programming teams in Slovakia. Quick delivery, reliable code, 100% on-time projects.',
    images: ['/rise/logo-circle-bronze-bg.png'],
  },
};

export default function Home() {
  return (
    <AnimationProvider>
      <LandingPage />
    </AnimationProvider>
  );
}
