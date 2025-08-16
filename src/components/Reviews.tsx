'use client';

import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useIsMobile } from '@/hooks/useIsMobile';

import { Card } from './ui/Card';
import { Section } from './ui/Section';

interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  tags: string[];
}

export default function Reviews() {
  const t = useTranslations('reviews');
  const portfolioT = useTranslations('portfolio'); // Add portfolio translations for CTA
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get reviews from translations
  const reviews: Review[] = useMemo(() => {
    try {
      const reviewsData = t.raw('reviews') as Review[];
      return reviewsData || [];
    } catch {
      return [];
    }
  }, [t]);

  // Responsive visible reviews - simplified logic
  const visibleReviews = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, reviews.length - visibleReviews);

  // Auto-play carousel - only on desktop for better UX
  useEffect(() => {
    if (!isAutoPlaying || isMobile || reviews.length <= visibleReviews) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 6000); // Slower auto-play for better readability

    return () => clearInterval(interval);
  }, [isAutoPlaying, isMobile, reviews.length, visibleReviews, maxIndex]);

  const nextReview = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    setIsAutoPlaying(false);
  }, [maxIndex]);

  const prevReview = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
    setIsAutoPlaying(false);
  }, [maxIndex]);

  const goToReview = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  }, []);

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
      id="reviews"
      className="bg-gradient-to-b from-slate-900/50 via-slate-800/30 to-slate-900/50 relative py-24"
    >
      {/* Distinct background for Reviews */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#b09155]/20 via-transparent to-[#9a7f4b]/20" />

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
          {/* Navigation Buttons - Only on desktop */}
          {!isMobile && reviews.length > visibleReviews && (
            <>
              <button
                onClick={prevReview}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors duration-200 flex items-center justify-center select-none"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextReview}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors duration-200 flex items-center justify-center select-none"
                aria-label="Next review"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Reviews Carousel - Optimized */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-300 ease-out items-stretch"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleReviews)}%)`,
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`flex-shrink-0 ${
                    isMobile ? 'w-full' : 'w-1/3'
                  }`}
                >
                  <Card className="h-full bg-[var(--card)] border-[var(--border)] hover:bg-[var(--card)]/90 transition-colors duration-200 shadow-md hover:shadow-lg flex flex-col">
                    {/* Quote Icon and Rating - Simplified */}
                    <div className="flex justify-between items-start mb-4">
                      <Quote className="w-6 h-6 text-[var(--primary)] opacity-70" />
                      <div className="flex gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    {/* Review Content - Fixed height with consistent spacing */}
                    <div className="flex-1 flex flex-col">
                      <blockquote className="text-[var(--foreground)] leading-relaxed text-base flex-1 min-h-[120px] flex items-start">
                        &ldquo;{review.content}&rdquo;
                      </blockquote>
                    </div>

                    {/* Author Info - Always at bottom */}
                    <div className="pt-4 border-t border-[var(--border)]/50 mt-auto">
                      <div className="mb-3">
                        <div className="font-semibold text-[var(--foreground)] text-base mb-1">
                          {review.name}
                        </div>
                        <div className="text-[var(--primary)] text-sm font-medium">
                          {review.role}
                        </div>
                        <div className="text-[var(--foreground-muted)] text-sm">
                          {review.company}
                        </div>
                      </div>

                      {/* Tags - Simplified */}
                      <div className="flex flex-wrap gap-2">
                        {review.tags.slice(0, isMobile ? 2 : 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator - Simplified */}
          {reviews.length > visibleReviews && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToReview(index)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-[var(--primary)] w-6'
                      : 'bg-gray-600 hover:bg-gray-500 w-2'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA Section - Moved from Portfolio */}
        <div className="text-center mt-20">
          <div className="glass-effect rounded-3xl p-12 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 gradient-text-animated">
                {portfolioT('cta.title')}
              </h3>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                {portfolioT('cta.description')}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] px-8 py-4 rounded-full text-lg font-semibold text-white shadow-2xl transition-colors duration-300"
                >
                  {portfolioT('cta.startProject')}
                </button>
              </div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary) 1px, transparent 1px), radial-gradient(circle at 75% 75%, var(--primary) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border for visual separation */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent"></div>
    </Section>
  );
}
