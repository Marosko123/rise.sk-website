'use client';

import { m as motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import companyConfig from '@/config/company';
import { SHAPE_CONFIG } from '@/hooks/useFloatingShapes';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils/cn';
import LanguageSwitcher from './layout/LanguageSwitcher';
import LogoAndText from './layout/LogoAndText';
import { useAnimationTime } from './providers/AnimationProvider';

interface LandingOverlayProps {
  showFullWebsite: boolean;
  isTransitioning: boolean;
  isScrolling: boolean;
  triggerTransition: () => void;
  mounted: boolean;
  onLogoClick: () => void;
  shapesState: { length: number; isExploding: boolean; explosionStartTime?: number };
}

export interface LandingOverlayRef {
  updateVisuals: (progress: number) => void;
}

const LandingOverlay = forwardRef<LandingOverlayRef, LandingOverlayProps>(({
  showFullWebsite,
  isTransitioning,
  isScrolling,
  triggerTransition,
  onLogoClick,
  shapesState
}, ref) => {
  const t = useTranslations('landing');
  const tCommon = useTranslations('common');
  const animationTime = useAnimationTime();
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
      // Enhanced easing - exponential for dramatic "pull-in" effect
      // Starts slow, accelerates dramatically as user commits to scroll
      const easedProgress = Math.pow(progress, 2.5);

      // Secondary easing for subtle elements (more linear)
      const subtleEase = 1 - Math.pow(1 - progress, 2);

      if (containerRef.current) {
        // IMMERSIVE PULL-IN EFFECT:
        // - Scale zooms toward user (1.0 → 2.0) like diving into the screen
        // - Perspective adds 3D depth as content "falls away"
        // - Blur increases dramatically as content recedes
        const scale = 1 + easedProgress * 1.0; // More dramatic zoom (1.0 → 2.0)
        const translateZ = easedProgress * 200; // 3D depth movement
        const rotateX = easedProgress * -5; // Subtle tilt adds dimension

        containerRef.current.style.transform = `
          perspective(1000px)
          scale(${scale})
          translateZ(${translateZ}px)
          rotateX(${rotateX}deg)
        `;

        // Progressive blur - subtle at first, intense at end
        containerRef.current.style.filter = `blur(${easedProgress * 20}px)`;

        // Opacity fades more dramatically toward the end
        containerRef.current.style.opacity = `${1 - easedProgress * 0.9}`;
      }

      if (bottomActionsRef.current) {
        // Bottom actions disappear quickly with elegant slide-down
        bottomActionsRef.current.style.opacity = `${1 - progress * 2.5}`;
        bottomActionsRef.current.style.transform = `translateY(${subtleEase * 50}px) scale(${1 - subtleEase * 0.2})`;
      }
    }
  }));

  useEffect(() => {
    setShiverCycleStart(Date.now());
  }, []);

  const handleLogoClick = useCallback(() => {
    onLogoClick();
  }, [onLogoClick]);

  const isShivering = useCallback(() => {
    if (isLogoHovered) return false;

    const timeSinceLastInteraction = animationTime - shiverCycleStart;
    const waitTime = 3000; // Reduced from 8s to 3s for quicker hint
    const shiverDuration = 2000; // Increased from 1s to 2s for better visibility
    const totalCycle = waitTime + shiverDuration;

    if (timeSinceLastInteraction < waitTime) {
      return false;
    }

    const timeInShiverCycle = (timeSinceLastInteraction - waitTime) % totalCycle;
    return timeInShiverCycle < shiverDuration;
  }, [animationTime, shiverCycleStart, isLogoHovered]);

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
    // Skip on mobile - no mouse to track
    if (isMobile) return;

    // No throttling - instant response
    const handleMouseMove = (e: MouseEvent) => {
      cursorPositionRef.current = { x: e.clientX, y: e.clientY };

      if (logoContainerRef.current) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2 - 100;
          const offset = getMagneticOffset(centerX, centerY, 50); // Stronger magnetic effect
          logoContainerRef.current.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

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
        dropShadowColor: 'rgba(176, 145, 85, 0.8)'
      };
    } else if (shapePercentage < 0.66) {
      const phaseProgress = (shapePercentage - 0.33) / 0.33;
      return {
        brightness: 1 + 0.2 * phaseProgress,
        contrast: 1 + 0.2 * phaseProgress,
        saturate: 1 + 0.4 * phaseProgress,
        sepia: 0.1 * phaseProgress,
        dropShadowColor: `rgba(${176 + 20 * phaseProgress}, ${145 + 15 * phaseProgress}, ${85 + 10 * phaseProgress}, ${0.8 + 0.1 * phaseProgress})`
      };
    } else {
      const phaseProgress = (shapePercentage - 0.66) / 0.34;
      return {
        brightness: 1.2 + 0.5 * phaseProgress,
        contrast: 1.2 + 0.3 * phaseProgress,
        saturate: 1.4 + 0.8 * phaseProgress,
        sepia: 0.1 + 0.3 * phaseProgress,
        dropShadowColor: `rgba(${196 + 59 * phaseProgress}, ${160 + 95 * phaseProgress}, ${95 + 160 * phaseProgress}, ${0.9 + 0.1 * phaseProgress})`
      };
    }
  }, [shapesState.length]);

  const calculateLogoScale = useCallback(() => {
    if (shapesState.isExploding) {
      return 1.0;
    }
    const objectCount = shapesState.length;
    const scale = 1.0 + (objectCount * 0.05);
    return Math.min(scale, SHAPE_CONFIG.LOGO_SCALE_MAX);
  }, [shapesState.length, shapesState.isExploding]);

  const getExplosionRotation = useCallback(() => {
    if (!shapesState.isExploding || !shapesState.explosionStartTime) return 0;

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
    if (!shapesState.isExploding || !shapesState.explosionStartTime) return null;

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
          ? '!opacity-0 pointer-events-none -z-10'
          : 'opacity-100 pointer-events-auto z-50'
      }`}
      style={{
          ...((showFullWebsite || isTransitioning) ? {
            transform: 'scale(1.5)',
            filter: 'blur(20px)',
            opacity: 0,
          } : {}),
          transition: (showFullWebsite || isTransitioning)
            ? 'all 0.4s ease-out'
            : (isScrolling ? 'all 0.1s ease-out' : 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)')
      }}
    >
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 pointer-events-auto">
          <LogoAndText />
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>

        <section id="hero" className='relative z-10 flex items-center justify-center px-6 min-h-[100dvh]'>
          <div ref={landingContentRef} className='text-center max-w-3xl pointer-events-auto'>
            <div className='mb-8 relative'>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div
                  ref={logoContainerRef}
                  className='inline-block transition-transform duration-300 ease-out cursor-pointer group relative'
                  style={{
                    transform: 'translate(0, 0)',
                  }}
                  onClick={handleLogoClick}
                  onMouseEnter={() => {
                    setIsLogoHovered(true);
                    resetShiverCycle();
                  }}
                  onMouseLeave={() => {
                    setIsLogoHovered(false);
                    resetShiverCycle();
                  }}
                >
                  {/* Pulsing ring effect - shows when shivering or hovered (desktop only) */}
                  {!isMobile && (
                    <div
                      className={`absolute inset-0 -m-4 rounded-full transition-all duration-500 ${
                        isShivering() || isLogoHovered
                          ? 'opacity-100 scale-110'
                          : 'opacity-0 scale-100'
                      }`}
                      style={{
                        border: '2px solid rgba(212, 175, 55, 0.4)',
                        boxShadow: '0 0 20px rgba(212, 175, 55, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.1)',
                        animation: isShivering() ? 'pulse 1.5s ease-in-out infinite' : 'none',
                      }}
                    />
                  )}
                  {/* Second ring for layered effect (desktop only) */}
                  {!isMobile && (
                    <div
                      className={`absolute inset-0 -m-8 rounded-full transition-all duration-700 delay-100 ${
                        isShivering()
                          ? 'opacity-60 scale-115'
                          : 'opacity-0 scale-100'
                      }`}
                      style={{
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        animation: isShivering() ? 'pulse 2s ease-in-out infinite 0.3s' : 'none',
                      }}
                    />
                  )}
                  {/* Enhanced hint text (desktop only) */}
                  {!isMobile && (
                    <div
                      className={`absolute -top-10 left-1/2 transform -translate-x-1/2 transition-all duration-500 pointer-events-none z-50 ${
                        isShivering() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <span className="text-xs text-primary/90 uppercase tracking-[0.15em] font-medium whitespace-nowrap select-none block px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-primary/30">
                        ✨ {t('clickMe')}!
                      </span>
                    </div>
                  )}

                  <div
                    className={cn(
                      'animate-logo-float',
                      shapesState.isExploding && 'animation-paused'
                    )}
                    style={{
                      transform: `
                        scale(${calculateLogoScale() + (isLogoHovered ? 0.2 : 0)})
                        rotate(${isLogoHovered ? 5 : (shapesState.isExploding ? getExplosionRotation() : (isShivering() ? Math.sin(Date.now() * 0.008) * 8 : 0))}deg)
                      `,
                      transition: shapesState.isExploding ? 'none' : 'transform 0.15s ease-out',
                    }}
                  >
                    <Image
                      src={companyConfig.website.logo.logoGoldTransparent}
                      alt={companyConfig.company.name}
                      width={120}
                      height={120}
                      priority
                      fetchPriority="high"
                      className='mx-auto cursor-pointer select-none'
                      style={{
                        filter: shapesState.isExploding ? `
                          brightness(${getExplosionFilter()?.brightness || 1})
                          drop-shadow(${getExplosionFilter()?.dropShadow || 'none'})
                        ` : `
                          brightness(${logoColorFilter.brightness * (isLogoHovered ? 1.2 : 1)})
                          contrast(${logoColorFilter.contrast * (isLogoHovered ? 1.1 : 1)})
                          saturate(${logoColorFilter.saturate * (isLogoHovered ? 1.1 : 1)})
                          sepia(${logoColorFilter.sepia})
                          drop-shadow(0 0 ${SHAPE_CONFIG.LOGO_GLOW_RADIUS * (isLogoHovered ? 1.5 : 1)}px ${logoColorFilter.dropShadowColor})
                        `,
                        transition: shapesState.isExploding ? 'none' : 'filter 0.2s ease-out',
                      }}
                      draggable={false}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className='mb-12'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                <h1
                  className='text-4xl md:text-5xl font-bold text-white mb-4 select-none animate-gentle-float'
                  style={{
                    textShadow: '0 0 30px rgba(176, 145, 85, 0.3)',
                  }}
                >
                  {t('tagline.weAre')} <span className='text-primary'>{t('tagline.innovativeSolutions')}</span>
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <p
                  className='text-xl text-white/80 font-light select-none animate-gentle-float-alt'
                >
                  {t('description')}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              className="mt-12 lg:mt-32 flex justify-center"
            >
                <button
                  onClick={triggerTransition}
                  className="group relative px-12 py-4 overflow-hidden rounded-full transition-all duration-300 hover:scale-105 focus:outline-none"
                >
                  <div className="absolute inset-0 border border-primary/70 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300" />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-full group-hover:bg-primary/10 transition-all duration-300" />

                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-sheen" />
                  </div>

                  <span className="relative text-sm font-bold tracking-[0.25em] text-white/90 group-hover:text-primary transition-colors duration-300 uppercase drop-shadow-md">
                    {t('discoverMore')}
                  </span>
                </button>
            </motion.div>
          </div>
        </section>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto"
        >
            <div
                ref={bottomActionsRef}
                className={`flex flex-col items-center gap-2 cursor-pointer group/scroll transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
                onClick={triggerTransition}
                style={{
                  opacity: isTransitioning ? 0 : 1,
                }}
            >
                <div className="w-[24px] h-[40px] rounded-full border-2 border-primary/60 flex justify-center p-1.5 shadow-[0_0_15px_rgba(218,181,73,0.15)] group-hover/scroll:border-primary group-hover/scroll:shadow-[0_0_20px_rgba(218,181,73,0.3)] transition-all duration-300">
                    <div className="w-1 h-1.5 bg-primary rounded-full animate-bounce group-hover/scroll:bg-white transition-colors duration-300" />
                </div>
            </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-center pointer-events-auto">
          <p className="text-white/60 text-sm select-none">
            © {new Date().getFullYear()} Rise.sk s.r.o. {tCommon('allRightsReserved')}.
          </p>
        </div>
    </div>
  );
});

LandingOverlay.displayName = 'LandingOverlay';

export default LandingOverlay;
