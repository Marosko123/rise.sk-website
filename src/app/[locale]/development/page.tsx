'use client';

import { useTranslations } from 'next-intl';

import About from '@/components/About';
import { ScrollSectionNavigator } from '@/components/AdvancedScrollEffects';
import Contact from '@/components/Contact';
import EngagementModels from '@/components/EngagementModels';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import ServicesEnhanced from '@/components/ServicesEnhanced';

export default function DevelopmentPage() {
  const t = useTranslations('navigation');

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: t('about') },
    { id: 'services', label: t('services') },
    { id: 'engagement', label: t('engagement') },
    { id: 'contact', label: t('contact') },
  ];

  return (
    <div className='min-h-screen'>
      <Navigation />
      <ScrollSectionNavigator sections={sections} />
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
        <div id='engagement'>
          <EngagementModels />
        </div>
        <div id='contact'>
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
