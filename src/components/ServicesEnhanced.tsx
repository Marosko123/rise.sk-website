'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code,
  Database,
  Settings,
  ShoppingCart,
  Smartphone,
  Target,
  TrendingUp
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

export default function ServicesEnhanced() {
  const t = useTranslations('servicesEnhanced');
  const tContact = useTranslations('contact');
  
  // Mobile carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to map service titles to dropdown categories for contact form
  const mapServiceToCategory = useCallback((serviceTitle: string) => {
    const mapping = {
      [t('services.0.title')]: 'webDevelopment',
      [t('services.1.title')]: 'mobileApps',
      [t('services.2.title')]: 'customSoftware',
      [t('services.3.title')]: 'ecommerce',
      [t('services.4.title')]: 'aiAnalytics',
      [t('services.5.title')]: 'digitalMarketing'
    };
    return mapping[serviceTitle as keyof typeof mapping] || 'specialRequests';
  }, [t]);

  // Function to get localized service name for dropdown (same as Contact component)
  const getLocalizedServiceName = useCallback((serviceTitle: string) => {
    const categoryKey = mapServiceToCategory(serviceTitle);
    const translationKey = `services.${categoryKey}`;
    return tContact(translationKey);
  }, [mapServiceToCategory, tContact]);

  // Function to generate pre-filled message based on service and locale using translations
  const generateServiceMessage = useCallback((serviceTitle: string) => {
    const categoryKey = mapServiceToCategory(serviceTitle);
    const translationKey = `templateMessages.${categoryKey}`;
    return tContact(translationKey);
  }, [mapServiceToCategory, tContact]);

  // Function to scroll to contact with pre-filled form
  const handleServiceInquiry = useCallback((serviceTitle: string) => {
    const message = generateServiceMessage(serviceTitle);
    const localizedServiceName = getLocalizedServiceName(serviceTitle);

    // Store form data in localStorage
    localStorage.setItem('contactFormData', JSON.stringify({
      service: localizedServiceName,
      message
    }));

    // Dispatch custom event to notify Contact component
    window.dispatchEvent(new Event('contactFormUpdate'));

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [generateServiceMessage, getLocalizedServiceName]);

  // Service icons mapping
  const serviceIcons = [Code, Smartphone, Database, ShoppingCart, Settings, TrendingUp];

  // Service gradients
  const serviceGradients = [
    'from-[#b09155] to-[#d4af37]',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500'
  ];

  // Get services data from translations - memoized for performance
  const services = useState(() => 
    Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      icon: serviceIcons[index],
      title: t(`services.${index}.title`),
      description: t(`services.${index}.description`),
      features: Array.from({ length: 5 }, (_, featIndex) =>
        t(`services.${index}.features.${featIndex}`)
      ),
      gradient: serviceGradients[index],
      experience: t(`services.${index}.experience`),
    }))
  )[0];

  // Carousel navigation
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  }, [services.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  }, [services.length]);

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isMobile, nextSlide]);

  // Optimized variants with reduced complexity
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0 : 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id='services'
      className='py-24 bg-gradient-to-b from-[var(--background)] to-[var(--secondary)]'
    >
      <motion.div
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className='text-center mb-20'>
          <h2 className='text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6'>
            {t('title')}
            <span className='gradient-text block'>{t('titleHighlight')}</span>
          </h2>
          <p className='text-xl text-[var(--neutral-dark)] max-w-3xl mx-auto leading-relaxed'>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Services - Desktop Grid / Mobile Carousel */}
        {isMobile ? (
          /* Mobile Carousel */
          <div className='relative'>
            <div className='overflow-hidden'>
              <div 
                className='flex transition-transform duration-500 ease-out'
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {services.map((service) => (
                  <div key={service.id} className='w-full flex-shrink-0 px-2'>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='group relative'
                    >
                      <div className='h-full p-6 bg-[var(--glass)] backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl hover:border-[var(--primary)]/30 transition-all duration-300'>
                        {/* Icon & Gradient */}
                        <div className='relative mb-6'>
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${service.gradient} shadow-lg`}>
                            <service.icon size={24} className='text-white' />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className='text-xl font-bold text-[var(--foreground)] mb-3'>
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className='text-[var(--neutral-dark)] mb-4 text-sm leading-relaxed'>
                          {service.description}
                        </p>

                        {/* Features - Show only first 3 on mobile */}
                        <div className='space-y-2 mb-4'>
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className='flex items-start gap-2'>
                              <CheckCircle size={14} className='text-[var(--primary)] flex-shrink-0 mt-0.5' />
                              <span className='text-xs text-[var(--accent)]'>{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Experience Badge */}
                        <div className='flex items-center justify-center p-3 bg-[var(--secondary)]/50 rounded-lg mb-4'>
                          <div className='text-center'>
                            <div className='text-xs text-[var(--accent)] mb-1'>{t('labels.expertise')}</div>
                            <div className='text-sm font-bold text-[var(--primary)]'>{service.experience}</div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={() => handleServiceInquiry(service.title)}
                          className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold py-2.5 px-4 rounded-lg hover:shadow-lg transition-all duration-300 text-sm'
                        >
                          {t('buttons.discuss')}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            <div className='flex justify-between items-center mt-6'>
              <button
                onClick={prevSlide}
                className='flex items-center justify-center w-10 h-10 bg-[var(--glass)] border border-[var(--border)]/50 rounded-full hover:border-[var(--primary)]/30 transition-colors duration-300'
                aria-label='Previous service'
              >
                <ChevronLeft size={20} className='text-[var(--foreground)]' />
              </button>
              
              {/* Dots indicator */}
              <div className='flex space-x-2'>
                {services.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentSlide 
                        ? 'bg-[var(--primary)]' 
                        : 'bg-[var(--border)]'
                    }`}
                    aria-label={`Go to service ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className='flex items-center justify-center w-10 h-10 bg-[var(--glass)] border border-[var(--border)]/50 rounded-full hover:border-[var(--primary)]/30 transition-colors duration-300'
                aria-label='Next service'
              >
                <ChevronRight size={20} className='text-[var(--foreground)]' />
              </button>
            </div>
          </div>
        ) : (
          /* Desktop Grid */
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className='group relative'
              >
                <div className='h-full p-8 bg-[var(--glass)] backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl hover:border-[var(--primary)]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2'>
                  {/* Icon & Gradient */}
                  <div className='relative mb-6'>
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon size={32} className='text-white' />
                    </div>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.gradient} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                  </div>

                  {/* Title */}
                  <h3 className='text-2xl font-bold text-[var(--foreground)] mb-4 group-hover:text-[var(--primary)] transition-colors duration-300'>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className='text-[var(--neutral-dark)] mb-6 leading-relaxed'>
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className='space-y-3 mb-6'>
                    {service.features.map((feature, idx) => (
                      <div key={idx} className='flex items-start gap-3'>
                        <CheckCircle size={16} className='text-[var(--primary)] flex-shrink-0 mt-0.5' />
                        <span className='text-sm text-[var(--accent)]'>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Experience Badge */}
                  <div className='flex items-center justify-center p-4 bg-[var(--secondary)]/50 rounded-xl mb-6'>
                    <div className='text-center'>
                      <div className='text-sm text-[var(--accent)] mb-1'>{t('labels.expertise')}</div>
                      <div className='text-lg font-bold text-[var(--primary)]'>{service.experience}</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleServiceInquiry(service.title)}
                    className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300 group-hover:scale-105'
                  >
                    {t('buttons.discuss')}
                    <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform duration-300' />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className='text-center mt-20 p-8 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-dark)]/10 rounded-3xl border border-[var(--primary)]/20'
        >
          <h3 className='text-3xl font-bold text-[var(--foreground)] mb-4'>
            {t('cta.title')}
          </h3>
          <p className='text-lg text-[var(--neutral-dark)] mb-8 max-w-2xl mx-auto'>
            {t('cta.description')}
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <button
              onClick={() => handleServiceInquiry(t('services.2.title'))} // Custom Software service
              className='flex items-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300 hover:scale-105'
            >
              <Target size={20} />
              {t('buttons.contact')}
            </button>
            <button
              onClick={() => {
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                  portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className='flex items-center gap-2 border-2 border-[var(--primary)] text-[var(--primary)] font-semibold py-4 px-8 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all duration-300'
            >
              <TrendingUp size={20} />
              {t('buttons.references')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
