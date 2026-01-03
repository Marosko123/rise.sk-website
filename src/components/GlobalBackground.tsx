'use client';

import companyConfig from '@/config/company';
import { useIsMobile } from '@/hooks/useIsMobile';
import Image from 'next/image';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import FloatingShapesCanvas, { FloatingShapesCanvasRef } from './animations/FloatingShapesCanvas';

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
  const floatingShapesRef = useRef<FloatingShapesCanvasRef>(null);
  const backgroundLogoRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  useImperativeHandle(ref, () => ({
    handleLogoClick: () => {
      floatingShapesRef.current?.handleLogoClick();
    },
    updateVisuals: (progress: number) => {
      if (landingBgRef.current) {
        landingBgRef.current.style.transform = `scale(${1 + progress * 0.5})`;
        landingBgRef.current.style.opacity = `${1 - progress * 1.5}`;
        landingBgRef.current.style.filter = `blur(${progress * 10}px)`;
      }
    },
    setTransition: (transition: string) => {
      if (landingBgRef.current) {
        landingBgRef.current.style.transition = transition;
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

    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    if (showFullWebsite || isMobile) return;

    let lastUpdate = 0;
    const throttleDelay = 32; // Reduced to ~30fps for mouse tracking

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
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
          visibility: (showFullWebsite && !isReturning) ? 'hidden' : 'visible'
        }}
      >
        {!showFullWebsite && (
          <>
            {/* --- OPTIMIZED RISE GRADIENT SYSTEM --- */}

            {/* 1. Warm Rich Base - Deep bronze to black gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2a1f0f_0%,#0a0705_50%,#000000_100%)] opacity-90 pointer-events-none"></div>

            {/* 2. Static Mesh Gradient Overlay - Removed animations for performance */}
            <div className="absolute inset-0 opacity-50 pointer-events-none mix-blend-screen">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(218,181,73,0.22)_0%,transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,103,35,0.22)_0%,transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,251,216,0.12)_0%,transparent_40%)]"></div>
            </div>

            {/* 3. Static Conic Sheen - Metallic shimmer effect (disabled rotation for performance) */}
            {!isMobile && (
              <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-screen">
                <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,transparent_0deg,rgba(218,181,73,0.12)_90deg,transparent_180deg,rgba(139,103,35,0.12)_270deg,transparent_360deg)] blur-[40px]"></div>
              </div>
            )}

            {/* 4. Large Premium Glows - Static for performance */}
            {isMobile ? (
              <>
                {/* Mobile: Static background */}
                <div className="absolute top-[-15%] right-[-10%] w-[85vw] h-[85vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.28)_0%,rgba(218,181,73,0.12)_30%,transparent_70%)] blur-[70px] pointer-events-none mix-blend-screen"></div>
                <div className="absolute bottom-[-15%] left-[-10%] w-[85vw] h-[85vw] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.28)_0%,rgba(139,103,35,0.12)_30%,transparent_70%)] blur-[70px] pointer-events-none mix-blend-screen"></div>
              </>
            ) : (
              <>
                {/* Desktop: Static glows - no animation for performance */}
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.18)_0%,rgba(218,181,73,0.08)_40%,transparent_70%)] blur-[80px] pointer-events-none mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.2)_0%,rgba(139,103,35,0.1)_40%,transparent_70%)] blur-[80px] pointer-events-none mix-blend-screen"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(255,250,205,0.08)_0%,rgba(254,251,216,0.04)_50%,transparent_70%)] blur-[60px] pointer-events-none mix-blend-screen"></div>
              </>
            )}

            {/* 5. Floating Accent Orbs - CSS animations only */}
            {!isMobile && (
              <>
                <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.12)_0%,transparent_70%)] blur-[80px] animate-float-slow pointer-events-none"></div>
                <div className="absolute bottom-[30%] right-[20%] w-[25%] h-[25%] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.12)_0%,transparent_70%)] blur-[80px] animate-float-slow animation-delay-2000 pointer-events-none"></div>
              </>
            )}

            {/* Canvas-based FloatingShapes - Optimized */}
            <FloatingShapesCanvas
              ref={floatingShapesRef}
              cursorPositionRef={cursorPositionRef}
              windowSize={windowSize}
              mounted={mounted}
              isMobile={isMobile}
              onStateChange={onShapesStateChange}
            />

            {/* Background Logo */}
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
                  opacity: 0.02,
                }}
              />
            </div>

            {/* Noise Texture - Fine grain for realism */}
            <div
              className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}
            ></div>

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

        {/* Animated Gradient Orbs - CSS only for performance */}
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
                {/* Static Mobile Background for Content */}
                <div className="absolute top-[5%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.2)_0%,transparent_60%)] blur-[60px] mix-blend-screen"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(139,103,35,0.2)_0%,transparent_60%)] blur-[60px] mix-blend-screen"></div>
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

        {/* Noise Texture for "Live" feel - Desktop only */}
        {!isMobile && (
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          ></div>
        )}

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
      </div>
    </div>
  );
});

GlobalBackground.displayName = 'GlobalBackground';

export default GlobalBackground;
