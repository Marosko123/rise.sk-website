'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import companyConfig from '@/config/company';
import { SHAPE_CONFIG } from '@/hooks/useFloatingShapes';
import { useParticles } from '@/hooks/useParticles';
import { useAnimation } from './providers/AnimationProvider';
import MouseTrail from './animations/MouseTrail';
import FloatingShapes, { FloatingShapesRef } from './animations/FloatingShapes';
import LogoAndText from './layout/LogoAndText';
import LanguageSwitcher from './layout/LanguageSwitcher';

interface LandingOverlayProps {
  showFullWebsite: boolean;
  isTransitioning: boolean;
  isScrolling: boolean;
  triggerTransition: () => void;
  mounted: boolean;
}

export interface LandingOverlayRef {
  updateVisuals: (progress: number) => void;
}

const LandingOverlay = forwardRef<LandingOverlayRef, LandingOverlayProps>(({
  showFullWebsite,
  isTransitioning,
  isScrolling,
  triggerTransition,
  mounted
}, ref) => {
  const t = useTranslations('landing');
  const { animationTime } = useAnimation();
  
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const [shiverCycleStart, setShiverCycleStart] = useState(0);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  const backgroundLogoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const landingContentRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const bottomActionsRef = useRef<HTMLDivElement>(null);
  const floatingShapesRef = useRef<FloatingShapesRef>(null);
  const [shapesState, setShapesState] = useState({ length: SHAPE_CONFIG.INITIAL_COUNT, isExploding: false, explosionStartTime: 0 });

  const { particles, createExplosion } = useParticles();

  useImperativeHandle(ref, () => ({
    updateVisuals: (progress: number) => {
      if (containerRef.current) {
        containerRef.current.style.transform = `scale(${1 + progress * 0.15})`;
        containerRef.current.style.filter = `blur(${progress * 2}px)`;
        containerRef.current.style.opacity = `${1 - progress * 0.2}`;
      }
      if (bottomActionsRef.current) {
        bottomActionsRef.current.style.opacity = `${1 - progress * 2}`;
        bottomActionsRef.current.style.transform = `translate(-50%, ${progress * 50}px)`;
      }
    }
  }));

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const updateWindowSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 100);
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    setShiverCycleStart(Date.now());
  }, []);

  const handleLogoClick = useCallback(() => {
    floatingShapesRef.current?.handleLogoClick();
  }, []);

  const handleShapesStateChange = useCallback((length: number, isExploding: boolean, explosionStartTime?: number) => {
    setShapesState({ length, isExploding, explosionStartTime: explosionStartTime || 0 });
  }, []);

  const isShivering = useCallback(() => {
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
    let lastUpdate = 0;
    const throttleDelay = 16;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      lastUpdate = now;

      cursorPositionRef.current = { x: e.clientX, y: e.clientY };

      if (backgroundLogoRef.current) {
         const x = (e.clientX / window.innerWidth) * 100;
         const y = (e.clientY / window.innerHeight) * 100;
         backgroundLogoRef.current.style.transform = `translate3d(${(x - 50) * 0.1}px, ${(y - 50) * 0.1}px, 0)`;
      }

      if (logoContainerRef.current) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2 - 100;
          const offset = getMagneticOffset(centerX, centerY);
          logoContainerRef.current.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
      }
    };

    const handleClick = (e: MouseEvent) => {
      createExplosion(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [createExplosion, getMagneticOffset]);

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
            ? 'all 1s ease-in-out'
            : (isScrolling ? 'all 0.1s ease-out' : 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)')
      }}
    >
        <div className='absolute inset-0'>
          <FloatingShapes
            ref={floatingShapesRef}
            cursorPositionRef={cursorPositionRef}
            windowSize={windowSize}
            mounted={mounted && !showFullWebsite}
            onStateChange={handleShapesStateChange}
          />

          <div
            ref={backgroundLogoRef}
            className='absolute inset-0 flex items-center justify-center'
            style={{
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            <Image
              src={companyConfig.website.logo.logoGoldTransparent}
              alt={companyConfig.company.name}
              width={600}
              height={600}
              priority
              className='select-none pointer-events-none'
              style={{
                opacity: 0.04,
              }}
            />
          </div>

          <MouseTrail />

          {particles.map((particle) => (
            <div
              key={particle.id}
              className='absolute w-1.5 h-1.5 rounded-full pointer-events-none select-none will-change-transform'
              style={{
                transform: `translate3d(${particle.x}px, ${particle.y}px, 0) scale(${particle.life / particle.maxLife})`,
                backgroundColor: '#B09155',
                opacity: particle.life / particle.maxLife,
              }}
            />
          ))}

          <div className='absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20'></div>
        </div>

        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
          <LogoAndText />
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>

        <section id="hero" className='relative z-10 flex items-center justify-center px-6 min-h-screen'>
          <div ref={landingContentRef} className='text-center max-w-3xl'>
            <div className='mb-8'>
              <div
                ref={logoContainerRef}
                className='inline-block transition-transform duration-300 ease-out cursor-pointer group'
                style={{
                  transform: 'translate(0, 0)',
                }}
                onClick={handleLogoClick}
              >
                <Image
                  src={companyConfig.website.logo.logoGoldTransparent}
                  alt={companyConfig.company.name}
                  width={120}
                  height={120}
                  className='mx-auto cursor-pointer select-none'
                  style={{
                    transform: `
                      scale(${calculateLogoScale() + (isLogoHovered ? 0.2 : 0)})
                      rotate(${isLogoHovered ? 5 : (shapesState.isExploding ? getExplosionRotation() : (isShivering() ? Math.sin(animationTime * 0.02) * 12 : 0))}deg)
                      translateX(${Math.sin(animationTime * 0.003) * 3}px)
                    `,
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
                    transition: shapesState.isExploding ? 'none' : 'transform 0.2s ease-out, filter 0.2s ease-out',
                  }}
                  draggable={false}
                  onMouseEnter={() => {
                    setIsLogoHovered(true);
                    resetShiverCycle();
                  }}
                  onMouseLeave={() => {
                    setIsLogoHovered(false);
                    resetShiverCycle();
                  }}
                />
              </div>
            </div>

            <div className='mb-12'>
              <h1
                className='text-4xl md:text-5xl font-bold text-white mb-4 transition-all duration-500 select-none'
                style={{
                  transform: `translateY(${Math.sin(animationTime * 0.001) * 3}px)`,
                  textShadow: '0 0 30px rgba(176, 145, 85, 0.3)',
                }}
              >
                {t('tagline.weAre')} <span className='text-primary'>{t('tagline.innovativeSolutions')}</span>
              </h1>
              <p
                className='text-xl text-white/80 font-light transition-all duration-700 select-none'
                style={{
                  transform: `translateY(${Math.sin(animationTime * 0.001 + 1) * 2}px)`,
                }}
              >
                {t('description')}
              </p>
            </div>

            <div
              ref={bottomActionsRef}
              className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
              style={{
                opacity: isTransitioning ? 0 : 1,
                transform: 'translate(-50%, 0)'
              }}
            >
              <button
                onClick={triggerTransition}
                className="group relative px-12 py-4 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 focus:outline-none"
              >
                <div className="absolute inset-0 border border-primary/70 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-500" />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-full group-hover:bg-primary/10 transition-all duration-500" />

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
                <div className="w-[24px] h-[40px] rounded-full border-2 border-primary/60 flex justify-center p-1.5 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover/scroll:border-primary group-hover/scroll:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300">
                  <div className="w-1 h-1.5 bg-primary rounded-full animate-bounce group-hover/scroll:bg-white transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-center">
          <p className="text-white/60 text-sm select-none">
            © 2025 Rise.sk s.r.o. Všetky práva vyhradené.
          </p>
        </div>
    </div>
  );
});

LandingOverlay.displayName = 'LandingOverlay';

export default LandingOverlay;
