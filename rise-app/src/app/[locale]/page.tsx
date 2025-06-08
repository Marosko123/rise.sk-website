import About from '@/components/About';
import Contact from '@/components/Contact';
import EngagementModels from '@/components/EngagementModels';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import Services from '@/components/ServicesNew';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Services />
        <EngagementModels />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
