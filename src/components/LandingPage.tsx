'use client';

import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import companyConfig from '@/config/company';
import { SHAPE_CONFIG } from '@/hooks/useFloatingShapes';
// Types only
import { GlobalBackgroundRef } from './GlobalBackground';
import LandingOverlay, { LandingOverlayRef } from './LandingOverlay';
// Components will be dynamic

import LanguageSwitcher from './layout/LanguageSwitcher';
import Navigation from './layout/Navigation';

// Dynamic imports for better performance
// Above-the-fold - keep SSR for SEO
const Hero = dynamic(() => import('./sections/Hero'), {
  loading: () => (
    <div className="min-h-[calc(100dvh+80px)] flex items-center justify-center pt-32 mt-[-80px]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="animate-pulse">
          <div className="h-16 bg-white/10 rounded-lg mb-8 w-3/4 mx-auto" />
          <div className="h-8 bg-white/5 rounded mb-4 w-2/3 mx-auto" />
          <div className="h-8 bg-white/5 rounded w-1/2 mx-auto" />
        </div>
      </div>
    </div>
  )
});

// Below-the-fold - disable SSR for faster initial load
const About = dynamic(() => import('./sections/About'), { ssr: false });
const FAQ = dynamic(() => import('./sections/FAQ'), { ssr: false });
const Footer = dynamic(() => import('./sections/Footer'), { ssr: false });
const Hiring = dynamic(() => import('./sections/Hiring'), { ssr: false });
const MultiStepContactForm = dynamic(() => import('./features/MultiStepContactForm'), { ssr: false });
const Portfolio = dynamic(() => import('./sections/Portfolio'), { ssr: false });
const Reviews = dynamic(() => import('./sections/Reviews'), { ssr: false });
const ServicesEnhanced = dynamic(() => import('./sections/ServicesEnhanced'), { ssr: false });

// Heavy visual components - Lazy loaded
const GlobalBackground = dynamic(() => import('./GlobalBackground'), {
  ssr: false,
  loading: () => null
});

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
  const mainContentRef = useRef<HTMLDivElement>(null);

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
    }, 400); // Faster 400ms transition
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
        const threshold = 500; // Balanced threshold
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
          }, 300); // 300ms reset delay
        }
      } else {
        if (window.scrollY <= 10 && e.deltaY < -30) {
           window.history.pushState(null, document.title, window.location.pathname + window.location.search);
           window.dispatchEvent(new Event('hashchange'));
        }
      }
    };

    let touchStartY = 0;
    let lastTouchDeltaY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      lastTouchDeltaY = 0;
      scrollAccumulator.current = 0; // Reset accumulator on new touch
      if (!showFullWebsite) setIsScrolling(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const incrementalDelta = deltaY - lastTouchDeltaY;
      lastTouchDeltaY = deltaY;

      if (!showFullWebsite) {
        // Prevent native pull-to-refresh when swiping
        if (deltaY !== 0) {
          e.preventDefault();
        }

        // Use cumulative tracking like wheel handler
        scrollAccumulator.current = Math.max(0, scrollAccumulator.current + incrementalDelta);

        const threshold = 200; // Balanced touch threshold
        const progress = Math.min(scrollAccumulator.current / threshold, 1);
        updateVisuals(progress);

        if (scrollAccumulator.current >= threshold) {
          triggerTransition();
        }
      } else {
        // Return to landing - require more deliberate gesture (100px)
        if (window.scrollY <= 10 && deltaY < -100) {
           window.history.pushState(null, document.title, window.location.pathname + window.location.search);
           window.dispatchEvent(new Event('hashchange'));
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isTransitioning && !showFullWebsite) {
        setIsScrolling(false);
        // Smooth reset
        scrollAccumulator.current = 0;
        updateVisuals(0);
      }
      lastTouchDeltaY = 0;
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
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
        // Landing page - hide scrollbar, prevent scrolling
        setIsTransitioning(false);
        document.body.style.overflow = 'hidden';
        document.body.classList.add('scrollbar-hide');
        globalBackgroundRef.current?.resetVisuals();
        globalBackgroundRef.current?.setTransition('reset');
      } else {
        // Main page - ALWAYS scroll to top first, then allow scrolling
        window.scrollTo({ top: 0, behavior: 'instant' });
        setIsTransitioning(false);
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
        document.body.classList.remove('scrollbar-hide');
        globalBackgroundRef.current?.resetVisuals();
        globalBackgroundRef.current?.setTransition('complete');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
      document.body.classList.remove('scrollbar-hide');
    };
  }, []);

  useEffect(() => {
    // When transitioning to main page, ALWAYS reset scroll to top immediately
    // so user sees the Hero entrance animation from the very beginning
    if (showFullWebsite) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
  }, [showFullWebsite]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='min-h-[100dvh] relative overflow-hidden bg-[#1a1a1a]'>
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
            fetchPriority="high"
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
        <section className='relative z-10 flex items-center justify-center px-6 min-h-[100dvh]'>
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
                fetchPriority="high"
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
    <div className="min-h-[100dvh] relative overflow-x-hidden">
      <GlobalBackground
        ref={globalBackgroundRef}
        mounted={mounted}
        showFullWebsite={showFullWebsite}
        isTransitioning={isTransitioning}
        isScrolling={isScrolling}
        onShapesStateChange={handleShapesStateChange}
      />

      <div className={`sticky top-0 left-0 right-0 z-[100] transition-opacity duration-400 ${showFullWebsite ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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

      <div ref={mainContentRef} className={`relative z-10 transition-all duration-300 ease-out ${(showFullWebsite || isTransitioning) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
