'use client';

import { getContactInfo } from '@/data/footer-data';
import { useTranslations } from '@/hooks/useTranslations';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import FooterBanking from './FooterBanking';
import FooterBilling from './FooterBilling';
import FooterContact from './FooterContact';
import FooterLinks from './FooterLinks';

export default function Footer() {
  const t = useTranslations('footer');
  const companyInfo = useTranslations('companyInfo');
  const currentYear = new Date().getFullYear();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Silently fail if clipboard API is not available
    }
  };

  const contactInfo = getContactInfo(t);

  return (
    <footer className='relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900'>
      {/* Enhanced Background Effects */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(180,145,85,0.15),transparent_50%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.1),transparent_50%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(120,119,198,0.08),transparent_50%)]' />

      {/* Animated grid pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='h-full w-full bg-[linear-gradient(rgba(180,145,85,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(180,145,85,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]'></div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-white'>
        <div className='grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12'>
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='lg:col-span-2'
          >
            <Link href='/' className='inline-block mb-6'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent'
              >
                Rise.sk
              </motion.div>
            </Link>
            <p className='text-gray-300 text-lg leading-relaxed mb-8 max-w-md'>
              {t('description')}
            </p>

            {/* Contact Info */}
            <div className='space-y-4'>
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    item.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className='flex items-center text-gray-300 hover:text-primary transition-all duration-300 group select-none'
                >
                  <div className='w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300'>
                    <item.icon className='w-5 h-5' />
                  </div>
                  <span>{item.value}</span>
                  {item.href.startsWith('http') && (
                    <ExternalLink className='w-4 h-4 ml-2 opacity-0 group-hover:opacity-1 transition-opacity duration-300' />
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <FooterLinks />
        </div>

        {/* Company Legal Information Section - 3 Columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className='mb-8'
        >
          <div className='text-center mb-6'>
            <h3 className='text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-2'>
              {companyInfo('name')}
            </h3>
            <div className='w-16 h-0.5 bg-gradient-to-r from-primary to-primary-light mx-auto rounded-full'></div>
          </div>

          {/* 3 Column Layout */}
          <div className='bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <FooterContact copyToClipboard={copyToClipboard} copiedField={copiedField} />
              <FooterBilling copyToClipboard={copyToClipboard} copiedField={copiedField} />
              <FooterBanking copyToClipboard={copyToClipboard} copiedField={copiedField} />
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='border-t border-gray-800 pt-8'
        >
          <div className='flex flex-col md:flex-row justify-center items-center text-gray-400'>
            <p className='text-sm'>
              {t('copyright', { year: currentYear })}
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
