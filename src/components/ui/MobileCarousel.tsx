'use client';

import { useCarousel } from '@/hooks/useCarousel';
import { useSwipe } from '@/hooks/useSwipe';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface MobileCarouselProps {
  children: React.ReactNode;
  className?: string;
  mobileItems?: number;
  autoPlayInterval?: number;
}

export function MobileCarousel({
  children,
  className = '',
  mobileItems = 1.2,
  autoPlayInterval = 3000
}: MobileCarouselProps) {
  const items = React.Children.toArray(children);
  const {
    currentIndex,
    itemsPerView,
    goToSlide,
    nextSlide,
    prevSlide,
    setIsHovered
  } = useCarousel(items.length, { mobileItems, autoPlayInterval });

  const swipeHandlers = useSwipe({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    swipeHandlers.onTouchStart(e);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    swipeHandlers.onTouchEnd();
  };

  if (items.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={swipeHandlers.onTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[var(--primary)]/20 backdrop-blur-sm hover:bg-[var(--primary)]/40 p-3 rounded-full transition-all duration-300 hover:scale-110 select-none"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-[var(--primary)]" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[var(--primary)]/20 backdrop-blur-sm hover:bg-[var(--primary)]/40 p-3 rounded-full transition-all duration-300 hover:scale-110 select-none"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-[var(--primary)]" />
      </button>

      <motion.div
        className="flex"
        animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-2"
            style={{ width: `${100 / itemsPerView}%` }}
          >
             {item}
          </div>
        ))}
      </motion.div>
      {/* Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {items.map((_, idx) => (
            <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 relative ${
                    idx === currentIndex
                    ? 'bg-[var(--primary)] scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                style={{ minWidth: 'auto', minHeight: 'auto' }}
                aria-label={`Go to slide ${idx + 1}`}
            >
                <span className="absolute -inset-2" />
            </button>
        ))}
      </div>
    </div>
  );
}
