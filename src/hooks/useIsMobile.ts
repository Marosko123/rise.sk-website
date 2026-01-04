'use client';

import { useEffect, useRef, useState } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);
  const lastWidthRef = useRef<number>(0);

  useEffect(() => {
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

  return isMobile;
}
