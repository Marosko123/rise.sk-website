'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Cloud,
  Code,
  GraduationCap,
  Palette,
  Shield,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  CharacterReveal,
  StaggerReveal,
  VelocityScroll,
} from './AdvancedScrollEffects';
import { BentoCard } from './InteractiveElements';

export default function Services() {
  const t = useTranslations('services');

  const services = [
    {
      id: 1,
      icon: Code,
      title: t('webDev.title'),
      description: t('webDev.description'),
      features: t.raw('webDev.features'),
      benefits: t.raw('webDev.benefits'),
      team: t('webDev.team'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      icon: Cloud,
      title: t('devops.title'),
      description: t('devops.description'),
      features: t.raw('devops.features'),
      benefits: t.raw('devops.benefits'),
      team: t('devops.team'),
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      id: 3,
      icon: Palette,
      title: t('design.title'),
      description: t('design.description'),
      features: t.raw('design.features'),
      benefits: t.raw('design.benefits'),
      team: t('design.team'),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 4,
      icon: Shield,
      title: t('qa.title'),
      description: t('qa.description'),
      features: t.raw('qa.features'),
      benefits: t.raw('qa.benefits'),
      team: t('qa.team'),
      gradient: 'from-red-500 to-orange-500',
    },
    {
      id: 5,
      icon: GraduationCap,
      title: t('education.title'),
      description: t('education.description'),
      features: t.raw('education.features'),
      benefits: t.raw('education.benefits'),
      team: t('education.team'),
      gradient: 'from-yellow-500 to-amber-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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
        viewport={{ once: true }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-[var(--glass)] backdrop-blur-sm border border-[var(--primary)]/20 rounded-full px-6 py-3 mb-6'>
            <Zap size={16} className='text-[var(--primary)]' />
            <span className='text-sm font-medium text-[var(--primary)]'>
              {t('badge')}
            </span>
          </div>
          <h2 className='text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6'>
            {t('title')}
            <span className='gradient-text block'>{t('titleHighlight')}</span>
          </h2>
          <CharacterReveal
            text={t('subtitle')}
            className='text-xl text-[var(--neutral-dark)] max-w-3xl mx-auto'
          />
        </motion.div>

        {/* Services Grid */}
        <StaggerReveal staggerDelay={0.3}>
          {services.map((service, index) => (
            <VelocityScroll key={service.id}>
              <div
                className={`relative group ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} mb-12`}
              >
                <BentoCard spotlight={true} className='p-8' data-cursor='hover'>
                  <div
                    className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:text-right' : ''}`}
                  >
                    {/* Content */}
                    <div className='space-y-6'>
                      <div className='flex items-center gap-4'>
                        <div
                          className={`p-4 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-lg`}
                        >
                          <service.icon size={32} className='text-white' />
                        </div>
                        <div>
                          <h3 className='text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2'>
                            {service.title}
                          </h3>
                        </div>
                      </div>

                      <p className='text-lg text-[var(--neutral-dark)] leading-relaxed'>
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className='space-y-3'>
                        <h4 className='font-semibold text-[var(--foreground)] flex items-center gap-2'>
                          <Target size={16} className='text-[var(--primary)]' />
                          What we do
                        </h4>
                        <ul className='space-y-2'>
                          {service.features.map(
                            (feature: string, idx: number) => (
                              <li
                                key={idx}
                                className='flex items-center gap-3 text-[var(--accent)]'
                              >
                                <CheckCircle
                                  size={16}
                                  className='text-[var(--primary)] flex-shrink-0'
                                />
                                {feature}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div className='space-y-3'>
                        <h4 className='font-semibold text-[var(--foreground)] flex items-center gap-2'>
                          <Zap size={16} className='text-[var(--primary)]' />
                          Why it sells
                        </h4>
                        <ul className='space-y-2'>
                          {service.benefits.map(
                            (benefit: string, idx: number) => (
                              <li
                                key={idx}
                                className='flex items-start gap-3 text-[var(--accent)]'
                              >
                                <ArrowRight
                                  size={16}
                                  className='text-[var(--primary)] flex-shrink-0 mt-0.5'
                                />
                                {benefit}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Team Format */}
                      <div className='p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20'>
                        <h4 className='font-semibold text-[var(--foreground)] flex items-center gap-2 mb-2'>
                          <Users size={16} className='text-[var(--primary)]' />
                          Team format
                        </h4>
                        <p className='text-[var(--accent)] text-sm'>
                          {service.team}
                        </p>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className='relative'>
                      <div
                        className={`relative p-8 rounded-3xl bg-gradient-to-br ${service.gradient} shadow-2xl`}
                      >
                        <div className='absolute inset-0 bg-black/10 rounded-3xl'></div>
                        <div className='relative z-10'>
                          <service.icon
                            size={120}
                            className='text-white/80 mb-6'
                          />
                          <div className='space-y-4'>
                            <div className='h-3 bg-white/30 rounded-full w-3/4'></div>
                            <div className='h-3 bg-white/20 rounded-full w-1/2'></div>
                            <div className='h-3 bg-white/10 rounded-full w-2/3'></div>
                          </div>
                        </div>
                      </div>

                      {/* Floating elements */}
                      <motion.div
                        className='absolute -top-6 -right-6 w-12 h-12 bg-[var(--primary)] rounded-full shadow-lg'
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                      />
                      <motion.div
                        className='absolute -bottom-4 -left-4 w-8 h-8 bg-[var(--glow)] rounded-full shadow-lg'
                        animate={{ y: [0, 10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      />
                    </div>
                  </div>
                </BentoCard>
              </div>
            </VelocityScroll>
          ))}
        </StaggerReveal>

        {/* Why Rise.sk Section */}
        <motion.div
          variants={itemVariants}
          className='mt-24 pt-12 border-t border-[var(--border)]'
        >
          <div className='text-center mb-12'>
            <CharacterReveal
              text={t('comparison.title')}
              className='text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4'
            />
            <p className='text-lg text-[var(--neutral-dark)]'>
              {t('comparison.subtitle')}
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            <div className='space-y-6'>
              <h4 className='text-2xl font-bold text-[var(--primary)]'>
                {t('comparison.risesk.title')}
              </h4>
              <div className='space-y-4'>
                <div className='p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20'>
                  <h5 className='font-semibold text-[var(--foreground)] mb-2'>
                    {t('comparison.risesk.background.title')}
                  </h5>
                  <p className='text-[var(--accent)] text-sm'>
                    {t('comparison.risesk.background.description')}
                  </p>
                </div>
                <div className='p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20'>
                  <h5 className='font-semibold text-[var(--foreground)] mb-2'>
                    {t('comparison.risesk.innovation.title')}
                  </h5>
                  <p className='text-[var(--accent)] text-sm'>
                    {t('comparison.risesk.innovation.description')}
                  </p>
                </div>
                <div className='p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20'>
                  <h5 className='font-semibold text-[var(--foreground)] mb-2'>
                    {t('comparison.risesk.delivery.title')}
                  </h5>
                  <p className='text-[var(--accent)] text-sm'>
                    {t('comparison.risesk.delivery.description')}
                  </p>
                </div>
                <div className='p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20'>
                  <h5 className='font-semibold text-[var(--foreground)] mb-2'>
                    {t('comparison.risesk.cost.title')}
                  </h5>
                  <p className='text-[var(--accent)] text-sm'>
                    {t('comparison.risesk.cost.description')}
                  </p>
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <h4 className='text-2xl font-bold text-[var(--accent)]'>
                {t('comparison.outsourcer.title')}
              </h4>
              <div className='space-y-4'>
                <div className='p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)]'>
                  <h5 className='font-semibold text-[var(--foreground)] mb-2'>
                    {t('comparison.outsourcer.background.title')}
                  </h5>
                  <p className='text-[var(--accent)] text-sm'>
                    {t('comparison.outsourcer.background.description')}
                  </p>
                </div>
                <div className='p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)]'>
                  <h5 className='font-semibold text-[var(--foreground)] mb-2'>
                    {t('comparison.outsourcer.innovation.title')}
                  </h5>
                  <p className='text-[var(--accent)] text-sm'>
                    {t('comparison.outsourcer.innovation.description')}
                  </p>
                </div>
                <div className='p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)]'>
                  <h5 className='font-semibold text-[var(--foreground)] mb-2'>
                    {t('comparison.outsourcer.delivery.title')}
                  </h5>
                  <p className='text-[var(--accent)] text-sm'>
                    {t('comparison.outsourcer.delivery.description')}
                  </p>
                </div>
                <div className='p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)]'>
                  <h5 className='font-semibold text-[var(--foreground)] mb-2'>
                    {t('comparison.outsourcer.cost.title')}
                  </h5>
                  <p className='text-[var(--accent)] text-sm'>
                    {t('comparison.outsourcer.cost.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
