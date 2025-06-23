'use client';

import About from '@/components/About';
import Contact from '@/components/Contact';
import EngagementModels from '@/components/EngagementModels';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import Portfolio from '@/components/Portfolio';
import Reviews from '@/components/Reviews';
import ScrollToTop from '@/components/ScrollToTop';
import ServicesEnhanced from '@/components/ServicesEnhanced';

export default function DevelopmentPage() {
  return (
    <div className='min-h-screen'>
      <Navigation />
      <ScrollToTop />
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
