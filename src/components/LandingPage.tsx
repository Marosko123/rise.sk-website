'use client';

import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import companyConfig from '@/config/company';
import LandingOverlay, { LandingOverlayRef } from './LandingOverlay';
import LanguageSwitcher from './layout/LanguageSwitcher';

// Dynamic imports for better performance
const About = dynamic(() => import('./sections/About'));
const FAQ = dynamic(() => import('./sections/FAQ'));
const Footer = dynamic(() => import('./sections/Footer'));
const Hero = dynamic(() => import('./sections/Hero'));
const Hiring = dynamic(() => import('./sections/Hiring'));
const MultiStepContactForm = dynamic(() => import('./features/MultiStepContactForm'));
const Navigation = dynamic(() => import('./layout/Navigation'));
const Portfolio = dynamic(() => import('./sections/Portfolio'));
const Reviews = dynamic(() => import('./sections/Reviews'));
const ServicesEnhanced = dynamic(() => import('./sections/ServicesEnhanced'));

export default function LandingPage() {
  const t = useTranslations('landing');
  const locale = useLocale();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showFullWebsite, setShowFullWebsite] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const scrollAccumulator = useRef(0);
  const scrollResetTimer = useRef<NodeJS.Timeout | null>(null);
  const landingOverlayRef = useRef<LandingOverlayRef>(null);

  // Dynamic section mappings based on language
  const getSectionMappings = (lang: string) => {
    if (lang === 'sk') {
      return {
        development: 'vyvoj',
        about: 'o-nas',
        services: 'sluzby',
        portfolio: 'portfolio',
        reviews: 'recenzie',
        faq: 'faq',
        hiring: 'kariera',
        contact: 'kontakt'
      };
    } else {
      return {
        development: 'development',
        about: 'about',
        services: 'services',
        portfolio: 'portfolio',
        reviews: 'reviews',
        faq: 'faq',
        hiring: 'hiring',
        contact: 'contact'
      };
    }
  };

  const sectionMap = getSectionMappings(locale);

  const triggerTransition = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      window.location.hash = sectionMap.development;
    }, 800); // 800ms animation
  }, [isTransitioning, sectionMap.development]);

  useEffect(() => {
    if (isTransitioning) return;

    const updateVisuals = (progress: number) => {
      landingOverlayRef.current?.updateVisuals(progress);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!showFullWebsite) {
        scrollAccumulator.current = Math.max(0, scrollAccumulator.current + e.deltaY);
        const threshold = 400;
        const progress = Math.min(scrollAccumulator.current / threshold, 1);

        updateVisuals(progress);
        setIsScrolling(true);

        if (scrollResetTimer.current) clearTimeout(scrollResetTimer.current);

        if (progress >= 1) {
          triggerTransition();
        } else {
          scrollResetTimer.current = setTimeout(() => {
            setIsScrolling(false);
            updateVisuals(0);
            scrollAccumulator.current = 0;
          }, 150);
        }
      } else {
        if (window.scrollY <= 10 && e.deltaY < -30) {
           window.history.pushState("", document.title, window.location.pathname + window.location.search);
           window.dispatchEvent(new Event('hashchange'));
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      if (!showFullWebsite) setIsScrolling(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (!showFullWebsite) {
        if (deltaY > 0) {
          const threshold = 200;
          const progress = Math.min(deltaY / threshold, 1);
          updateVisuals(progress);

          if (progress >= 1) {
            triggerTransition();
          }
        }
      } else {
        if (window.scrollY <= 10 && deltaY < -50) {
           window.history.pushState("", document.title, window.location.pathname + window.location.search);
           window.dispatchEvent(new Event('hashchange'));
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isTransitioning && !showFullWebsite) {
        setIsScrolling(false);
        updateVisuals(0);
      }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showFullWebsite, isTransitioning, triggerTransition]);

  useEffect(() => {
    const checkHash = () => {
      const hasHash = window.location.hash.length > 0;
      setShowFullWebsite(hasHash);

      if (!hasHash) {
        setIsTransitioning(false);
        document.body.style.overflow = 'hidden';
      } else {
        setIsTransitioning(false);
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
    };
  }, []);

  useEffect(() => {
    if (showFullWebsite && window.location.hash) {
      const timer = setTimeout(() => {
        const hash = window.location.hash.substring(1);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showFullWebsite]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='min-h-screen relative overflow-hidden flex flex-col' style={{ backgroundColor: '#1a1a1a' }}>
        <header className='relative z-50 px-6 py-6'>
          <div className='max-w-7xl mx-auto flex justify-between items-center'>
            <div className='flex items-center space-x-3'>
              <div className='relative'>
                <Image
                  src={companyConfig.website.logo.logoGoldTransparent}
                  alt={companyConfig.company.name}
                  width={50}
                  height={50}
                  className='select-none'
                  draggable={false}
                />
              </div>
              <span className='text-2xl font-bold text-white select-none'>
                {companyConfig.company.domain}
              </span>
            </div>
            <div className="relative z-50">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className='relative z-10 flex-1 flex items-center justify-center px-6'>
          <div className='text-center max-w-3xl'>
            <div className='mb-8'>
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={120}
                height={120}
                className='mx-auto select-none'
                draggable={false}
              />
            </div>

            <div className='mb-12'>
              <h1 className='text-4xl md:text-5xl font-bold text-white mb-4 select-none'>
                {t('tagline.weAre')} <span className='text-primary'>{t('tagline.innovativeSolutions')}</span>
              </h1>
              <p className='text-xl text-white/80 font-light select-none'>
                {t('description')}
              </p>
            </div>

            <div className='flex justify-center'>
              <button
                className='px-12 py-6 text-xl font-semibold text-white rounded-xl border-2 border-primary transition-all duration-300 hover:scale-105 shadow-lg'
                style={{
                  backgroundColor: 'var(--primary)',
                  opacity: 0.1,
                  boxShadow: '0 4px 15px var(--glow)'
                }}
                onClick={() => {
                  router.push('/vyvoj');
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4AF37';
                  e.currentTarget.style.borderColor = '#F4E07A';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.color = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                <span className='flex items-center justify-center space-x-3 select-none'>
                  <span>👉</span>
                  <span>{t('discoverMore')}</span>
                </span>
              </button>
            </div>
          </div>
        </main>

        <footer className='relative z-10 px-6 py-6'>
          <div className='text-center'>
            <p className='text-white/60 text-sm select-none'>
              {t('footer')}
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative">
      <div className={`sticky top-0 left-0 right-0 z-[100] transition-opacity duration-700 ${showFullWebsite ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Navigation transparent={true} hideLinks={!showFullWebsite} />
      </div>

      <LandingOverlay
        ref={landingOverlayRef}
        showFullWebsite={showFullWebsite}
        isTransitioning={isTransitioning}
        isScrolling={isScrolling}
        triggerTransition={triggerTransition}
        mounted={mounted}
      />

      <div className={`relative transition-all duration-1000 ease-in-out ${showFullWebsite ? 'opacity-100 blur-0' : 'opacity-0 blur-xl pointer-events-none'}`}>
          <>
            <div id={sectionMap.development}>
              <Hero />
            </div>

            <div id={sectionMap.about}>
              <About />
            </div>

            <div id={sectionMap.services}>
              <ServicesEnhanced />
            </div>

            <div id={sectionMap.portfolio}>
              <Portfolio />
            </div>

            <div id={sectionMap.reviews}>
              <Reviews />
            </div>

            <div id={sectionMap.faq}>
              <FAQ />
            </div>

            <div id={sectionMap.hiring}>
              <Hiring />
            </div>

            <div id={sectionMap.contact}>
              <MultiStepContactForm />
            </div>

            <Footer />
          </>
      </div>
    </div>
  );
}
