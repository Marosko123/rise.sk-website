'use client';

import { motion } from 'framer-motion';
import {
  Award,
  CheckCircle,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Section } from './ui/Section';

export default function About() {
  const t = useTranslations('about');

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
      className="bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#1a1a1a] relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.2),transparent_50%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.2),transparent_50%)]' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            {t('title')}
            <span className='bg-gradient-to-r from-primary via-primary-light to-primary-dark bg-clip-text text-transparent block'>
              {t('titleHighlight')}
            </span>
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
            {t('description')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              data-cursor='hover'
            >
              <Card className='text-center h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-white/10 backdrop-blur-sm hover:bg-gradient-to-br hover:from-gray-800/60 hover:to-gray-700/60 transition-all duration-300'>
                <div className='flex justify-center mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                    <stat.icon className='w-6 h-6 text-white' />
                  </div>
                </div>
                <div className='text-3xl font-bold text-white mb-2'>
                  {stat.number}
                </div>
                <div className='text-primary font-semibold mb-2'>
                  {stat.label}
                </div>
                <div className='text-sm text-gray-400'>{stat.description}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Values Section */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              data-cursor='hover'
            >
              <Card className='h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-white/10 backdrop-blur-sm hover:bg-gradient-to-br hover:from-gray-800/60 hover:to-gray-700/60 transition-all duration-300'>
                <div className='flex items-center mb-6'>
                  <div className='w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mr-4'>
                    <value.icon className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-xl font-bold text-white'>
                    {value.title}
                  </h3>
                </div>
                <p className='text-gray-300 leading-relaxed'>
                  {value.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='text-center mt-16'
        >
          <div className='bg-gradient-to-r from-primary/20 to-primary-dark/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto'>
            <h3 className='text-2xl md:text-3xl font-bold text-white mb-4'>
              {t('cta.title')}
            </h3>
            <p className='text-gray-300 text-lg mb-8 max-w-2xl mx-auto'>
              {t('cta.description')}
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Button href='#contact' variant='primary' className='bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker transition-all duration-300'>
                {t('cta.startProject')}
              </Button>
              <Button href='#services' variant='outline' className='border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300'>
                {t('cta.viewServices')}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
