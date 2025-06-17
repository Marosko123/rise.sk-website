'use client';

import { motion } from 'framer-motion';
import {
  Code,
  Cloud,
  Palette,
  Shield,
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  StaggerReveal,
  CharacterReveal,
  VelocityScroll,
} from './AdvancedScrollEffects';
import { BentoCard } from './InteractiveElements';

export default function Services() {
  const t = useTranslations('services');

  const services = [
    {
      id: 1,
      icon: Code,
      title: t('new.development.title'),
      description: t('new.development.description'),
      features: [
        t('new.development.features.0'),
        t('new.development.features.1'),
        t('new.development.features.2'),
      ],
      benefits: [
        t('new.development.benefits.0'),
        t('new.development.benefits.1'),
        t('new.development.benefits.2'),
      ],
      team: t('new.development.team'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      icon: Cloud,
      title: t('new.devops.title'),
      description: t('new.devops.description'),
      features: [
        t('new.devops.features.0'),
        t('new.devops.features.1'),
        t('new.devops.features.2'),
      ],
      benefits: [
        t('new.devops.benefits.0'),
        t('new.devops.benefits.1'),
        t('new.devops.benefits.2'),
      ],
      team: t('new.devops.team'),
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      id: 3,
      icon: Palette,
      title: t('new.ux.title'),
      description: t('new.ux.description'),
      features: [
        t('new.ux.features.0'),
        t('new.ux.features.1'),
        t('new.ux.features.2'),
      ],
      benefits: [
        t('new.ux.benefits.0'),
        t('new.ux.benefits.1'),
        t('new.ux.benefits.2'),
      ],
      team: t('new.ux.team'),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 4,
      icon: Shield,
      title: t('new.qa.title'),
      description: t('new.qa.description'),
      features: [
        t('new.qa.features.0'),
        t('new.qa.features.1'),
        t('new.qa.features.2'),
      ],
      benefits: [
        t('new.qa.benefits.0'),
        t('new.qa.benefits.1'),
        t('new.qa.benefits.2'),
      ],
      team: t('new.qa.team'),
      gradient: 'from-red-500 to-orange-500',
    },
    {
      id: 5,
      icon: GraduationCap,
      title: t('new.education.title'),
      description: t('new.education.description'),
      features: [
        t('new.education.features.0'),
        t('new.education.features.1'),
        t('new.education.features.2'),
      ],
      benefits: [
        t('new.education.benefits.0'),
        t('new.education.benefits.1'),
        t('new.education.benefits.2'),
      ],
      team: t('new.education.team'),
      gradient: 'from-indigo-500 to-blue-500',
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
              {t('header.badge')}
            </span>
          </div>
          <CharacterReveal
            text={t('header.title')}
            className='text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6'
          />
          <p className='text-xl text-[var(--neutral-dark)] max-w-3xl mx-auto'>
            {t('header.subtitle')}
          </p>
        </motion.div>{' '}
        {/* Services Grid */}
        <StaggerReveal staggerDelay={0.3}>
          <div className='space-y-8'>
            {services.map((service, index) => (
              <VelocityScroll key={service.id}>
                <motion.div
                  variants={itemVariants}
                  className={`relative group ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} mb-12`}
                  data-cursor='hover'
                >
                  <BentoCard spotlight={true} className='p-8'>
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
                            <Target
                              size={16}
                              className='text-[var(--primary)]'
                            />
                            {t('labels.features')}
                          </h4>
                          <ul className='space-y-2'>
                            {service.features.map((feature, idx) => (
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
                            ))}
                          </ul>
                        </div>

                        {/* Benefits */}
                        <div className='space-y-3'>
                          <h4 className='font-semibold text-[var(--foreground)] flex items-center gap-2'>
                            <Zap size={16} className='text-[var(--primary)]' />
                            {t('labels.benefits')}
                          </h4>
                          <ul className='space-y-2'>
                            {service.benefits.map((benefit, idx) => (
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
                            ))}
                          </ul>
                        </div>

                        {/* Team Format */}
                        <div className='p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20'>
                          <h4 className='font-semibold text-[var(--foreground)] flex items-center gap-2 mb-2'>
                            <Users
                              size={16}
                              className='text-[var(--primary)]'
                            />
                            {t('labels.team')}
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
                </motion.div>
              </VelocityScroll>
            ))}
          </div>
        </StaggerReveal>
        {/* Why Rise.sk Section */}
        <motion.div
          variants={itemVariants}
          className='mt-24 pt-12 border-t border-[var(--border)]'
        >
          <div className='text-center mb-12'>
            <h3 className='text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4'>
              {t('comparison.title')}
            </h3>
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
