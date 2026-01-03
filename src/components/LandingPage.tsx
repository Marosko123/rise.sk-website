'use client';

import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import companyConfig from '@/config/company';
import { SHAPE_CONFIG } from '@/hooks/useFloatingShapes';
import GlobalBackground, { GlobalBackgroundRef } from './GlobalBackground';
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

interface LandingPageProps {
  latestPosts?: React.ReactNode;
}

export default function LandingPage({ latestPosts }: LandingPageProps) {
  const t = useTranslations('landing');
  const locale = useLocale();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showFullWebsite, setShowFullWebsite] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [shapesState, setShapesState] = useState({ length: SHAPE_CONFIG.INITIAL_COUNT, isExploding: false, explosionStartTime: 0 });

  const scrollAccumulator = useRef(0);
  const scrollResetTimer = useRef<NodeJS.Timeout | null>(null);
  const landingOverlayRef = useRef<LandingOverlayRef>(null);
  const globalBackgroundRef = useRef<GlobalBackgroundRef>(null);

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

  const handleShapesStateChange = useCallback((length: number, isExploding: boolean, explosionStartTime?: number) => {
    setShapesState(prev => ({ ...prev, length, isExploding, explosionStartTime: explosionStartTime || prev.explosionStartTime }));
  }, []);

  const handleLogoClick = useCallback(() => {
    globalBackgroundRef.current?.handleLogoClick();
  }, []);

  const triggerTransition = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    globalBackgroundRef.current?.setTransition('start');

    setTimeout(() => {
      window.location.hash = sectionMap.development;
    }, 800); // 800ms animation
  }, [isTransitioning, sectionMap.development]);

  useEffect(() => {
    if (isTransitioning) return;

    const updateVisuals = (progress: number) => {
      landingOverlayRef.current?.updateVisuals(progress);
      globalBackgroundRef.current?.updateVisuals(progress);
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
           window.history.pushState(null, document.title, window.location.pathname + window.location.search);
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
           window.history.pushState(null, document.title, window.location.pathname + window.location.search);
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
        globalBackgroundRef.current?.setTransition('reset');
      } else {
        setIsTransitioning(false);
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
        globalBackgroundRef.current?.setTransition('complete');
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
      <div className='min-h-screen relative overflow-hidden bg-[#1a1a1a]'>
        {/* Background Logo - Matching Overlay */}
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <Image
            src={companyConfig.website.logo.logoGoldTransparent}
            alt={companyConfig.company.name}
            width={600}
            height={600}
            className='select-none opacity-[0.04]'
            draggable={false}
            priority
          />
        </div>

        {/* Header - Absolute positioning to match Overlay */}
        <div className='absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6'>
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={50}
                height={50}
                className='select-none'
                draggable={false}
                style={{ filter: 'drop-shadow(0 0 10px rgba(176, 145, 85, 0.5))' }}
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

        {/* Main Content - Centered exactly like Overlay */}
        <section className='relative z-10 flex items-center justify-center px-6 min-h-screen'>
          <div className='text-center max-w-3xl'>
            <div className='mb-8'>
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={120}
                height={120}
                className='mx-auto select-none'
                draggable={false}
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(176, 145, 85, 0.4))'
                }}
                priority
              />
            </div>

            <div className='mb-12'>
              <h1 className='text-4xl md:text-5xl font-bold text-white mb-4 select-none' style={{ textShadow: '0 0 30px rgba(176, 145, 85, 0.3)' }}>
                {t('tagline.weAre')} <span className='text-primary'>{t('tagline.innovativeSolutions')}</span>
              </h1>
              <p className='text-xl text-white/80 font-light select-none'>
                {t('description')}
              </p>
            </div>

            {/* Button - In flow */}
            <div className='mt-12 lg:mt-32 flex justify-center'>
              <button
                className="group relative px-12 py-4 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 focus:outline-none"
                onClick={() => {
                  router.push('/vyvoj');
                }}
              >
                <div className="absolute inset-0 border border-primary/70 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.15)]" />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-full" />

                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
                </div>

                <span className="relative text-sm font-bold tracking-[0.25em] text-white/90 uppercase drop-shadow-md">
                  {t('discoverMore')}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Scroll Indicator - Absolute at bottom */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto">
          <div className="w-[24px] h-[40px] rounded-full border-2 border-primary/60 flex justify-center p-1.5 shadow-[0_0_15px_rgba(212,175,55,0.15)] opacity-80">
            <div className="w-1 h-1.5 bg-primary rounded-full" />
          </div>
        </div>

        {/* Footer - Absolute positioning to match Overlay */}
        <div className='absolute bottom-0 left-0 right-0 z-20 p-6 text-center'>
          <p className='text-white/60 text-sm select-none'>
            {t('footer')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <GlobalBackground
        ref={globalBackgroundRef}
        mounted={mounted}
        showFullWebsite={showFullWebsite}
        isTransitioning={isTransitioning}
        isScrolling={isScrolling}
        onShapesStateChange={handleShapesStateChange}
      />

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
        onLogoClick={handleLogoClick}
        shapesState={shapesState}
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

            {latestPosts}

            <div id={sectionMap.contact}>
              <MultiStepContactForm />
            </div>

            <Footer />
          </>
      </div>
    </div>
  );
}
