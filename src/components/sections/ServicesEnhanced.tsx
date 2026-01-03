'use client';

import Breadcrumbs, { BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { MobileCarousel } from '@/components/ui/MobileCarousel';
import { AppPathnames, Link } from '@/i18n/routing';
import { motion, useInView } from 'framer-motion';
import Lottie from 'lottie-react';
import { ArrowRight, Brain, Code2, Laptop, ShoppingCart, Smartphone, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

interface ServicesEnhancedProps {
  breadcrumbs?: BreadcrumbItem[];
  id?: string;
}

// Global cache for Lottie animations to prevent re-fetching
const lottieCache = new Map<string, object>();

const LottieIcon = ({ url, fallbackIcon: Icon, speed = 0.5 }: { url: string, fallbackIcon: React.ElementType, gradient?: string, speed?: number }) => {
  const [animationData, setAnimationData] = useState<object | null>(() => lottieCache.get(url) || null);
  const [error, setError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    // If already cached, don't fetch again
    if (lottieCache.has(url)) {
      setAnimationData(lottieCache.get(url)!);
      return;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        lottieCache.set(url, data); // Cache the animation
        setAnimationData(data);
      })
      .catch(() => setError(true));
  }, [url]);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [animationData, speed]);

  if (error || !animationData) {
    // Fallback to static icon if Lottie fails to load
    // Using text-white/90 for better visibility than gradient text on dark background
    return <Icon className="w-20 h-20 text-white/90" strokeWidth={1.5} />;
  }

  return <Lottie lottieRef={lottieRef} animationData={animationData} loop={true} className="w-32 h-32" />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ServiceCard = ({ service, learnMoreText }: { service: any; learnMoreText: string }) => (
  <Link
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    href={service.path as any}
    className="block h-full"
  >
    <div className="group relative h-[340px] bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-500 overflow-hidden cursor-pointer">
      {/* Number Badge */}
      <div className="absolute top-4 left-4 text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors duration-500">
        {service.number}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon SVG Container */}
        <div className="flex-1 flex items-center justify-center mb-4 relative">
          {/* Gradient Background Circle */}
          <div className={`absolute w-40 h-40 rounded-lg bg-gradient-to-br ${service.gradient} blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />

          {/* Icon */}
          <div className={`relative p-6 rounded-xl bg-gradient-to-br ${service.gradient} group-hover:scale-110 transition-all duration-500`}>
            <LottieIcon url={service.lottieUrl} fallbackIcon={service.icon} gradient={service.iconGradient} speed={service.speed} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Arrow Icon */}
        <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="text-sm font-semibold">{learnMoreText}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Hover Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl pointer-events-none`} />
    </div>
  </Link>
);

const ServicesEnhanced: React.FC<ServicesEnhancedProps> = ({ breadcrumbs, id = 'services' }) => {
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Main services with icons
  const services = [
    {
      id: 1,
      number: '01',
      title: t('serviceItems.webDevelopment'),
      description: t('serviceDescriptions.webDevelopment'),
      icon: Laptop,
      lottieUrl: 'https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json', // Web Development
      path: '/sluzby/tvorba-web-stranok' as AppPathnames,
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconGradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 2,
      number: '02',
      title: t('serviceItems.ecommerce'),
      description: t('serviceDescriptions.ecommerce'),
      icon: ShoppingCart,
      lottieUrl: 'https://assets9.lottiefiles.com/packages/lf20_5tkzkblw.json', // Moved from Web Development
      path: '/sluzby/tvorba-eshopu' as AppPathnames,
      gradient: 'from-amber-500/20 to-yellow-500/20',
      iconGradient: 'from-amber-500 to-yellow-500'
    },
    {
      id: 3,
      number: '03',
      title: t('serviceItems.mobileApps'),
      description: t('serviceDescriptions.mobileApps'),
      icon: Smartphone,
      lottieUrl: 'https://lottie.host/f09666e8-2190-4534-a6fa-495f9f09da32/ZOsdEH6xVn.json', // Mobile App Development
      path: '/sluzby/vyvoj-mobilnych-aplikacii' as AppPathnames,
      gradient: 'from-orange-500/20 to-amber-600/20',
      iconGradient: 'from-orange-500 to-amber-600'
    },
    {
      id: 4,
      number: '04',
      title: t('serviceItems.customSoftware'),
      description: t('serviceDescriptions.customSoftware'),
      icon: Code2,
      lottieUrl: 'https://assets3.lottiefiles.com/packages/lf20_qp1q7mct.json', // AI Brain (moved from AI)
      path: '/sluzby/softver-na-mieru' as AppPathnames,
      gradient: 'from-yellow-600/20 to-amber-500/20',
      iconGradient: 'from-yellow-600 to-amber-500'
    },
    {
      id: 5,
      number: '05',
      title: t('serviceItems.ai'),
      description: t('serviceDescriptions.ai'),
      icon: Brain,
      lottieUrl: 'https://lottie.host/ff208ac5-e4e3-4935-9a22-35fccba676f3/iA6KylxwLI.json', // Robot animation // New Brain Animation
      path: '/sluzby/ai-automatizacia' as AppPathnames,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconGradient: 'from-blue-500 to-cyan-500',
      speed: 1.2
    },
    {
      id: 6,
      number: '06',
      title: t('serviceItems.outsourcing'),
      description: t('serviceDescriptions.outsourcing'),
      icon: Users,
      lottieUrl: 'https://assets9.lottiefiles.com/packages/lf20_iv4dsx3q.json', // Team
      path: '/sluzby/it-outsourcing' as AppPathnames,
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconGradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section
      id={id}
      ref={ref}
      className="relative py-24 overflow-hidden bg-transparent"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <div className="mb-12 flex justify-center">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            {tCommon('ourServices')}
          </h2>
        </motion.div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <MobileCarousel className="-mx-4 px-4 pb-8">
            {services.map((service) => <ServiceCard key={service.id} service={service} learnMoreText={tCommon('learnMore')} />)}
          </MobileCarousel>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ServiceCard service={service} learnMoreText={tCommon('learnMore')} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesEnhanced;
