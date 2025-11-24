'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { motion, useInView } from 'framer-motion';
import {
  Award,
  CheckCircle,
  Coffee,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useRef } from 'react';

import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

export default function About({ id = 'about' }: { id?: string }) {
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
      id={id}
      ref={ref}
      background="transparent"
      className="relative overflow-hidden select-none"
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
            <span className='bg-gradient-to-r from-primary via-primary-light to-primary bg-[length:200%_auto] animate-text-shimmer bg-clip-text text-transparent block pb-1'>
              {t('titleHighlight')}
            </span>
          </h2>
          <p className='text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed select-text'>
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
              <Card className='group relative text-center h-full bg-white/5 border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 p-6 md:p-8 overflow-hidden rounded-2xl'>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className='relative z-10 flex flex-col items-center'>
                  <div className='mb-4 p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-dark/20 border border-primary/30 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(255,215,0,0.1)]'>
                    <stat.icon className='w-6 h-6 md:w-8 md:h-8 text-primary' />
                  </div>

                  <div className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-sm select-text'>
                    {stat.number}
                  </div>

                  <div className='text-primary font-medium mb-2 text-sm md:text-base uppercase tracking-wide'>
                    {stat.label}
                  </div>

                  <div className='text-xs md:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 hidden md:block max-w-[80%] mx-auto select-text'>
                    {stat.description}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <div className="mt-24 mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Title & Context */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 lg:sticky lg:top-32"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-[length:200%_auto] animate-text-shimmer bg-clip-text text-transparent">
                {t('story.title')}
              </span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary via-primary-light to-primary bg-[length:200%_auto] animate-text-shimmer rounded-full" />
          </motion.div>

          {/* Right Column: Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="prose prose-lg prose-invert text-gray-400 select-text">
              <p className="text-lg leading-relaxed">
                {t('story.p1')}
              </p>
              <p className="text-lg leading-relaxed">
                {t('story.p2')}
              </p>
            </div>

            {/* CTA Box */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-lg" />
              <div className="relative bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-xl">
                <div className="flex flex-col gap-6">
                  <p className="text-xl font-medium text-white leading-relaxed italic select-text">
                    "{t('story.cta')}"
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-900 to-black border border-primary/30 flex items-center justify-center shadow-lg">
                        <Coffee className="w-6 h-6 text-primary" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm text-gray-400 uppercase tracking-wider font-medium">Let's meet</span>
                        <span className="text-white font-semibold">Coffee & Code</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
              <Card className='group relative h-full bg-white/5 border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 p-6 md:p-8 overflow-hidden rounded-2xl'>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className='relative z-10 flex items-start'>
                  <div className='mb-4 p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-dark/20 border border-primary/30 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(255,215,0,0.1)] mr-4 shrink-0'>
                    <value.icon className='w-6 h-6 text-primary' />
                  </div>
                  <div>
                    <h3 className='text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300'>
                      {value.title}
                    </h3>
                    <p className='text-gray-400 group-hover:text-gray-300 leading-relaxed text-sm md:text-base transition-colors duration-300 select-text'>
                      {value.description}
                    </p>
                  </div>
                </div>
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
