'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * NavigationProgress - Zobrazuje progress bar pri navigácii medzi stránkami
 * Poskytuje okamžitú vizuálnu spätnú väzbu používateľovi
 */
export default function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const startNavigation = () => {
      // Použijeme setTimeout(0) na odloženie state update mimo sync context
      setTimeout(() => {
        if (isNavigatingRef.current) return;
        isNavigatingRef.current = true;
        setIsNavigating(true);
        setProgress(0);

        let currentProgress = 0;
        if (progressInterval.current) clearInterval(progressInterval.current);

        progressInterval.current = setInterval(() => {
          currentProgress += Math.random() * 15;
          if (currentProgress >= 90) {
            currentProgress = 90;
            if (progressInterval.current) clearInterval(progressInterval.current);
          }
          setProgress(currentProgress);
        }, 100);
      }, 0);
    };

    const endNavigation = () => {
      setTimeout(() => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        setProgress(100);
        setTimeout(() => {
          isNavigatingRef.current = false;
          setIsNavigating(false);
          setProgress(0);
        }, 200);
      }, 0);
    };

    // Interceptujeme kliknutia na linky
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link) {
        const href = link.getAttribute('href');
        const isExternal = link.target === '_blank' || link.rel?.includes('external');
        const isHash = href?.startsWith('#');
        const isSamePage = href === window.location.pathname;

        if (href && !isExternal && !isHash && !isSamePage) {
          startNavigation();
        }
      }
    };

    const handlePopState = () => {
      startNavigation();
      setTimeout(endNavigation, 300);
    };

    const handleLoad = () => {
      endNavigation();
    };

    document.addEventListener('click', handleClick, { capture: true });
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('load', handleLoad);

    // Pre Next.js router - sledujeme pushState bez priameho volania setState
    const originalPushState = history.pushState;

    history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      // Dispatch custom event namiesto priameho volania setState
      window.dispatchEvent(new CustomEvent('navigation-start'));
      return result;
    };

    const handleNavigationStart = () => {
      startNavigation();
      setTimeout(endNavigation, 400);
    };

    window.addEventListener('navigation-start', handleNavigationStart);

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('navigation-start', handleNavigationStart);
      if (progressInterval.current) clearInterval(progressInterval.current);
      history.pushState = originalPushState;
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[10000] h-[3px] bg-transparent"
      style={{ opacity: 1 }}
    >
      <div
        className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--primary-light)] to-[var(--primary)] transition-[width] duration-100"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px var(--primary), 0 0 5px var(--primary)',
        }}
      />
    </div>
  );
}
