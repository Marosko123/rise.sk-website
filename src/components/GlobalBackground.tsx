'use client';

import companyConfig from '@/config/company';
import { useIsMobile } from '@/hooks/useIsMobile';
import { m, MotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FloatingShapesRef } from './animations/FloatingShapes';

// Dynamic imports for heavy animations
const FloatingShapes = dynamic(() => import('./animations/FloatingShapes'), { ssr: false });
const InteractiveParticles = dynamic(() => import('./animations/InteractiveParticles'), { ssr: false });
const MouseTrail = dynamic(() => import('./animations/MouseTrail'), { ssr: false });

// Simple random number generator
const random = (min: number, max: number) => Math.random() * (max - min) + min;

interface Particle {
  id: number;
  top: string;
  left: string;
  size: string;
  opacity: number;
  duration: string;
  delay: string;
  tx: string;
  ty: string;
  depth: number;
}

const ParallaxParticle = ({ particle, scrollY }: { particle: Particle, scrollY: MotionValue<number> }) => {
  // Parallax effect: move particles up as we scroll down
  // depth factor determines speed: higher depth = faster movement (closer)
  // We use negative value to move up
  const y = useTransform(scrollY, (val: number) => -(val * particle.depth));

  return (
    <m.div
      className="absolute"
      style={{
        top: particle.top,
        left: particle.left,
        width: particle.size,
        height: particle.size,
        y
      }}
    >
      <div
        className="w-full h-full rounded-full bg-[#DAB549] animate-float-particle"
        style={{
          '--particle-opacity': particle.opacity,
          '--duration': particle.duration,
          '--delay': particle.delay,
          '--tx': particle.tx,
          '--ty': particle.ty,
        } as React.CSSProperties}
      />
    </m.div>
  );
};

const BackgroundParticles = ({ count = 60, mounted, isMobile }: { count?: number; mounted: boolean; isMobile: boolean }) => {
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 50, damping: 20, restDelta: 0.001 });

  const particles = useMemo(() => {
    if (!mounted || isMobile) return [];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${random(0, 100)}%`,
      left: `${random(0, 100)}%`,
      size: `${random(1, 4)}px`,
      opacity: random(0.1, 0.6),
      duration: `${random(20, 40)}s`,
      delay: `${random(0, 10)}s`,
      tx: `${random(-30, 30)}px`,
      ty: `${random(-30, 30)}px`,
      depth: random(0.2, 1.5), // Increased depth range for more 3D feel
    }));
  }, [count, mounted, isMobile]);

  if (!mounted || isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <ParallaxParticle key={p.id} particle={p} scrollY={smoothScrollY} />
      ))}
    </div>
  );
};

interface GlobalBackgroundProps {
  mounted: boolean;
  showFullWebsite: boolean;
  isTransitioning?: boolean;
  isReturning?: boolean;
  isScrolling?: boolean;
  onShapesStateChange?: (length: number, isExploding: boolean, explosionStartTime?: number) => void;
}

export interface GlobalBackgroundRef {
  handleLogoClick: () => void;
  updateVisuals: (progress: number) => void;
  setTransition: (transition: string) => void;
  resetVisuals: () => void;
}

const GlobalBackground = forwardRef<GlobalBackgroundRef, GlobalBackgroundProps>(({ mounted, showFullWebsite, isTransitioning, isReturning, isScrolling, onShapesStateChange }, ref) => {
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const landingBgRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 0, height: 0 };
  });
  const floatingShapesRef = useRef<FloatingShapesRef>(null);
  const backgroundLogoRef = useRef<HTMLDivElement>(null);
  // const mainBgRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  useImperativeHandle(ref, () => ({
    handleLogoClick: () => {
      floatingShapesRef.current?.handleLogoClick();
    },
    updateVisuals: (progress: number) => {
      // Apply easing for smoother animation (ease-out cubic)
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      if (landingBgRef.current) {
        // More dramatic zoom-out effect
        landingBgRef.current.style.transform = `scale(${1 + easedProgress * 0.3})`;
        landingBgRef.current.style.opacity = `${1 - easedProgress * 0.1}`; // Minimal fade to avoid black void
        landingBgRef.current.style.filter = `blur(${easedProgress * 6}px)`;
      }
    },
    setTransition: (transition: string) => {
      if (landingBgRef.current) {
        landingBgRef.current.style.transition = transition;
      }
    },
    resetVisuals: () => {
      if (landingBgRef.current) {
        landingBgRef.current.style.opacity = '';
        landingBgRef.current.style.transform = '';
        landingBgRef.current.style.filter = '';
        landingBgRef.current.style.transition = '';
      }
    }
  }));

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    const initialHeight = window.innerHeight;
    let lastWidth = window.innerWidth;

    const updateWindowSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;

        // On mobile, ignore height-only changes caused by browser toolbar hide/show during scroll
        // Only update if width actually changed
        if (isMobile) {
          if (currentWidth === lastWidth) {
            return; // Height-only change from browser chrome, ignore
          }
        }

        lastWidth = currentWidth;
        // On mobile, use initial height to prevent jank from browser chrome resizing
        setWindowSize({
          width: currentWidth,
          height: isMobile ? initialHeight : currentHeight
        });
      }, 150);
    };

    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
      clearTimeout(resizeTimeout);
    };
  }, [isMobile]);

  useEffect(() => {
    if (showFullWebsite) return; // Don't track mouse when not on landing page

    let lastUpdate = 0;
    const throttleDelay = 16;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      lastUpdate = now;

      cursorPositionRef.current = { x: e.clientX, y: e.clientY };

      if (backgroundLogoRef.current) {
         const x = (e.clientX / window.innerWidth) * 100;
         const y = (e.clientY / window.innerHeight) * 100;
         backgroundLogoRef.current.style.transform = `translate3d(${(x - 50) * 0.1}px, ${(y - 50) * 0.1}px, 0)`;
      }
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [showFullWebsite, isMobile]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Landing Page Background - Fades out when full website is shown */}
      <div
        ref={landingBgRef}
        className={`absolute inset-0 bg-[#000000]`}
        style={{
          transition: (showFullWebsite || isTransitioning)
            ? 'all 1s ease-in-out'
            : (isScrolling ? 'transform 0.1s ease-out, opacity 0.1s ease-out, filter 0.1s ease-out' : 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)'),
          opacity: (showFullWebsite || isTransitioning) && !isReturning ? 0 : undefined,
          transform: (showFullWebsite || isTransitioning) && !isReturning ? 'scale(1.5)' : undefined,
          filter: (showFullWebsite || isTransitioning) && !isReturning ? 'blur(10px)' : undefined,
          pointerEvents: (showFullWebsite && !isReturning) ? 'none' : undefined
        }}
      >
        {!showFullWebsite && (
          <>
            {/* --- ENHANCED RISE GRADIENT SYSTEM --- */}

            {/* 1. Warm Rich Base - Deep bronze to black gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2a1f0f_0%,#0a0705_50%,#000000_100%)] opacity-90 pointer-events-none"></div>

            {/* 2. Animated Mesh Gradient Overlay */}
            <div className="absolute inset-0 opacity-60 pointer-events-none mix-blend-screen">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(218,181,73,0.25)_0%,transparent_50%)] animate-pulse-slow"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,103,35,0.25)_0%,transparent_50%)] animate-pulse-slow animation-delay-2000"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,251,216,0.15)_0%,transparent_40%)] animate-pulse-slow animation-delay-4000"></div>
            </div>

            {/* 3. Static Conic Sheen - Metallic shimmer effect (removed rotation for performance) */}
            <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-[0.15] pointer-events-none mix-blend-screen">
              <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,transparent_0deg,rgba(218,181,73,0.15)_60deg,transparent_120deg,transparent_180deg,rgba(139,103,35,0.15)_240deg,transparent_300deg)] blur-[40px]"></div>
            </div>

            {/* 4. Large Premium Glows - Enhanced presence */}
            {isMobile ? (
              <>
                {/* Mobile: Static background - NO ANIMATIONS for maximum performance */}
                <div className="absolute top-[-15%] right-[-10%] w-[85vw] h-[85vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.25)_0%,rgba(218,181,73,0.1)_30%,transparent_70%)] blur-[50px] pointer-events-none mix-blend-screen"></div>
                <div className="absolute bottom-[-15%] left-[-10%] w-[85vw] h-[85vw] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.25)_0%,rgba(139,103,35,0.1)_30%,transparent_70%)] blur-[50px] pointer-events-none mix-blend-screen"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.15)_0%,transparent_70%)] blur-[40px] pointer-events-none mix-blend-screen"></div>
              </>
            ) : (
              <>
                {/* Desktop: Rich animated glows */}
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.18)_0%,rgba(218,181,73,0.08)_40%,transparent_70%)] blur-[80px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.2)_0%,rgba(139,103,35,0.1)_40%,transparent_70%)] blur-[80px] pointer-events-none mix-blend-screen animate-pulse-slow animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(255,250,205,0.08)_0%,rgba(254,251,216,0.04)_50%,transparent_70%)] blur-[70px] pointer-events-none mix-blend-screen animate-pulse-slow animation-delay-6000"></div>
              </>
            )}

            {/* 5. Floating Accent Orbs - Dynamic movement */}
            {!isMobile && (
              <>
                <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.12)_0%,transparent_70%)] blur-[60px] animate-float-slow pointer-events-none"></div>
                <div className="absolute bottom-[30%] right-[20%] w-[25%] h-[25%] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.12)_0%,transparent_70%)] blur-[60px] animate-float-slow animation-delay-2000 pointer-events-none"></div>
                <div className="absolute top-[40%] right-[30%] w-[20%] h-[20%] rounded-full bg-[radial-gradient(circle,rgba(254,251,216,0.1)_0%,transparent_70%)] blur-[50px] animate-float-slow animation-delay-3000 pointer-events-none"></div>
              </>
            )}

            {/* Ambient Particles for Landing Page - Optimized for mobile */}
            <BackgroundParticles count={isMobile ? 20 : 60} mounted={mounted} isMobile={false} />

            <FloatingShapes
              ref={floatingShapesRef}
              cursorPositionRef={cursorPositionRef}
              windowSize={windowSize}
              mounted={mounted}
              isMobile={isMobile}
              onStateChange={onShapesStateChange}
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
                alt=""
                width={600}
                height={600}
                loading="lazy"
                aria-hidden="true"
                className='select-none pointer-events-none'
                style={{
                  opacity: 0.02, // Even more subtle
                }}
              />
            </div>

            {!isMobile && <MouseTrail />}

            {/* Noise Texture - Fine grain for realism */}
            <div
              className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}
            ></div>

            {/* Replaced inline particles with InteractiveParticles component */}
            <InteractiveParticles mounted={mounted} isMobile={isMobile} />

            {/* Vignette for focus */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none'></div>
          </>
        )}
      </div>

      {/* Main Content Background - Fades in when full website is shown */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${showFullWebsite ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Deep base background */}
        <div className="absolute inset-0 bg-[#030303]"></div>

        {/* Animated Gradient Orbs - Enhanced for "Live" feel */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Rotating container for global movement */}
          {!isMobile && (
            <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-rotate-slow opacity-60">
               {/* Large ambient glows */}
               <div className="absolute top-[20%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.2)_0%,transparent_70%)] blur-[120px] mix-blend-screen animate-blob"></div>
               <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.2)_0%,transparent_70%)] blur-[120px] mix-blend-screen animate-blob animation-delay-4000"></div>
            </div>
          )}

          {/* Active floating elements */}
          {isMobile ? (
             <>
                {/* Static Mobile Background for Content - reduced blur for performance */}
                <div className="absolute top-[5%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.2)_0%,transparent_60%)] blur-[40px] mix-blend-screen"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.2)_0%,transparent_60%)] blur-[40px] mix-blend-screen"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.15)_0%,transparent_70%)] blur-[50px] mix-blend-screen"></div>
             </>
          ) : (
             <>
                {/* Top Left - Bright Gold */}
                <div className="absolute top-[5%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.15)_0%,transparent_60%)] blur-[80px] animate-float-vertical mix-blend-screen"></div>

                {/* Bottom Right - Deep Bronze */}
                <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.15)_0%,transparent_60%)] blur-[90px] animate-float-vertical animation-delay-2000 mix-blend-screen"></div>

                {/* Center - Pulsing Core */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.12)_0%,transparent_70%)] blur-[100px] animate-pulse-bright mix-blend-screen"></div>
             </>
          )}

          {/* Drifting Accents */}
          {!isMobile && (
            <>
              <div className="absolute top-[30%] right-[20%] w-[25%] h-[25%] rounded-full bg-[radial-gradient(circle,rgba(254,251,216,0.1)_0%,transparent_60%)] blur-[60px] animate-float-horizontal animation-delay-2000 mix-blend-screen"></div>
              <div className="absolute bottom-[30%] left-[15%] w-[30%] h-[30%] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.1)_0%,transparent_60%)] blur-[70px] animate-float-horizontal mix-blend-screen"></div>
            </>
          )}
        </div>

        {/* Noise Texture for "Live" feel */}
        {!isMobile && (
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          ></div>
        )}

        {/* Random Background Particles */}
        <BackgroundParticles mounted={mounted} isMobile={isMobile} />

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
      </div>
    </div>
  );
});

GlobalBackground.displayName = 'GlobalBackground';

export default GlobalBackground;
