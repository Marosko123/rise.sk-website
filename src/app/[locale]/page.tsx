import About from '@/components/About';
import Contact from '@/components/Contact';
import EngagementModels from '@/components/EngagementModels';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import ServicesEnhanced from '@/components/ServicesEnhanced';
import { ScrollSectionNavigator } from '@/components/AdvancedScrollEffects';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'contact', label: 'Contact' },
];

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Navigation />
      <ScrollSectionNavigator sections={sections} />
      <main>
        <div id="hero">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="services">
          <ServicesEnhanced />
        </div>
        <div id="engagement">
          <EngagementModels />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
