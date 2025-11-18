import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Copy, CheckCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useState } from 'react';

export default function ContactInfo() {
  const t = useTranslations('contact');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Silently fail
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t('contactInfo.email'),
      value: t('contactInfo.values.email'),
      href: `mailto:${t('contactInfo.values.email')}`,
    },
    {
      icon: Phone,
      label: t('contactInfo.phone'),
      value: t('contactInfo.values.phone'),
      href: `tel:${t('contactInfo.values.phone').replace(/\s/g, '')}`,
    },
    {
      icon: MapPin,
      label: t('contactInfo.office'),
      value: t('contactInfo.values.office'),
      href: `https://maps.google.com/?q=${encodeURIComponent(t('contactInfo.values.office'))}`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className='space-y-6'
    >
      {contactInfo.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className='p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/8 transition-colors duration-200'
        >
          <div className='flex items-center'>
            <a
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200'
            >
              <item.icon className='w-6 h-6 text-white' />
            </a>
            <div className='ml-4 flex-1'>
              <div className='text-sm text-gray-400 uppercase tracking-wide'>
                {item.label}
              </div>
              <div className='text-white font-semibold'>
                {item.value}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(item.value, `contact-${index}`)}
              className='ml-3 p-2 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors duration-200'
              title='Copy to clipboard'
            >
              {copiedField === `contact-${index}` ? (
                <CheckCircle className='w-4 h-4 text-green-400' />
              ) : (
                <Copy className='w-4 h-4 text-gray-400 hover:text-primary' />
              )}
            </button>
          </div>
        </motion.div>
      ))}

      {/* Calendar Booking Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className='p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/8 transition-colors duration-200'
      >
        <div className='flex items-center'>
          <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
          </div>
          <div className='ml-4 flex-1'>
            <div className='text-sm text-gray-400 uppercase tracking-wide mb-1'>
              {t('bookMeeting')}
            </div>
            <div className='text-white font-semibold mb-3'>
              {t('meetingDescription')}
            </div>
            <button
              onClick={() => window.open('https://calendar.app.google/NWkLNFqSZffB36of6', '_blank')}
              className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white text-sm font-medium rounded-lg transition-colors duration-200'
            >
              {t('meetingCta')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
