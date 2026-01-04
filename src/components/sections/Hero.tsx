'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
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
  const { hasClicked: hasClickedCheckup, handleClick: handleCheckupClick } = usePersistentClick('rise_has_clicked_checkup');
  const { hasClicked: hasClickedStartProject, handleClick: handleStartProjectClick } = usePersistentClick('rise_has_clicked_start_project');

  const containerVariants = {
    hidden: { opacity: 1 }, // Changed from 0 to 1 for LCP
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
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  const floatingIcons = [
    { Icon: Code, delay: 0, x: -20, y: -30 },
    { Icon: Globe, delay: 0.5, x: 20, y: -40 },
    { Icon: Zap, delay: 1, x: -30, y: 20 },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <section className='min-h-[calc(100dvh+80px)] flex items-center justify-center pt-32 relative overflow-hidden mt-[-80px]'>
        {/* Floating Background Elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {floatingIcons.map(({ Icon, delay, x, y }, index) => (
            <m.div
              key={index}
              className='absolute opacity-10'
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                x: [0, x, 0],
                y: [0, y, 0],
              }}
              transition={{
                duration: 2.5,
                delay: delay * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + index * 15}%`,
              }}
            >
              <Icon size={120} className='text-[var(--primary)]' />
            </m.div>
          ))}
        </div>

        <m.div
          className='max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center relative z-10'
          initial="visible" // Start visible to avoid hydration mismatch/delay
          animate="visible"
          variants={containerVariants}
        >
          <div className='max-w-6xl mx-auto'>
            {/* Main Headline */}
            <h1
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
            </h1>

            {/* Company Description */}
            <m.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className='mb-12 max-w-4xl mx-auto'
            >
              <p className='text-xl md:text-2xl text-[var(--neutral-dark)] leading-relaxed mb-6'>
                {t('description')}
              </p>
              <p className='text-lg text-slate-300 leading-relaxed'>
                {t('subtitle')}
              </p>
            </m.div>

            {/* CTA Buttons */}
            <m.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16'
            >
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
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
}
