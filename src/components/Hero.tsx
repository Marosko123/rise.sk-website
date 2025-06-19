'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code, Globe, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { MagneticButton } from './InteractiveElements';

export default function Hero() {
  const t = useTranslations('hero');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
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
    <section className='hero-gradient min-h-screen flex items-center justify-center pt-16 relative overflow-hidden'>
      {/* Floating Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            className='absolute opacity-10'
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              x: [0, x, 0],
              y: [0, y, 0],
            }}
            transition={{
              duration: 4,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${20 + index * 25}%`,
              top: `${30 + index * 15}%`,
            }}
          >
            <Icon size={120} className='text-[var(--primary)]' />
          </motion.div>
        ))}
      </div>

      <motion.div
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <div className='max-w-6xl mx-auto'>
          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className='text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight'
          >
            <span className='text-[var(--foreground)]'>
              {t('title.build')}{' '}
            </span>
            <span className='gradient-text'>{t('title.bulletProof')}</span>
            <br />
            <span className='text-[var(--foreground)]'>
              {t('title.digitalProducts')}
            </span>
          </motion.h1>

          {/* Company Description */}
          <motion.div
            variants={itemVariants}
            className='mb-12 max-w-4xl mx-auto'
          >
            <p className='text-xl md:text-2xl text-[var(--neutral-dark)] leading-relaxed mb-6'>
              <span className='text-[var(--primary)] font-semibold'>
                Rise.sk s.r.o.
              </span>{' '}
              {t('description')}
            </p>
            <p className='text-lg text-[var(--accent)] leading-relaxed'>
              {t('subtitle')}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-16'
          >
            <MagneticButton
              href='#contact'
              variant='primary'
              className='text-lg shadow-lg hover:shadow-xl glow-hover'
            >
              {t('startProject')}
              <ArrowRight size={20} className='ml-2' />
            </MagneticButton>

            <MagneticButton
              href='#contact'
              variant='secondary'
              className='text-lg border-2'
            >
              {t('freeConsultation')}
              <div className='w-2 h-2 bg-current rounded-full ml-2 animate-pulse'></div>
            </MagneticButton>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            variants={itemVariants}
            className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto'
          >
            {[
              { key: 'onTimeDelivery' },
              { key: 'costSavings' },
              { key: 'teamReady' },
            ].map((metric, index) => (
              <motion.div
                key={index}
                className='text-center'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
              >
                <div className='text-3xl md:text-4xl font-bold text-[var(--primary)] mb-2'>
                  {t(`metrics.${metric.key}.number`)}
                </div>
                <div className='text-[var(--accent)] text-sm uppercase tracking-wide'>
                  {t(`metrics.${metric.key}.label`)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
