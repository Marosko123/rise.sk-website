'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { motion, useInView } from 'framer-motion';
import {
    Award,
    CheckCircle,
    Target,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import { useRef } from 'react';

import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

export default function About() {
  const t = useTranslations('about');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const stats = [
    {
      icon: Target,
      number: t('stats.delivery.number'),
      label: t('stats.delivery.label'),
      description: t('stats.delivery.description'),
    },
    {
      icon: TrendingUp,
      number: t('stats.savings.number'),
      label: t('stats.savings.label'),
      description: t('stats.savings.description'),
    },
    {
      icon: Zap,
      number: t('stats.ready.number'),
      label: t('stats.ready.label'),
      description: t('stats.ready.description'),
    },
    {
      icon: Award,
      number: t('stats.expertise.number'),
      label: t('stats.expertise.label'),
      description: t('stats.expertise.description'),
    },
  ];

  const values = [
    {
      icon: CheckCircle,
      title: t('values.security.title'),
      description: t('values.security.description'),
    },
    {
      icon: Users,
      title: t('values.teams.title'),
      description: t('values.teams.description'),
    },
    {
      icon: Target,
      title: t('values.performance.title'),
      description: t('values.performance.description'),
    },
  ];

  return (
    <Section
      id="about"
      ref={ref}
      background="transparent"
      className="relative overflow-hidden"
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className='text-center mb-10'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            {t('title')}
            <span className='bg-gradient-to-r from-primary via-primary-light to-primary-dark bg-clip-text text-transparent block pb-1'>
              {t('titleHighlight')}
            </span>
          </h2>
          <p className='text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed'>
            {t('description')}
          </p>
        </motion.div>

        {/* Stats Grid - Compact 2x2 on mobile */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12'>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              data-cursor='hover'
            >
              <Card className='text-center h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-white/10 backdrop-blur-sm hover:bg-gradient-to-br hover:from-gray-800/60 hover:to-gray-700/60 transition-all duration-300 p-4 md:p-6'>
                <div className='flex justify-center mb-3'>
                  <div className='w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                    <stat.icon className='w-5 h-5 md:w-6 md:h-6 text-white' />
                  </div>
                </div>
                <div className='text-2xl md:text-3xl font-bold text-white mb-1'>
                  {stat.number}
                </div>
                <div className='text-primary font-semibold mb-1 text-sm md:text-base'>
                  {stat.label}
                </div>
                <div className='text-xs md:text-sm text-gray-400 hidden md:block'>{stat.description}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Values Section - Slider on mobile */}
        <div className='flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-6 scrollbar-hide'>
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="min-w-[85vw] md:min-w-0 snap-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              data-cursor='hover'
            >
              <Card className='h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-white/10 backdrop-blur-sm hover:bg-gradient-to-br hover:from-gray-800/60 hover:to-gray-700/60 transition-all duration-300'>
                <div className='flex items-center mb-4'>
                  <div className='w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mr-4'>
                    <value.icon className='w-5 h-5 md:w-6 md:h-6 text-white' />
                  </div>
                  <h3 className='text-lg md:text-xl font-bold text-white'>
                    {value.title}
                  </h3>
                </div>
                <p className='text-gray-300 leading-relaxed text-sm md:text-base'>
                  {value.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        {/* Removed redundant CTA section */}
      </div>
    </Section>
  );
}
