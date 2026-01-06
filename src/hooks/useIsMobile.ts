'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hydration-safe hook for detecting mobile devices.
 * Returns false during SSR and initial hydration to prevent mismatch.
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  // Start with false to match server-rendered HTML
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const lastWidthRef = useRef<number>(0);

  useEffect(() => {
    // Mark as hydrated after first client render
    setIsHydrated(true);

    const checkIsMobile = () => {
      const currentWidth = window.innerWidth;

      // Only update if width actually changed (ignore height-only changes from mobile toolbar)
      // This prevents re-renders when Chrome mobile toolbar hides/shows during scroll
      if (lastWidthRef.current !== currentWidth) {
        lastWidthRef.current = currentWidth;
        setIsMobile(currentWidth < breakpoint);
      }
    };

    // Initial check
    lastWidthRef.current = window.innerWidth;
    setIsMobile(window.innerWidth < breakpoint);

    // Debounced resize handler to prevent excessive updates
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedCheck = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkIsMobile, 150);
    };

    window.addEventListener('resize', debouncedCheck);

    return () => {
      window.removeEventListener('resize', debouncedCheck);
      clearTimeout(resizeTimeout);
    };
  }, [breakpoint]);

  // During SSR and initial hydration, return false to match server
  if (!isHydrated) {
    return false;
  }

  return isMobile;
}
