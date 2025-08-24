'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Briefcase,
  Code,
  Mail,
  Megaphone,
  Palette,
  Users,
} from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import Image from 'next/image';

import { Card } from './ui/Card';
import { Section } from './ui/Section';

export default function Hiring() {
  const t = useTranslations('hiring');

  const positions = [
    {
      key: 'programming',
      icon: Code,
      color: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-500/10 to-indigo-600/10',
    },
    {
      key: 'digitalMarketing',
      icon: Megaphone,
      color: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-600/10',
    },
    {
      key: 'ai',
      icon: Bot,
      color: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-500/10 to-violet-600/10',
    },
  ];

  const perks = [
    {
      key: 'innovation',
      icon: Bot,
    },
    {
      key: 'team',
      icon: Users,
    },
    {
      key: 'culture',
      icon: Palette,
    },
    {
      key: 'growth',
      icon: Briefcase,
    },
  ];

  return (
    <Section
      id="hiring"
      className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden"
    >
      {/* Simplified Background Effects */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(96,165,250,0.08),transparent_60%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.08),transparent_60%)]' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            {t('title')}
            <span className='bg-gradient-to-r from-[#b09155] via-[#d4af37] to-[#b8860b] bg-clip-text text-transparent block'>
              {t('titleHighlight')}
            </span>
          </h2>

          <p className='text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto'>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Open Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className='mb-16'
        >
          <h3 className='text-2xl font-bold text-white mb-8 text-center'>
            {t('openPositions')}
          </h3>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {positions.map((position, index) => (
              <motion.div
                key={position.key}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: index * 0.08
                }}
              >
                <Card className={`h-full bg-gradient-to-br ${position.bgGradient} border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 ease-out group`}>
                  <div className='flex items-center mb-4'>
                    <div className={`w-12 h-12 bg-gradient-to-br ${position.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out`}>
                      <position.icon className='w-6 h-6 text-white' />
                    </div>
                    <h4 className='text-xl font-bold text-white ml-4'>
                      {t(`positions.${position.key}.title`)}
                    </h4>
                  </div>

                  <p className='text-gray-300 mb-4 leading-relaxed'>
                    {t(`positions.${position.key}.description`)}
                  </p>

                  <div className='mb-4'>
                    <h5 className='text-sm font-semibold text-[#b09155] mb-2'>
                      {t('skillsNeeded')}:
                    </h5>
                    <div className='flex flex-wrap gap-2'>
                      {t(`positions.${position.key}.skills`)
                        .split(',')
                        .map((skill: string, skillIndex: number) => (
                          <span
                            key={skillIndex}
                            className='px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-lg'
                          >
                            {skill.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Join Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className='mb-16'
        >
          <h3 className='text-2xl font-bold text-white mb-8 text-center'>
            {t('whyJoinUs.title')}
          </h3>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {perks.map((perk, index) => (
              <motion.div
                key={perk.key}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: index * 0.08
                }}
              >
                <Card className='h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ease-out group text-center'>
                  <div className='w-16 h-16 bg-gradient-to-br from-[#b09155] to-[#9a7f4b] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out mx-auto mb-4'>
                    <perk.icon className='w-8 h-8 text-white' />
                  </div>

                  <h4 className='text-lg font-bold text-white mb-3'>
                    {t(`whyJoinUs.perks.${perk.key}.title`)}
                  </h4>

                  <p className='text-gray-300 leading-relaxed'>
                    {t(`whyJoinUs.perks.${perk.key}.description`)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className='text-center'
        >
          <h3 className='text-2xl font-bold text-white mb-6'>
            {t('cta.title')}
          </h3>

          <p className='text-gray-300 mb-8 max-w-2xl mx-auto'>
            {t('cta.description')}
          </p>

          {/* Three Action Buttons */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto'>
            {/* Fill Form */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1
              }}
              className="h-full"
            >
              <Card className='h-full bg-gradient-to-br from-[#b09155]/20 to-[#9a7f4b]/20 border-[#b09155]/30 backdrop-blur-sm hover:border-[#b09155]/50 hover:shadow-lg hover:shadow-[#b09155]/20 transition-all duration-300 ease-out p-6 cursor-pointer flex flex-col'
                    onClick={() => window.open('https://forms.gle/ZmZnHoHr5PmewG8a8', '_blank')}>
                <div className='w-12 h-12 bg-gradient-to-br from-[#b09155] to-[#9a7f4b] rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-300 ease-out group-hover:scale-110'>
                  <Image src="/file.svg" alt="Form" width={24} height={24} className="w-6 h-6" />
                </div>
                <h4 className='text-white font-bold mb-2'>
                  {t('cta.actions.fillForm.title')}
                </h4>
                <p className='text-gray-300 text-sm flex-grow'>
                  {t('cta.actions.fillForm.description')}
                </p>
              </Card>
            </motion.div>

            {/* Join Discord */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.15
              }}
              className="h-full"
            >
              <Card className='h-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-blue-500/30 backdrop-blur-sm hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 ease-out p-6 cursor-pointer flex flex-col'
                    onClick={() => window.open('https://discord.gg/6fC74Z4g', '_blank')}>
                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-300 ease-out group-hover:scale-110'>
                  <Image src="/discord.png" alt="Discord" width={24} height={24} className="w-6 h-6" />
                </div>
                <h4 className='text-white font-bold mb-2'>
                  {t('cta.actions.discord.title')}
                </h4>
                <p className='text-gray-300 text-sm flex-grow'>
                  {t('cta.actions.discord.description')}
                </p>
              </Card>
            </motion.div>

            {/* Contact Us */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2
              }}
              className="h-full"
            >
              <Card className='h-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30 backdrop-blur-sm hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 ease-out p-6 cursor-pointer flex flex-col'
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      contactSection?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform duration-300 ease-out group-hover:scale-110'>
                  <Mail className='w-6 h-6 text-white' />
                </div>
                <h4 className='text-white font-bold mb-2'>
                  {t('cta.actions.contact.title')}
                </h4>
                <p className='text-gray-300 text-sm flex-grow'>
                  {t('cta.actions.contact.description')}
                </p>
              </Card>
            </motion.div>
          </div>

          <p className='text-gray-400 text-sm mt-6 italic'>
            {t('cta.note')}
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
