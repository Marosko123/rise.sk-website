'use client';

import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import companyConfig from '@/config/company';
import { SHAPE_CONFIG } from '@/hooks/useFloatingShapes';
import { useIsMobile } from '@/hooks/useIsMobile';
import GlobalBackground, { GlobalBackgroundRef } from './GlobalBackground';
import LandingOverlay, { LandingOverlayRef } from './LandingOverlay';
import LanguageSwitcher from './layout/LanguageSwitcher';

// Dynamic imports for better performance
const About = dynamic(() => import('./sections/About'));
const Footer = dynamic(() => import('./sections/Footer'));
const Hero = dynamic(() => import('./sections/Hero'));
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
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [showFullWebsite, setShowFullWebsite] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const allowReturnRef = useRef(false);
  const isAtTopRef = useRef(true);
  const justTransitionedRef = useRef(false);

  const scrollAccumulator = useRef(0);
  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);
  const scrollResetTimer = useRef<NodeJS.Timeout | null>(null);
  const landingOverlayRef = useRef<LandingOverlayRef>(null);
  const globalBackgroundRef = useRef<GlobalBackgroundRef>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const [shapesState, setShapesState] = useState({ length: SHAPE_CONFIG.INITIAL_COUNT, isExploding: false, explosionStartTime: 0 });

  const handleShapesStateChange = useCallback((length: number, isExploding: boolean, explosionStartTime?: number) => {
    setShapesState({ length, isExploding, explosionStartTime: explosionStartTime || 0 });
  }, []);

  const handleLogoClick = useCallback(() => {
    globalBackgroundRef.current?.handleLogoClick();
  }, []);

  // Dynamic section mappings based on language
  const getSectionMappings = (lang: string) => {
    if (lang === 'sk') {
      return {
        development: 'vyvoj',
        about: 'o-nas',
        services: 'sluzby',
        portfolio: 'portfolio',
        reviews: 'recenzie',
        contact: 'kontakt'
      };
    } else {
      return {
        development: 'development',
        about: 'about',
        services: 'services',
        portfolio: 'portfolio',
        reviews: 'reviews',
        contact: 'contact'
      };
    }
  };

  const sectionMap = getSectionMappings(locale);

  // Linear interpolation helper
  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

  const updateVisuals = useCallback((progress: number) => {
    landingOverlayRef.current?.updateVisuals(progress);
    globalBackgroundRef.current?.updateVisuals(progress);
    if (mainContentRef.current) {
        // Opacity: Fade in late (when progress > 0.5)
        // progress 0 -> 1
        // opacity 0 -> 1
        // Let's make it visible earlier but smoother
        const opacity = Math.pow(progress, 2); // Quadratic ease in
        mainContentRef.current.style.opacity = `${opacity}`;

        // Scale: 0.8 -> 1.0
        // More noticeable zoom in for main content
        const scale = 0.8 + (0.2 * progress);

        // TranslateY: 100px -> 0px
        // Slide up as we enter, slide down as we leave
        const translateY = (1 - progress) * 100;

        mainContentRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }
  }, []);

  const startAnimationLoop = useCallback(() => {
      if (requestRef.current) return;

      const loop = () => {
          const diff = scrollTarget.current - scrollCurrent.current;
          if (Math.abs(diff) > 0.0001 || isScrolling) {
              scrollCurrent.current = lerp(scrollCurrent.current, scrollTarget.current, 0.15);
              updateVisuals(scrollCurrent.current);
              requestRef.current = requestAnimationFrame(loop);
          } else {
              requestRef.current = null;
              // Ensure final state is exact
              scrollCurrent.current = scrollTarget.current;
              updateVisuals(scrollCurrent.current);
          }
      };
      requestRef.current = requestAnimationFrame(loop);
  }, [updateVisuals, isScrolling]);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const animate = () => {
      // Smoothly interpolate current value towards target
      const diff = scrollTarget.current - scrollCurrent.current;

      if (Math.abs(diff) > 0.001) {
        scrollCurrent.current = lerp(scrollCurrent.current, scrollTarget.current, 0.15);
        updateVisuals(scrollCurrent.current);
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Snap to target if close enough
        if (scrollCurrent.current !== scrollTarget.current) {
            scrollCurrent.current = scrollTarget.current;
            updateVisuals(scrollCurrent.current);
        }
      }
    };

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [updateVisuals]);

  // Trigger loop when scrolling state changes
  useEffect(() => {
      if (isScrolling) {
          startAnimationLoop();
      }
  }, [isScrolling, startAnimationLoop]);

  const setTransitions = useCallback((enabled: boolean) => {
    const transition = enabled ? '' : 'none'; // Empty string reverts to CSS class
    landingOverlayRef.current?.setTransition(transition);
    globalBackgroundRef.current?.setTransition(transition);
    if (mainContentRef.current) {
        mainContentRef.current.style.transition = transition;
    }
  }, []);

  const triggerTransition = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    justTransitionedRef.current = true;

    // Lock scroll to kill momentum
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.location.hash = sectionMap.development;
    }, 800); // 800ms animation
  }, [isTransitioning, sectionMap.development]);

  useEffect(() => {
    const handleScroll = () => {
      const isAtTop = window.scrollY <= 5;

      // On mobile, trigger transition when scrolling down on landing page
      if (!showFullWebsite && isMobile) {
        const triggerThreshold = 250; // Threshold to trigger transition
        const animationRange = 400; // Range for full animation effect

        // Drive animation based on scroll
        const progress = Math.min(window.scrollY / animationRange, 1);

        // Update visuals directly for responsiveness
        // Only update if NOT transitioning. If transitioning, let CSS take over.
        if (!isTransitioning) {
             updateVisuals(progress);
        }

        // Update refs so other logic knows current state
        scrollCurrent.current = progress;
        scrollTarget.current = progress;

        if (window.scrollY > triggerThreshold && !isTransitioning) {
          triggerTransition();
          return;
        }
      }

      if (!isAtTop) {
        isAtTopRef.current = false;
        allowReturnRef.current = false;
      } else {
        if (!isAtTopRef.current) {
          // Just arrived at top
          isAtTopRef.current = true;
          // Set timeout to allow return - prevents momentum scrolling from triggering return
          setTimeout(() => {
            allowReturnRef.current = true;
          }, 500);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFullWebsite, isMobile, isTransitioning, triggerTransition, updateVisuals]);

  useEffect(() => {
    if (isTransitioning) return;

    const handleWheel = (e: WheelEvent) => {
      const threshold = 600; // Increased threshold for better feel

      if (!showFullWebsite) {
        // Rubber banding effect: harder to pull as we get closer to 1
        const progress = scrollAccumulator.current / threshold;
        const resistance = 1 - Math.pow(progress, 2) * 0.5; // Quadratic resistance

        scrollAccumulator.current = Math.max(0, scrollAccumulator.current + e.deltaY * resistance);
        const targetProgress = Math.min(scrollAccumulator.current / threshold, 1);

        scrollTarget.current = targetProgress;
        startAnimationLoop();

        if (!isScrolling) {
            setIsScrolling(true);
            setTransitions(false);
        }

        if (scrollResetTimer.current) clearTimeout(scrollResetTimer.current);

        if (targetProgress >= 1) {
          triggerTransition();
        } else {
          scrollResetTimer.current = setTimeout(() => {
            setIsScrolling(false);
            setTransitions(true);
            scrollTarget.current = 0; // Animate back to 0
            startAnimationLoop();
            scrollAccumulator.current = 0;
          }, 150);
        }
      } else {
        // On main website
        if (window.scrollY <= 5) {
           // Check if we are allowed to return (cooldown after arriving at top)
           if (!allowReturnRef.current && !isReturning) return;

           if (e.deltaY < 0 || (isReturning && e.deltaY > 0)) {
              if (!isReturning && scrollAccumulator.current === 0) {
                  scrollAccumulator.current = threshold;
                  scrollCurrent.current = 1;
                  scrollTarget.current = 1;
              }

              // Rubber banding for return
              const _progress = scrollAccumulator.current / threshold;
              // When progress is high (near 1), resistance is low. When low (near 0), resistance is high?
              // No, we want it to be easy to start pulling, then maybe harder?
              // Actually linear is fine for return, or maybe slight ease.

              scrollAccumulator.current = Math.max(0, Math.min(threshold, scrollAccumulator.current + e.deltaY));
              const targetProgress = scrollAccumulator.current / threshold;

              scrollTarget.current = targetProgress;
              startAnimationLoop();

              if (targetProgress < 1) {
                  if (!isReturning) {
                      setIsReturning(true);
                      setIsScrolling(true);
                      setTransitions(false);
                  }

                  if (e.cancelable) e.preventDefault();
              }

              if (scrollResetTimer.current) clearTimeout(scrollResetTimer.current);

              if (targetProgress <= 0) {
                  window.history.pushState("", document.title, window.location.pathname + window.location.search);
                  window.dispatchEvent(new Event('hashchange'));
                  setIsReturning(false);
                  setIsScrolling(false);
                  setTransitions(true);
              } else {
                  scrollResetTimer.current = setTimeout(() => {
                      setIsScrolling(false);
                      setIsReturning(false);
                      setTransitions(true);
                      scrollTarget.current = 1; // Animate back to 1
                      startAnimationLoop();
                      scrollAccumulator.current = threshold;
                      if (mainContentRef.current) {
                          // We let the loop finish the animation to 1
                      }
                  }, 150);
              }
           }
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      if (showFullWebsite && window.scrollY <= 5) {
          if (!isReturning) {
              scrollAccumulator.current = 600;
              scrollTarget.current = 1;
              scrollCurrent.current = 1;
          }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const threshold = 400; // Increased mobile threshold for bigger range

      if (!showFullWebsite) {
        // Allow native scroll on mobile to trigger transition via scroll listener
        // if (e.cancelable) e.preventDefault();

        if (isMobile) return; // Let handleScroll handle it

        if (deltaY > 0) {
          if (!isScrolling) {
              setIsScrolling(true);
              setTransitions(false);
          }

          // Rubber band for touch
          const progress = Math.min(deltaY / threshold, 1);
          // Apply some curve to touch input
          const curvedProgress = Math.pow(progress, 0.8); // Slight ease out

          scrollTarget.current = Math.min(curvedProgress, 1);
          startAnimationLoop();

          if (scrollTarget.current >= 1) {
            triggerTransition();
          }
        }
      } else {
        if (window.scrollY <= 5) {
            // Check if we are allowed to return (cooldown after arriving at top)
            if (!allowReturnRef.current && !isReturning) return;

            if (deltaY < 0 || (isReturning && deltaY > 0)) {
                const pullDistance = -deltaY;
                if (pullDistance > 0) {
                    const progress = Math.max(0, 1 - (pullDistance / threshold));

                    if (progress < 1) {
                        if (!isReturning) {
                            setIsReturning(true);
                            setIsScrolling(true);
                            setTransitions(false);
                        }

                        scrollTarget.current = progress;
                        startAnimationLoop();

                        if (e.cancelable) e.preventDefault();
                    }

                    if (progress <= 0) {
                        window.history.pushState("", document.title, window.location.pathname + window.location.search);
                        window.dispatchEvent(new Event('hashchange'));
                        setIsReturning(false);
                        setTransitions(true);
                    }
                }
            }
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isTransitioning) {
        if (!showFullWebsite) {
            // Stop any ongoing animation loop
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }

            setIsScrolling(false);
            setTransitions(true); // Enable CSS transitions for smooth return

            scrollTarget.current = 0;
            scrollCurrent.current = 0;
            updateVisuals(0); // Reset visuals immediately, letting CSS handle the transition

            if (isMobile) {
              setTimeout(() => {
                // Check if we are still on landing page (transition didn't start)
                if (!isTransitioning && window.scrollY < 250) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }, 50);
            }
        } else if (isReturning) {
            setIsScrolling(false);
            setTransitions(true);
            setIsReturning(false);
            scrollTarget.current = 1;
            startAnimationLoop();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showFullWebsite, isTransitioning, triggerTransition, updateVisuals, isReturning, setTransitions, startAnimationLoop, isScrolling, isMobile]);

  useEffect(() => {
    const checkHash = () => {
      const hasHash = window.location.hash.length > 0;
      setShowFullWebsite(hasHash);

      if (!hasHash) {
        setIsTransitioning(false);
        setIsReturning(false);
        scrollAccumulator.current = 0;
        scrollTarget.current = 0;
        scrollCurrent.current = 0;
        // Allow scroll on mobile, but hide on desktop
        if (isMobile) {
          document.body.style.overflowY = 'auto';
          document.body.style.overflowX = 'hidden';
        } else {
          document.body.style.overflow = 'hidden';
        }
        // Reset visuals to landing state
        if (mainContentRef.current) {
            mainContentRef.current.style.opacity = '';
            mainContentRef.current.style.transform = '';
        }
        updateVisuals(0);
      } else {
        setIsTransitioning(false);
        scrollAccumulator.current = 600; // Initialize as "full"
        scrollTarget.current = 1;
        scrollCurrent.current = 1;

        // Force scroll to top BEFORE enabling overflow to prevent momentum carry-over
        window.scrollTo({ top: 0, behavior: 'instant' });

        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';

        // Force scroll to top AGAIN after enabling overflow to be absolutely sure
        requestAnimationFrame(() => {
             window.scrollTo({ top: 0, behavior: 'instant' });
        });

        // Ensure visuals are at full state
        updateVisuals(1);
        // Initialize allowReturnRef to true since we are starting at top
        allowReturnRef.current = true;
        isAtTopRef.current = true;
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);

    // Disable browser scroll restoration to prevent jumping
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    return () => {
      window.removeEventListener('hashchange', checkHash);
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
    };
  }, [updateVisuals, isMobile]);

  useEffect(() => {
    if (showFullWebsite && window.location.hash) {
      const timer = setTimeout(() => {
        const hash = window.location.hash.substring(1);
        let element = document.getElementById(hash);

        // If element not found, try to map from other language
        if (!element) {
          const otherLocale = locale === 'sk' ? 'en' : 'sk';
          const currentMappings = getSectionMappings(locale);
          const otherMappings = getSectionMappings(otherLocale);

          // Find key in otherMappings that matches hash
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const key = Object.keys(otherMappings).find(k => (otherMappings as any)[k] === hash);

          if (key) {
            // Get corresponding value in currentMappings
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedHash = (currentMappings as any)[key];
            element = document.getElementById(mappedHash);
          }
        }

        if (element) {
          // If we just transitioned to the main site, force instant scroll to top
          // This overrides any smooth scrolling or momentum that might be lingering
          if (justTransitionedRef.current && hash === sectionMap.development) {
             window.scrollTo({ top: 0, behavior: 'instant' });
             justTransitionedRef.current = false;
          } else {
             // Force scroll to top first to ensure we start from top
             if (window.scrollY > 0) {
                window.scrollTo({ top: 0, behavior: 'instant' });
             }
             element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showFullWebsite, locale, sectionMap.development]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='min-h-screen relative overflow-hidden bg-[#050505]'>
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
                style={{ filter: 'drop-shadow(0 0 10px rgba(218, 181, 73, 0.5))' }}
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
              <div className='flex flex-col items-center mb-4 select-none'>
                <h1 className='text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-[linear-gradient(to_right,#DAB549,#FEFBD8,#DAB549,#FEFBD8,#DAB549)] bg-[length:200%_auto] animate-text-shimmer drop-shadow-[0_0_30px_rgba(218,181,73,0.2)] pb-2 leading-tight'>
                  {t('tagline.innovativeSolutions')}
                </h1>
              </div>
              <p className='text-lg md:text-xl text-white/80 font-light select-none px-4'>
                {t('description')}
              </p>
            </div>

            {/* Button - Absolute positioning at bottom to match Overlay */}
            <div className='absolute bottom-24 md:bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6 w-full px-6'>
              <button
                className="group relative w-full max-w-[280px] md:w-auto md:max-w-none py-4 md:px-12 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 focus:outline-none"
                onClick={() => {
                  router.push('/vyvoj');
                }}
              >
                <div className="absolute inset-0 border border-primary rounded-full shadow-[0_0_15px_rgba(218,181,73,0.15)]" />
                <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md rounded-full" />

                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
                </div>

                <span className="relative text-sm font-bold tracking-[0.25em] text-white/90 uppercase drop-shadow-md">
                  {t('discoverMore')}
                </span>
              </button>

              {/* Scroll Indicator Placeholder to match spacing */}
              <div className="w-[24px] h-[40px] rounded-full border-2 border-primary/60 flex justify-center p-1.5 shadow-[0_0_15px_rgba(218,181,73,0.15)] opacity-80">
                <div className="w-1 h-1.5 bg-primary rounded-full" />
              </div>
            </div>
          </div>
        </section>

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
        isReturning={isReturning}
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
        isReturning={isReturning}
        isScrolling={isScrolling}
        triggerTransition={triggerTransition}
        onLogoClick={handleLogoClick}
        shapesState={shapesState}
      />

      <div
        ref={mainContentRef}
        className={`relative transition-all duration-1000 ease-in-out ${showFullWebsite ? 'opacity-100 blur-0' : `opacity-0 ${isMobile ? 'blur-sm' : 'blur-xl'} pointer-events-none`}`}
        style={{
            // If returning, we might want to override the class based opacity with manual control
            // But we do that in updateVisuals.
            // We just need to ensure the transition doesn't fight us if we are scrolling.
            transition: isScrolling ? 'none' : undefined
        }}
      >
          <>
            <div id={sectionMap.development}>
              <Hero contactSectionId={sectionMap.contact} />
            </div>

            <About id={sectionMap.about} />

            <ServicesEnhanced id={sectionMap.services} />

            <Portfolio id={sectionMap.portfolio} />

            <Reviews id={sectionMap.reviews} />

            {latestPosts}

            <MultiStepContactForm id={sectionMap.contact} />

            <Footer />
          </>
      </div>
    </div>
  );
}
