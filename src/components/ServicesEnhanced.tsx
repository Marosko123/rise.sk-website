'use client';

import { motion, useInView } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const ServicesEnhanced: React.FC = () => {
  const t = useTranslations('servicesEnhanced');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  // Get services data from translations
  const services = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    title: t(`services.${index}.title`),
    description: t(`services.${index}.description`),
    features: Array.from({ length: 5 }, (_, featIndex) => 
      t(`services.${index}.features.${featIndex}`)
    ),
  }));

  // Calculate items per view based on screen size
  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, services.length - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide functionality - pause on hover
  useEffect(() => {
    if (isHovered) return; // Don't auto-slide when hovering

    const interval = setInterval(nextSlide, 5000); // Auto slide every 5 seconds
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Get service icon and gradient based on service type
  const getServiceIcon = (index: number) => {
    const icons = ['🌐', '📱', '⚙️', '🛒', '🤖', '📊'];
    return icons[index] || '💻';
  };

  const getServiceGradient = (index: number) => {
    const gradients = [
      'from-[#b09155]/30 via-[#9a7f4b]/30 to-[#d4af37]/30',
      'from-[#9a7f4b]/30 via-[#b09155]/30 to-[#8b6914]/30',
      'from-[#d4af37]/30 via-[#b09155]/30 to-[#9a7f4b]/30',
      'from-[#8b6914]/30 via-[#d4af37]/30 to-[#b09155]/30',
      'from-[#b09155]/30 via-[#d4af37]/30 to-[#9a7f4b]/30',
      'from-[#9a7f4b]/30 via-[#8b6914]/30 to-[#b09155]/30'
    ];
    return gradients[index] || gradients[0];
  };

  return (
    <section 
      id="services"
      ref={ref}
      className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 via-transparent to-[var(--primary-dark)]/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--primary)]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[var(--primary-dark)]/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Services Carousel */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[var(--primary)]/20 backdrop-blur-sm hover:bg-[var(--primary)]/40 p-3 rounded-full transition-all duration-300 hover:scale-110 select-none"
          >
            <ChevronLeft className="h-6 w-6 text-[var(--primary)]" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[var(--primary)]/20 backdrop-blur-sm hover:bg-[var(--primary)]/40 p-3 rounded-full transition-all duration-300 hover:scale-110 select-none"
          >
            <ChevronRight className="h-6 w-6 text-[var(--primary)]" />
          </button>

          {/* Carousel Content */}
          <div className="overflow-hidden mx-16">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  className="group relative flex-shrink-0 px-4"
                  style={{
                    width: `${100 / itemsPerView}%`
                  }}
                  variants={itemVariants}
                >
                  <div className="relative h-[600px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:border-[var(--primary)]/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--primary)]/30 flex flex-col">
                    {/* Service Icon */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getServiceGradient(index)} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {getServiceIcon(index)}
                    </div>

                    {/* Service Title */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[var(--primary)] transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Service Description */}
                    <p className="text-white/70 mb-6 leading-relaxed flex-grow">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="mb-8">
                      <h4 className="text-[var(--primary)] font-semibold mb-4">
                        {t('labels.features')}
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3 text-white/80">
                            <div className="w-5 h-5 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <Check className="w-3 h-3 text-[var(--primary)]" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-gradient-to-r from-[var(--primary)] to-[#d4af37] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 mt-auto select-none">
                      <MessageCircle className="w-5 h-5" />
                      {t('buttons.discuss')}
                    </button>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-[#d4af37]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[var(--primary)] scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mt-20"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-bold text-white mb-4">
              {t('cta.title')}
            </h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-[var(--primary)] to-[#d4af37] text-white py-4 px-8 rounded-xl font-semibold hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300 hover:scale-105 select-none">
                {t('buttons.contact')}
              </button>
              <button className="border border-[var(--primary)] text-[var(--primary)] py-4 px-8 rounded-xl font-semibold hover:bg-[var(--primary)] hover:text-white transition-all duration-300 hover:scale-105 select-none">
                {t('buttons.references')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesEnhanced;
