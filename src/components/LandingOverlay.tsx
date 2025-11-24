'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import companyConfig from '@/config/company';
import { SHAPE_CONFIG } from '@/hooks/useFloatingShapes';
import { useIsMobile } from '@/hooks/useIsMobile';
import LanguageSwitcher from './layout/LanguageSwitcher';
import LogoAndText from './layout/LogoAndText';
import { useAnimation } from './providers/AnimationProvider';

interface LandingOverlayProps {
  showFullWebsite: boolean;
  isTransitioning: boolean;
  isReturning?: boolean;
  isScrolling: boolean;
  triggerTransition: () => void;
  onLogoClick: () => void;
  shapesState: { length: number; isExploding: boolean; explosionStartTime: number };
}

export interface LandingOverlayRef {
  updateVisuals: (progress: number) => void;
  setTransition: (transition: string) => void;
}

const LandingOverlay = forwardRef<LandingOverlayRef, LandingOverlayProps>(({
  showFullWebsite,
  isTransitioning,
  isReturning,
  isScrolling,
  triggerTransition,
  onLogoClick,
  shapesState
}, ref) => {
  const t = useTranslations('landing');
  const { animationTime } = useAnimation();
  const isMobile = useIsMobile();

  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const [shiverCycleStart, setShiverCycleStart] = useState(0);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const landingContentRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const bottomActionsRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    updateVisuals: (progress: number) => {
      if (containerRef.current) {
        // Only fade out the content container, not the background
        containerRef.current.style.opacity = `${1 - progress * 1.5}`;
        containerRef.current.style.transform = `scale(${1 + progress * 0.5})`;
        containerRef.current.style.pointerEvents = progress > 0.5 ? 'none' : 'auto';
      }
      if (bottomActionsRef.current) {
        bottomActionsRef.current.style.opacity = `${1 - progress * 2}`;
        bottomActionsRef.current.style.transform = `translate(-50%, ${progress * 50}px)`;
      }
    },
    setTransition: (transition: string) => {
      if (containerRef.current) {
        containerRef.current.style.transition = transition;
      }
    }
  }));

  useEffect(() => {
    setShiverCycleStart(Date.now());
  }, []);

  const handleLogoClick = useCallback(() => {
    onLogoClick();
  }, [onLogoClick]);

  // Removed handleShapesStateChange as it's now managed in GlobalBackground/LandingPage

  const isShivering = useCallback(() => {
    if (isMobile) return false;
    if (isLogoHovered) return false;

    const timeSinceLastInteraction = animationTime - shiverCycleStart;
    const waitTime = 8000;
    const shiverDuration = 1000;
    const totalCycle = waitTime + shiverDuration;

    if (timeSinceLastInteraction < waitTime) {
      return false;
    }

    const timeInShiverCycle = (timeSinceLastInteraction - waitTime) % totalCycle;
    return timeInShiverCycle < shiverDuration;
  }, [animationTime, shiverCycleStart, isLogoHovered, isMobile]);

  const shivering = isShivering();

  const resetShiverCycle = useCallback(() => {
    setShiverCycleStart(Date.now());
  }, []);

  const getMagneticOffset = useCallback((elementX: number, elementY: number, strength: number = 30) => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };

    const deltaX = cursorPositionRef.current.x - elementX;
    const deltaY = cursorPositionRef.current.y - elementY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 150;

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      return {
        x: (deltaX * force * strength) / maxDistance,
        y: (deltaY * force * strength) / maxDistance,
      };
    }
    return { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let lastUpdate = 0;
    const throttleDelay = 16;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      lastUpdate = now;

      cursorPositionRef.current = { x: e.clientX, y: e.clientY };

      if (logoContainerRef.current) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2 - 100;
          const offset = getMagneticOffset(centerX, centerY);
          logoContainerRef.current.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [getMagneticOffset, isMobile]);

  const logoColorFilter = useMemo(() => {
    const shapePercentage = Math.min(shapesState.length / SHAPE_CONFIG.MAX_COUNT, 1.0);

    if (shapePercentage < 0.33) {
      return {
        brightness: 1,
        contrast: 1,
        saturate: 1,
        sepia: 0,
        dropShadowColor: 'rgba(218, 181, 73, 0.8)'
      };
    } else if (shapePercentage < 0.66) {
      const phaseProgress = (shapePercentage - 0.33) / 0.33;
      return {
        brightness: 1 + 0.1 * phaseProgress,
        contrast: 1 + 0.1 * phaseProgress,
        saturate: 1 + 0.1 * phaseProgress,
        sepia: 0,
        dropShadowColor: `rgba(${218 + 20 * phaseProgress}, ${181 + 15 * phaseProgress}, ${73 + 10 * phaseProgress}, ${0.8 + 0.1 * phaseProgress})`
      };
    } else {
      const phaseProgress = (shapePercentage - 0.66) / 0.34;
      return {
        brightness: 1.1 + 0.2 * phaseProgress,
        contrast: 1.1 + 0.1 * phaseProgress,
        saturate: 1.1 + 0.2 * phaseProgress,
        sepia: 0,
        dropShadowColor: `rgba(${238 + 16 * phaseProgress}, ${196 + 59 * phaseProgress}, ${83 + 172 * phaseProgress}, ${0.9 + 0.1 * phaseProgress})`
      };
    }
  }, [shapesState.length]);

  const calculateLogoScale = useCallback(() => {
    if (shapesState.isExploding) {
      const timeSinceExplosion = animationTime - shapesState.explosionStartTime;

      // Animation phases:
      // 0-200ms: Anticipation (scale down slightly)
      // 200-600ms: Explosion (scale up huge)
      // 600-1000ms: Settle (scale back to normal with bounce)

      if (timeSinceExplosion < 200) {
        const progress = timeSinceExplosion / 200;
        return 1.0 - (progress * 0.2); // Scale down to 0.8
      } else if (timeSinceExplosion < 600) {
        const progress = (timeSinceExplosion - 200) / 400;
        // Elastic ease out
        return 0.8 + (progress * 1.7); // Scale up to 2.5
      } else if (timeSinceExplosion < 1200) {
        const progress = (timeSinceExplosion - 600) / 600;
        // Bounce back to 1.0
        return 2.5 - (progress * 1.5);
      }

      return 1.0;
    }
    const objectCount = shapesState.length;
    const scale = 1.0 + (objectCount * 0.05);
    return Math.min(scale, SHAPE_CONFIG.LOGO_SCALE_MAX);
  }, [shapesState.length, shapesState.isExploding, shapesState.explosionStartTime, animationTime]);

  const getExplosionRotation = useCallback(() => {
    if (!shapesState.isExploding) return 0;

    const timeSinceExplosion = animationTime - shapesState.explosionStartTime;

    if (timeSinceExplosion < 200) {
      return (Math.random() - 0.5) * 10; // Shake
    } else if (timeSinceExplosion < 1000) {
      // Spin fast
      return (timeSinceExplosion - 200) * 2;
    }

    return 0;
  }, [shapesState.isExploding, shapesState.explosionStartTime, animationTime]);

  const getExplosionFilter = useCallback(() => {
    if (!shapesState.isExploding) return null;

    const timeSinceExplosion = animationTime - shapesState.explosionStartTime;

    if (timeSinceExplosion > 200 && timeSinceExplosion < 800) {
      const progress = (timeSinceExplosion - 200) / 600;
      const intensity = Math.sin(progress * Math.PI); // 0 -> 1 -> 0

      return {
        brightness: 1 + intensity * 2, // Super bright
        dropShadow: `0 0 ${50 * intensity}px rgba(255, 215, 0, ${intensity})`
      };
    }

    return null;
  }, [shapesState.isExploding, shapesState.explosionStartTime, animationTime]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden ${
        showFullWebsite
          ? 'opacity-0 pointer-events-none'
          : 'opacity-100 pointer-events-none z-50'
      }`}
      style={{
          transition: (showFullWebsite || isTransitioning)
            ? 'all 1s ease-in-out'
            : (isScrolling ? 'all 0.1s ease-out' : 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)'),
          opacity: (showFullWebsite || isTransitioning) && !isReturning ? 0 : undefined,
          transform: (showFullWebsite || isTransitioning) && !isReturning ? 'scale(1.5)' : undefined,
          pointerEvents: showFullWebsite ? 'none' : undefined,
          visibility: (showFullWebsite && !isReturning) ? 'hidden' : 'visible'
      }}
    >
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 pointer-events-auto">
          <LogoAndText />
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>

        <section id="hero" className='relative z-10 flex items-center justify-center px-6 min-h-screen'>
          <div ref={landingContentRef} className='text-center max-w-3xl pointer-events-auto'>
            <div className='mb-8 relative'>
              <div
                ref={logoContainerRef}
                className='inline-block transition-transform duration-300 ease-out cursor-pointer group relative'
                style={{
                  transform: 'translate(0, 0)',
                }}
                onClick={isMobile ? undefined : handleLogoClick}
                onMouseEnter={() => {
                  if (isMobile) return;
                  setIsLogoHovered(true);
                  resetShiverCycle();
                }}
                onMouseLeave={() => {
                  if (isMobile) return;
                  setIsLogoHovered(false);
                  resetShiverCycle();
                }}
              >
                {!isMobile && (
                  <div
                    className={`absolute -top-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 pointer-events-none z-50 ${
                      shivering ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-light whitespace-nowrap select-none block">
                      {t('clickMe')}!
                    </span>
                  </div>
                )}
                <div
                  style={{
                    transform: `
                      scale(${calculateLogoScale() + (isLogoHovered ? 0.2 : 0)})
                      rotate(${isLogoHovered ? 5 : (shapesState.isExploding ? getExplosionRotation() : (isShivering() ? Math.sin(animationTime * 0.02) * 12 : 0))}deg)
                      translateX(${Math.sin(animationTime * 0.003) * 3}px)
                    `,
                    transition: shapesState.isExploding ? 'none' : 'transform 0.2s ease-out',
                  }}
                >
                  <Image
                    src={companyConfig.website.logo.logoGoldTransparent}
                    alt={companyConfig.company.name}
                    width={120}
                    height={120}
                    className='mx-auto cursor-pointer select-none'
                    style={{
                      filter: shapesState.isExploding ? `
                        brightness(${getExplosionFilter()?.brightness || 1})
                        drop-shadow(${getExplosionFilter()?.dropShadow || 'none'})
                      ` : (isMobile ? `
                        brightness(1.1)
                        contrast(1.1)
                        drop-shadow(0 0 25px rgba(218, 181, 73, 0.5))
                      ` : `
                        brightness(${logoColorFilter.brightness * (isLogoHovered ? 1.2 : 1)})
                        contrast(${logoColorFilter.contrast * (isLogoHovered ? 1.1 : 1)})
                        saturate(${logoColorFilter.saturate * (isLogoHovered ? 1.1 : 1)})
                        sepia(${logoColorFilter.sepia})
                        drop-shadow(0 0 ${SHAPE_CONFIG.LOGO_GLOW_RADIUS * (isLogoHovered ? 1.5 : 1)}px ${logoColorFilter.dropShadowColor})
                      `),
                      transition: shapesState.isExploding ? 'none' : 'filter 0.2s ease-out',
                    }}
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            <div className='mb-12'>
              <div
                className='flex flex-col items-center mb-4 transition-all duration-500 select-none'
                style={{
                  transform: `translateY(${Math.sin(animationTime * 0.001) * 3}px)`,
                }}
              >
                <h1 className='text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-[linear-gradient(to_right,#DAB549,#FEFBD8,#DAB549,#FEFBD8,#DAB549)] bg-[length:200%_auto] animate-text-shimmer drop-shadow-[0_0_30px_rgba(218,181,73,0.2)] pb-2 leading-tight'>
                  {t('tagline.innovativeSolutions')}
                </h1>
              </div>
              <p
                className='text-lg md:text-xl text-white/80 font-light transition-all duration-700 select-none px-4'
                style={{
                  transform: `translateY(${Math.sin(animationTime * 0.001 + 1) * 2}px)`,
                }}
              >
                {t('description')}
              </p>
            </div>

            <div
              ref={bottomActionsRef}
              className={`absolute bottom-24 md:bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6 transition-all duration-500 w-full px-6 ${isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
              style={{
                opacity: isTransitioning ? 0 : 1,
                transform: 'translate(-50%, 0)'
              }}
            >
              <button
                onClick={triggerTransition}
                className="group relative w-full max-w-[280px] md:w-auto md:max-w-none py-4 md:px-12 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 focus:outline-none"
              >
                <div className="absolute inset-0 border border-primary rounded-full shadow-[0_0_15px_rgba(218,181,73,0.15)] group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(218,181,73,0.4)] transition-all duration-500" />
                <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md rounded-full group-hover:bg-primary/10 transition-all duration-500" />

                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-sheen" />
                </div>

                <span className="relative text-sm font-bold tracking-[0.25em] text-white/90 group-hover:text-primary transition-colors duration-300 uppercase drop-shadow-md">
                  {t('discoverMore')}
                </span>
              </button>

              <div
                className="flex flex-col items-center gap-2 cursor-pointer group/scroll"
                onClick={triggerTransition}
              >
                <div className="w-[24px] h-[40px] rounded-full border-2 border-primary/60 flex justify-center p-1.5 shadow-[0_0_15px_rgba(218,181,73,0.15)] group-hover/scroll:border-primary group-hover/scroll:shadow-[0_0_20px_rgba(218,181,73,0.3)] transition-all duration-300">
                  <div className="w-1 h-1.5 bg-primary rounded-full animate-bounce group-hover/scroll:bg-white transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-center pointer-events-auto">
          <p className="text-white/60 text-sm select-none">
            © 2025 Rise.sk s.r.o. Všetky práva vyhradené.
          </p>
        </div>
    </div>
  );
});

LandingOverlay.displayName = 'LandingOverlay';

export default LandingOverlay;
