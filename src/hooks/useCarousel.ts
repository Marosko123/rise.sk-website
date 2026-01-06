'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Hydration-safe carousel hook.
 * Uses desktopItems as default during SSR to prevent hydration mismatch.
 */
export function useCarousel(
  totalItems: number,
  options: {
    mobileItems?: number;
    tabletItems?: number;
    desktopItems?: number;
    autoPlayInterval?: number;
  } = {}
) {
  const {
    mobileItems = 1,
    tabletItems = 2,
    desktopItems = 3,
    autoPlayInterval = 5000
  } = options;

  const [currentIndex, setCurrentIndex] = useState(0);
  // Use desktopItems as default to match server-rendered HTML (prevents hydration mismatch)
  const [itemsPerView, setItemsPerView] = useState(desktopItems);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {

    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(mobileItems);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(tabletItems);
      } else {
        setItemsPerView(desktopItems);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [mobileItems, tabletItems, desktopItems]);

  const maxIndex = Math.max(0, totalItems - Math.floor(itemsPerView));

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered, autoPlayInterval]);

  return {
    currentIndex,
    itemsPerView,
    maxIndex,
    nextSlide,
    prevSlide,
    goToSlide,
    setIsHovered,
  };
}
