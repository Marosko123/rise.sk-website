'use client';

import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PullToRefresh() {
  const pathname = usePathname();
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Disable on landing page
  // The landing page is at /[locale] or /
  // We need to check if the pathname matches /en, /sk, or just /
  const isLandingPage = pathname === '/' || pathname === '/en' || pathname === '/sk' || pathname === '/en/' || pathname === '/sk/';

  useEffect(() => {
    if (isLandingPage) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only start if we are at the very top
      if (window.scrollY <= 5) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY > 0 && !isRefreshing && window.scrollY <= 5) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        // Only handle vertical pull down
        if (diff > 0) {
           // Apply resistance
           // Logarithmic or square root resistance feels more natural
           const newDistance = Math.min(diff * 0.4, 120);
           setPullDistance(newDistance);
        }
      }
    };

    const handleTouchEnd = () => {
      if (isLandingPage) return;

      if (pullDistance > 60) { // Threshold to trigger refresh
        setIsRefreshing(true);
        setPullDistance(60); // Snap to loading position

        // Trigger refresh
        window.location.reload();
      } else {
        // Reset
        setPullDistance(0);
        setStartY(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, pullDistance, isRefreshing, isLandingPage]);

  if (isLandingPage) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
      style={{
        transform: `translateY(${pullDistance > 0 ? pullDistance - 50 : -50}px)`,
        transition: isRefreshing ? 'transform 0.2s ease-out' : 'transform 0.1s ease-out'
      }}
    >
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg border border-slate-200 dark:border-slate-700">
        <Loader2
          className={`w-5 h-5 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
          style={{ transform: `rotate(${pullDistance * 3}deg)` }}
        />
      </div>
    </div>
  );
}
