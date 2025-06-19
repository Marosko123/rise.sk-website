'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Shield,
  Target,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BentoCard } from './InteractiveElements';

export default function EngagementModels() {
  const t = useTranslations('engagement');

  const models = [
    {
      id: 1,
      icon: Users,
      title: t('models.dedicated.title'),
      description: t('models.dedicated.description'),
      features: [
        t('models.dedicated.features.0'),
        t('models.dedicated.features.1'),
        t('models.dedicated.features.2'),
        t('models.dedicated.features.3'),
      ],
      ideal: t('models.dedicated.ideal'),
      gradient: 'from-[#b09155] to-[#d4af37]',
    },
    {
      id: 2,
      icon: Target,
      title: t('models.project.title'),
      description: t('models.project.description'),
      features: [
        t('models.project.features.0'),
        t('models.project.features.1'),
        t('models.project.features.2'),
        t('models.project.features.3'),
      ],
      ideal: t('models.project.ideal'),
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      id: 3,
      icon: UserPlus,
      title: t('models.staff.title'),
      description: t('models.staff.description'),
      features: [
        t('models.staff.features.0'),
        t('models.staff.features.1'),
        t('models.staff.features.2'),
        t('models.staff.features.3'),
      ],
      ideal: t('models.staff.ideal'),
      gradient: 'from-[#9a7f4b] to-[#b8860b]',
    },
  ];

  const guarantees = [t('guarantees.0'), t('guarantees.1'), t('guarantees.2')];

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
      id='engagement'
      className='py-24 bg-gradient-to-b from-[var(--secondary)] to-[var(--background)]'
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
          <p className='text-xl text-[var(--neutral-dark)] max-w-3xl mx-auto'>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Models Grid */}
        <div className='grid md:grid-cols-3 gap-8 mb-16'>
          {models.map((model, _index) => (
            <motion.div
              key={model.id}
              variants={itemVariants}
              className='relative group'
            >
              <BentoCard spotlight={true} className='h-full'>
                {/* Icon */}
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${model.gradient} shadow-lg mb-6`}
                >
                  <model.icon size={32} className='text-white' />
                </div>

                {/* Title & Description */}
                <h3 className='text-2xl font-bold text-white mb-4'>
                  {model.title}
                </h3>
                <p className='text-gray-300 mb-6 leading-relaxed'>
                  {model.description}
                </p>

                {/* Features */}
                <ul className='space-y-3 mb-6'>
                  {model.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className='flex items-center gap-3 text-gray-300'
                    >
                      <CheckCircle
                        size={16}
                        className='text-[#b09155] flex-shrink-0'
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Ideal For */}
                <div className='p-4 bg-white/5 rounded-xl border border-white/10'>
                  <p className='text-sm text-gray-300 font-medium'>
                    💡 {model.ideal}
                  </p>
                </div>
              </BentoCard>
            </motion.div>
          ))}
        </div>

        {/* Guarantees */}
        <motion.div variants={itemVariants}>
          <BentoCard spotlight={true} className='text-center'>
            <div className='flex items-center justify-center gap-2 mb-6'>
              <Shield size={20} className='text-[#b09155]' />
              <h3 className='text-2xl font-bold text-white'>
                All Models Include
              </h3>
            </div>

            <div className='flex flex-wrap justify-center gap-8'>
              {guarantees.map((guarantee, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <CheckCircle size={16} className='text-[#b09155]' />
                  <span className='text-gray-300 font-medium'>{guarantee}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
