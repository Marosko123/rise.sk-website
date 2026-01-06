'use client';

import { useEffect } from 'react';

/**
 * DeferredStyles - Signals that animations are ready after hydration
 * The CSS is imported in layout.tsx, but this component adds
 * a class to body to enable animations only after initial paint
 */
export default function DeferredStyles() {
  useEffect(() => {
    // Use requestIdleCallback for optimal scheduling
    const enableAnimations = () => {
      document.body.classList.add('animations-loaded');
    };

    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(enableAnimations);
    } else {
      // Fallback for Safari
      setTimeout(enableAnimations, 100);
    }
  }, []);

  return null;
}
