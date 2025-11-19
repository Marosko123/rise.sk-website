'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return; // Don't initialize smooth scrolling if user prefers reduced motion
    }

    // Check if device is mobile
    const isMobile = window.innerWidth < 768;

    const lenis = new Lenis({
      duration: isMobile ? 0.8 : 1.2, // Faster on mobile
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !isMobile, // Disable smooth wheel on mobile
      wheelMultiplier: isMobile ? 0.5 : 1,
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Handle resize events
    const handleResize = () => {
      lenis.resize();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      lenis.destroy();
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}
