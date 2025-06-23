'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { Button } from './ui/Button';
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

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleReviews, setVisibleReviews] = useState(3);

  // Get reviews from translations - they are stored as an array
  const reviews: Review[] = useMemo(() => {
    try {
      const reviewsData = t.raw('reviews') as Review[];
      return reviewsData.map((review: Review) => ({
        id: review.id,
        name: review.name,
        role: review.role,
        company: review.company,
        content: review.content,
        rating: review.rating,
        tags: review.tags,
      }));
    } catch {
      // Fallback to empty array if translation fails
      return [];
    }
  }, [t]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(1, reviews.length - visibleReviews + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length, visibleReviews]);

  // Responsive visible reviews
  useEffect(() => {
    const updateVisibleReviews = () => {
      if (window.innerWidth >= 1024) setVisibleReviews(3);
      else if (window.innerWidth >= 768) setVisibleReviews(2);
      else setVisibleReviews(1);
    };

    updateVisibleReviews();
    window.addEventListener('resize', updateVisibleReviews);
    return () => window.removeEventListener('resize', updateVisibleReviews);
  }, []);

  const nextReview = () => {
    setCurrentIndex(prev => (prev + 1) % Math.max(1, reviews.length - visibleReviews + 1));
    setIsAutoPlaying(false);
  };

  const prevReview = () => {
    setCurrentIndex(prev =>
      prev === 0 ? Math.max(0, reviews.length - visibleReviews) : prev - 1
    );
    setIsAutoPlaying(false);
  };

  const goToReview = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-[#b09155] text-[#b09155]' : 'text-gray-400'
        }`}
      />
    ));
  };

  if (reviews.length === 0) return null;

  return (
    <Section
      id="testimonials"
      className="bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#1a1a1a] relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(180,145,85,0.15),transparent_50%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(212,175,55,0.1),transparent_50%)]' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            {t('title')}
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Reviews Carousel */}
        <div className='relative'>
          {/* Navigation Buttons */}
          <div className='absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block'>
            <Button
              variant="ghost"
              onClick={prevReview}
              className='w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20'
            >
              <ChevronLeft className='w-6 h-6' />
            </Button>
          </div>
          <div className='absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block'>
            <Button
              variant="ghost"
              onClick={nextReview}
              className='w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20'
            >
              <ChevronRight className='w-6 h-6' />
            </Button>
          </div>

          {/* Reviews Container */}
          <div className='overflow-hidden'>
            <motion.div
              className='flex gap-6'
              animate={{
                x: `${-currentIndex * (100 / visibleReviews)}%`
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  className={`flex-shrink-0 ${
                    visibleReviews === 1 ? 'w-full' :
                    visibleReviews === 2 ? 'w-1/2' : 'w-1/3'
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className='h-full bg-gradient-to-br from-gray-900/60 to-gray-800/60 border-white/20 backdrop-blur-sm hover:bg-gradient-to-br hover:from-gray-800/70 hover:to-gray-700/70 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:border-[#b09155]/30'>
                    {/* Quote Icon */}
                    <div className='flex justify-between items-start mb-4'>
                      <Quote className='w-8 h-8 text-[#b09155] opacity-50 group-hover:opacity-75 transition-opacity duration-300' />
                      <div className='flex gap-1'>
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    {/* Review Content */}
                    <blockquote className='text-gray-200 leading-relaxed mb-6 text-base md:text-lg font-light italic'>
                      &ldquo;{review.content}&rdquo;
                    </blockquote>

                    {/* Author Info */}
                    <div className='mt-auto'>
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <div className='font-semibold text-white text-base mb-1'>
                            {review.name}
                          </div>
                          <div className='text-[#b09155] text-sm font-medium'>
                            {review.role}
                          </div>
                          <div className='text-gray-400 text-sm'>
                            {review.company}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className='flex flex-wrap gap-2'>
                        {review.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className='px-3 py-1 bg-[#b09155]/20 text-[#b09155] text-xs font-medium rounded-full border border-[#b09155]/30 hover:bg-[#b09155]/30 transition-colors duration-200'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className='flex justify-center gap-2 mt-8'>
            {Array.from({ length: Math.max(1, reviews.length - visibleReviews + 1) }, (_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#b09155] w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='text-center mt-16'
        >
          <div className='bg-gradient-to-r from-[#b09155]/20 to-[#9a7f4b]/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto'>
            <h3 className='text-2xl md:text-3xl font-bold text-white mb-4'>
              Ready to Join Our Success Stories?
            </h3>
            <p className='text-gray-300 text-lg mb-8 max-w-2xl mx-auto'>
              Let&rsquo;s create something amazing together. Contact us and let&rsquo;s discuss your needs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Button
                href='#contact'
                variant='primary'
                className='bg-gradient-to-r from-[#b09155] to-[#9a7f4b] hover:from-[#9a7f4b] hover:to-[#b09155] transition-all duration-300'
              >
                Start Your Project
              </Button>
              <Button
                href='#services'
                variant='outline'
                className='border-[#b09155] text-[#b09155] hover:bg-[#b09155] hover:text-white transition-all duration-300'
              >
                View Our Services
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
