'use client';

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code, Globe, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { usePersistentClick } from '@/hooks/usePersistentClick';
import { Button } from '../ui/Button';

interface HeroProps {
  contactSectionId?: string;
}

export default function Hero({ contactSectionId = 'contact' }: HeroProps) {
  const t = useTranslations('hero');
  const tNav = useTranslations('navigation');
  const shouldReduceMotion = useReducedMotion();
  const { hasClicked: hasClickedCheckup, handleClick: handleCheckupClick } = usePersistentClick('rise_has_clicked_checkup');
  const { hasClicked: hasClickedStartProject, handleClick: handleStartProjectClick } = usePersistentClick('rise_has_clicked_start_project');

  // Dramatic entrance: starts zoomed in and blurred, zooms out to reveal
  const heroEntranceVariants = {
    hidden: {
      scale: 1.3,
      opacity: 0,
      filter: 'blur(20px)',
    },
    visible: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth deceleration
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Headline slides up with spring physics
  const headlineVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Description fades in with slight upward motion
  const descriptionVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // Buttons pop in with scale
  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Enhanced floating icons with more dramatic entrance
  const floatingIcons = [
    { Icon: Code, delay: 0.8, x: -20, y: -30 },
    { Icon: Globe, delay: 1.0, x: 20, y: -40 },
    { Icon: Zap, delay: 1.2, x: -30, y: 20 },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <section className='min-h-[calc(100dvh+80px)] flex items-center justify-center pt-32 relative overflow-hidden mt-[-80px]'>
        {/* Radiant glow effect on entrance */}
        <m.div
          className='absolute inset-0 pointer-events-none'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(218,181,73,0.15)_0%,transparent_60%)] blur-[60px]' />
        </m.div>

        {/* Floating Background Elements - delayed entrance */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {floatingIcons.map(({ Icon, delay, x, y }, index) => (
            <m.div
              key={index}
              className='absolute'
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{
                opacity: 0.15,
                scale: 1,
                rotate: shouldReduceMotion ? 0 : -10, // Slight static rotation
              }}
              transition={{
                duration: 1.5,
                delay: shouldReduceMotion ? 0 : delay,
                ease: 'easeOut',
              }}
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + index * 15}%`,
              }}
            >
              {/* Nested div for continuous floating motion */}
              <m.div
                animate={{
                  x: [0, x, 0],
                  y: [0, y, 0],
                  rotate: [0, 5, 0], // Gentle rotation wobble
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 6, // Slower, smoother float
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: 'easeInOut',
                }}
              >
                <Icon size={120} className='text-[var(--primary)]' />
              </m.div>
            </m.div>
          ))}
        </div>

        {/* Main Content - Dramatic zoom reveal */}
        <m.div
          className='max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center relative z-10'
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate='visible'
          variants={heroEntranceVariants}
        >
          <div className='max-w-6xl mx-auto'>
            {/* Main Headline - Slides up dramatically */}
            <m.h1
              variants={headlineVariants}
              className='text-4xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight select-none'
            >
              <span className='text-[var(--foreground)]'>
                {t('title.build')}{' '}
              </span>
              <span className='gradient-text'>{t('title.bulletProof')}</span>
              <br />
              <span className='text-[var(--foreground)]'>
                {t('title.digitalProducts')}
              </span>
            </m.h1>

            {/* Company Description - Fades in smoothly */}
            <m.div
              variants={descriptionVariants}
              className='mb-12 max-w-4xl mx-auto'
            >
              <p className='text-xl md:text-2xl text-[var(--neutral-dark)] leading-relaxed mb-6'>
                {t('description')}
              </p>
              <p className='text-lg text-slate-300 leading-relaxed'>
                {t('subtitle')}
              </p>
            </m.div>

            {/* CTA Buttons - Pop in with stagger */}
            <m.div
              variants={buttonContainerVariants}
              className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16'
            >
              <m.div variants={buttonVariants}>
                <Button
                  href="/otestujte-podnikanie"
                  variant='outline'
                  className="text-lg select-none glow hover:glow-hover border-2 relative overflow-hidden"
                  onClick={handleCheckupClick}
                >
                  <span className="relative z-10">{tNav('testYourBusiness')}</span>
                  {!hasClickedCheckup && (
                    <div className="absolute inset-0 -translate-x-full animate-sheen bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  )}
                </Button>
              </m.div>
              <m.div variants={buttonVariants}>
                <Button
                  href={`#${contactSectionId}`}
                  variant='primary'
                  className='text-lg shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker transition-all duration-300 select-none relative overflow-hidden group'
                  onClick={handleStartProjectClick}
                >
                  <span className="relative z-10 flex items-center">
                    {t('startProject')}
                    <ArrowRight size={20} className='ml-2' />
                  </span>
                  {!hasClickedStartProject && (
                    <div className="absolute inset-0 -translate-x-full animate-sheen bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" style={{ animationDelay: '0.4s' }} />
                  )}
                </Button>
              </m.div>
            </m.div>
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
}
