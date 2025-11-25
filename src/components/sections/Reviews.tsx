'use client';

import { useCarousel } from '@/hooks/useCarousel';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSwipe } from '@/hooks/useSwipe';
import { useTranslations } from '@/hooks/useTranslations';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useMemo } from 'react';

import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  tags: string[];
}

interface ReviewsProps {
  className?: string;
  id?: string;
}

export default function Reviews({ className, id = 'reviews' }: ReviewsProps) {
  const t = useTranslations('reviews');
  const isMobile = useIsMobile();

  // Get reviews from translations
  const reviews: Review[] = useMemo(() => {
    try {
      const reviewsData = t.raw('reviews') as Review[];
      return reviewsData || [];
    } catch {
      return [];
    }
  }, [t]);

  const {
    currentIndex,
    itemsPerView,
    maxIndex,
    nextSlide,
    prevSlide,
    goToSlide,
    setIsHovered,
  } = useCarousel(reviews.length, { mobileItems: 1.2, autoPlayInterval: 3000 });

  const swipeHandlers = useSwipe({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
  });

  // Optimized star rendering with memoization
  const renderStars = useMemo(() => {
    return (rating: number) =>
      Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'fill-[var(--primary)] text-[var(--primary)]' : 'text-gray-400'
          }`}
        />
      ));
  }, []);

  if (reviews.length === 0) return null;

  return (
    <Section
      id={id}
      background="transparent"
      className={`relative py-24 ${className || ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Simplified for performance */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-6">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl text-[var(--foreground-muted)] max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Reviews Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {reviews.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 bg-[var(--primary)]/20 backdrop-blur-sm hover:bg-[var(--primary)]/40 p-3 rounded-full transition-all duration-300 hover:scale-110 select-none"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-6 w-6 text-[var(--primary)]" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20 bg-[var(--primary)]/20 backdrop-blur-sm hover:bg-[var(--primary)]/40 p-3 rounded-full transition-all duration-300 hover:scale-110 select-none"
                aria-label="Next review"
              >
                <ChevronRight className="h-6 w-6 text-[var(--primary)]" />
              </button>
            </>
          )}

          {/* Reviews Carousel - Optimized */}
          <div
            className="overflow-hidden"
            onTouchStart={(e) => {
              setIsHovered(true);
              swipeHandlers.onTouchStart(e);
            }}
            onTouchMove={swipeHandlers.onTouchMove}
            onTouchEnd={() => {
              setIsHovered(false);
              swipeHandlers.onTouchEnd();
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="flex transition-transform duration-500 ease-out items-stretch"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <Card
                    variant="glass"
                    className="h-full flex flex-col relative overflow-hidden group border-white/5 hover:border-[var(--primary)]/30 transition-all duration-500"
                    hover={!isMobile}
                  >
                    {/* Background Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Quote Icon - Modernized */}
                    <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                      <Quote className="w-16 h-16 text-[var(--primary)] rotate-12" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-6 relative z-10">
                      {renderStars(review.rating)}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 flex flex-col relative z-10">
                      <blockquote className="text-gray-200 leading-relaxed text-lg font-light italic flex-1 min-h-[100px]">
                        &ldquo;{review.content}&rdquo;
                      </blockquote>
                    </div>

                    {/* Author Info */}
                    <div className="pt-6 mt-6 border-t border-white/10 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold text-lg">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-base">
                            {review.name}
                          </div>
                          <div className="text-[var(--primary)] text-sm font-medium">
                            {review.role}
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm mt-2 pl-14">
                        {review.company}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator - Simplified */}
          {reviews.length > itemsPerView && (
            <div className="flex justify-center gap-3 mt-8 mb-12">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 relative ${
                    index === currentIndex
                      ? 'bg-[var(--primary)] scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                  style={{ minWidth: 'auto', minHeight: 'auto' }}
                >
                  {/* Increase touch area for mobile */}
                  <span className="absolute -inset-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section - Removed redundant CTA */}
      </div>

      {/* Bottom border for visual separation */}
    </Section>
  );
}
