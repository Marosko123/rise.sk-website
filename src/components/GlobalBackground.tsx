'use client';

import companyConfig from '@/config/company';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useParticles } from '@/hooks/useParticles';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import FloatingShapes, { FloatingShapesRef } from './animations/FloatingShapes';
import MouseTrail from './animations/MouseTrail';

// Simple random number generator
const random = (min: number, max: number) => Math.random() * (max - min) + min;

import { MotionValue } from 'framer-motion';

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
    <motion.div
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
    </motion.div>
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
  onShapesStateChange?: (length: number, isExploding: boolean, explosionStartTime?: number) => void;
}

export interface GlobalBackgroundRef {
  handleLogoClick: () => void;
}

const GlobalBackground = forwardRef<GlobalBackgroundRef, GlobalBackgroundProps>(({ mounted, showFullWebsite, onShapesStateChange }, ref) => {
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 0, height: 0 };
  });
  const floatingShapesRef = useRef<FloatingShapesRef>(null);
  const backgroundLogoRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const { particles, createExplosion } = useParticles();

  useImperativeHandle(ref, () => ({
    handleLogoClick: () => {
      floatingShapesRef.current?.handleLogoClick();
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

    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
      clearTimeout(resizeTimeout);
    };
  }, []);

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

    const handleClick = (e: MouseEvent) => {
      createExplosion(e.clientX, e.clientY);
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('click', handleClick);

    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('click', handleClick);
    };
  }, [createExplosion, showFullWebsite, isMobile]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Landing Page Background - Fades out when full website is shown */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${showFullWebsite ? 'opacity-0' : 'opacity-100'} bg-[#000000]`}
        style={{ visibility: showFullWebsite ? 'hidden' : 'visible', transitionDelay: showFullWebsite ? '0ms' : '0ms' }}
      >
        {!showFullWebsite && (
          <>
            {/* --- PREMIUM MESH GRADIENT SYSTEM --- */}

            {/* 1. Deep Ambient Base - Subtle warm undertone */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1205_0%,#000000_100%)] opacity-80 pointer-events-none"></div>

            {/* 2. Rotating Conic Sheen - Adds dynamic "metallic" feel */}
            {!isMobile && (
              <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-rotate-very-slow opacity-[0.15] pointer-events-none mix-blend-screen">
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(218,181,73,0.1)_60deg,transparent_120deg,transparent_180deg,rgba(139,103,35,0.1)_240deg,transparent_300deg)] blur-[60px]"></div>
              </div>
            )}

            {/* 3. Large Soft Glows - The "Gold" presence */}
            {/* Top Right - Rich Gold */}
            <div className={`absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.08)_0%,transparent_70%)] ${isMobile ? 'blur-[60px]' : 'blur-[120px]'} pointer-events-none mix-blend-screen animate-pulse-slow`}></div>

            {/* Bottom Left - Deep Bronze */}
            <div className={`absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.1)_0%,transparent_70%)] ${isMobile ? 'blur-[60px]' : 'blur-[120px]'} pointer-events-none mix-blend-screen animate-pulse-slow animation-delay-4000`}></div>

            {/* Center - Subtle Highlight */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,250,205,0.03)_0%,transparent_60%)] ${isMobile ? 'blur-[50px]' : 'blur-[100px]'} pointer-events-none mix-blend-screen`}></div>

            {/* 4. Floating "Gold Dust" - Replaces harsh particles */}
            {/* We keep the existing particle system but make it subtler via CSS if needed,
                but here we add some very large, barely visible moving orbs for texture */}
            {!isMobile && (
              <>
                <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.05)_0%,transparent_70%)] blur-[80px] animate-float-slow pointer-events-none"></div>
                <div className="absolute bottom-[30%] right-[20%] w-[25%] h-[25%] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.05)_0%,transparent_70%)] blur-[80px] animate-float-slow animation-delay-2000 pointer-events-none"></div>
              </>
            )}

            {/* Ambient Particles for Landing Page - Optimized for mobile */}
            <BackgroundParticles count={isMobile ? 0 : 60} mounted={mounted} isMobile={isMobile} />

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
                alt={companyConfig.company.name}
                width={600}
                height={600}
                priority
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

            {particles.map((particle) => (
              <div
                key={particle.id}
                className='absolute w-1 h-1 rounded-full pointer-events-none select-none will-change-transform'
                style={{
                  transform: `translate3d(${particle.x}px, ${particle.y}px, 0) scale(${particle.life / particle.maxLife})`,
                  backgroundColor: '#DAB549',
                  opacity: (particle.life / particle.maxLife) * 0.4, // Reduced opacity for "dust" look
                  boxShadow: '0 0 2px rgba(218, 181, 73, 0.4)',
                }}
              />
            ))}

            {/* Vignette for focus */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none'></div>
          </>
        )}
      </div>

      {/* Main Content Background - Fades in when full website is shown */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${showFullWebsite ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Deep base background */}
        <div className="absolute inset-0 bg-[#030303]"></div>

        {/* Animated Gradient Orbs - Enhanced for "Live" feel */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Rotating container for global movement */}
          {!isMobile && (
            <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-rotate-slow opacity-60">
               {/* Large ambient glows */}
               <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.2)_0%,transparent_70%)] blur-[120px] mix-blend-screen animate-blob"></div>
               <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.2)_0%,transparent_70%)] blur-[120px] mix-blend-screen animate-blob animation-delay-4000"></div>
            </div>
          )}

          {/* Active floating elements */}
          {/* Top Left - Bright Gold */}
          <div className={`absolute top-[5%] left-[10%] w-[35%] h-[35%] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.15)_0%,transparent_60%)] ${isMobile ? 'blur-[40px]' : 'blur-[80px]'} animate-float-vertical mix-blend-screen`}></div>

          {/* Bottom Right - Deep Bronze */}
          <div className={`absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.15)_0%,transparent_60%)] ${isMobile ? 'blur-[45px]' : 'blur-[90px]'} animate-float-vertical animation-delay-2000 mix-blend-screen`}></div>

          {/* Center - Pulsing Core */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.12)_0%,transparent_70%)] ${isMobile ? 'blur-[50px]' : 'blur-[100px]'} animate-pulse-bright mix-blend-screen`}></div>

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
