'use client';

import FadeIn from '@/components/animations/FadeIn';
import { getContactInfo } from '@/data/footer-data';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
    <footer className='relative overflow-hidden bg-transparent'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10 text-white'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
          {/* Company Info */}
          <FadeIn
            duration={0.6}
            className='col-span-2 lg:col-span-2'
          >
            <Link href='/' className='inline-block mb-6'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent pb-1'
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
                <FadeIn
                  key={index}
                  direction="left"
                  delay={index * 0.1}
                  duration={0.6}
                >
                  <motion.a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      item.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
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
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          <FooterLinks />
        </div>

        {/* Company Legal Information Section - 3 Columns */}
        <FadeIn
          duration={0.6}
          delay={0.5}
          className='mb-8'
        >
          <div className='text-center mb-6'>
            <h3 className='text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-2 pb-1'>
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
        </FadeIn>

        {/* Bottom Section */}
        <FadeIn
          duration={0.6}
          delay={0.6}
          className='border-t border-gray-800 pt-8'
        >
          <div className='flex flex-col md:flex-row justify-center items-center text-gray-400'>
            <p className='text-sm'>
              {t('copyright', { year: currentYear })}
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
