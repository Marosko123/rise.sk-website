'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Mail, MapPin, Phone, Hash, CreditCard, Users, FileText, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

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

  const footerLinks = {
    services: [
      t('services.0'),
      t('services.1'),
      t('services.2'),
      t('services.3'),
      t('services.4'),
    ],
    company: [
      t('company.0'),
      t('company.1'),
      t('company.2'),
      t('company.3'),
      t('company.4'),
    ],
    support: [
      t('support.0'),
      t('support.1'),
      t('support.2'),
      t('support.3'),
      t('support.4'),
    ],
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t('contact.email'),
      value: t('contact.values.email'),
      href: `mailto:${t('contact.values.email')}`,
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: t('contact.values.phone'),
      href: `tel:${t('contact.values.phone').replace(/\s/g, '')}`,
    },
    {
      icon: MapPin,
      label: t('contact.location'),
      value: t('contact.values.location'),
      href: `https://maps.google.com/?q=${encodeURIComponent(t('contact.values.address'))}`,
    },
  ];

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
                className='text-3xl font-bold bg-gradient-to-r from-[#b09155] to-[#d4af37] bg-clip-text text-transparent'
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
                  className='flex items-center text-gray-300 hover:text-[#b09155] transition-all duration-300 group'
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

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className='text-xl font-bold text-white mb-6'>
              {t('sections.services')}
            </h3>
            <ul className='space-y-3'>
              {footerLinks.services.map((service, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    href='#services'
                    className='text-gray-300 hover:text-[#b09155] transition-all duration-300 text-sm leading-relaxed hover:translate-x-1 inline-block transform'
                  >
                    {service}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className='text-xl font-bold text-white mb-6'>
              {t('sections.company')}
            </h3>
            <ul className='space-y-3'>
              {footerLinks.company.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    href='#'
                    className='text-gray-300 hover:text-[#b09155] transition-all duration-300 text-sm leading-relaxed hover:translate-x-1 inline-block transform'
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Company Legal Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className='mb-12'
        >
          <div className='text-center mb-8'>
            <h3 className='text-2xl font-bold bg-gradient-to-r from-[#b09155] to-[#d4af37] bg-clip-text text-transparent mb-2'>
              {companyInfo('name')}
            </h3>
            <div className='w-20 h-1 bg-gradient-to-r from-[#b09155] to-[#d4af37] mx-auto rounded-full'></div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {/* Business ID Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className='group relative p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-[#b09155]/50 transition-all duration-300'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-[#b09155]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300'></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 bg-gradient-to-br from-[#b09155]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center mr-3'>
                      <Hash className='w-5 h-5 text-[#b09155]' />
                    </div>
                    <span className='text-[#b09155] font-semibold text-sm'>
                      {companyInfo('labels.businessId')}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(companyInfo('businessId'), 'businessId')}
                    className='p-2 rounded-lg bg-white/10 hover:bg-[#b09155]/20 transition-colors duration-200'
                    title='Copy to clipboard'
                  >
                    {copiedField === 'businessId' ? (
                      <Check className='w-4 h-4 text-green-400' />
                    ) : (
                      <Copy className='w-4 h-4 text-gray-400 hover:text-[#b09155]' />
                    )}
                  </motion.button>
                </div>
                <div className='text-white font-mono text-lg select-all'>
                  {companyInfo('businessId')}
                </div>
              </div>
            </motion.div>

            {/* Tax ID Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className='group relative p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-[#b09155]/50 transition-all duration-300'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-[#b09155]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300'></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 bg-gradient-to-br from-[#b09155]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center mr-3'>
                      <CreditCard className='w-5 h-5 text-[#b09155]' />
                    </div>
                    <span className='text-[#b09155] font-semibold text-sm'>
                      {companyInfo('labels.taxId')}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(companyInfo('taxId'), 'taxId')}
                    className='p-2 rounded-lg bg-white/10 hover:bg-[#b09155]/20 transition-colors duration-200'
                    title='Copy to clipboard'
                  >
                    {copiedField === 'taxId' ? (
                      <Check className='w-4 h-4 text-green-400' />
                    ) : (
                      <Copy className='w-4 h-4 text-gray-400 hover:text-[#b09155]' />
                    )}
                  </motion.button>
                </div>
                <div className='text-white font-mono text-lg select-all'>
                  {companyInfo('taxId')}
                </div>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className='group relative p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-[#b09155]/50 transition-all duration-300'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-[#b09155]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300'></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 bg-gradient-to-br from-[#b09155]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center mr-3'>
                      <Phone className='w-5 h-5 text-[#b09155]' />
                    </div>
                    <span className='text-[#b09155] font-semibold text-sm'>
                      {companyInfo('labels.phone')}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(companyInfo('phone'), 'phone')}
                    className='p-2 rounded-lg bg-white/10 hover:bg-[#b09155]/20 transition-colors duration-200'
                    title='Copy to clipboard'
                  >
                    {copiedField === 'phone' ? (
                      <Check className='w-4 h-4 text-green-400' />
                    ) : (
                      <Copy className='w-4 h-4 text-gray-400 hover:text-[#b09155]' />
                    )}
                  </motion.button>
                </div>
                <a
                  href={`tel:${companyInfo('phone').replace(/\s/g, '')}`}
                  className='text-white hover:text-[#b09155] transition-colors duration-300 font-medium text-lg group-hover:underline select-all'
                >
                  {companyInfo('phone')}
                </a>
              </div>
            </motion.div>

            {/* Address Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className='group relative p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-[#b09155]/50 transition-all duration-300 md:col-span-2 lg:col-span-1'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-[#b09155]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300'></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 bg-gradient-to-br from-[#b09155]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center mr-3'>
                      <MapPin className='w-5 h-5 text-[#b09155]' />
                    </div>
                    <span className='text-[#b09155] font-semibold text-sm'>
                      {companyInfo('labels.address')}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(companyInfo('address'), 'address')}
                    className='p-2 rounded-lg bg-white/10 hover:bg-[#b09155]/20 transition-colors duration-200'
                    title='Copy to clipboard'
                  >
                    {copiedField === 'address' ? (
                      <Check className='w-4 h-4 text-green-400' />
                    ) : (
                      <Copy className='w-4 h-4 text-gray-400 hover:text-[#b09155]' />
                    )}
                  </motion.button>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(companyInfo('address'))}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white hover:text-[#b09155] transition-colors duration-300 font-medium text-base leading-relaxed group-hover:underline select-all'
                >
                  {companyInfo('address')}
                </a>
              </div>
            </motion.div>

            {/* Executives Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className='group relative p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-[#b09155]/50 transition-all duration-300'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-[#b09155]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300'></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 bg-gradient-to-br from-[#b09155]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center mr-3'>
                      <Users className='w-5 h-5 text-[#b09155]' />
                    </div>
                    <span className='text-[#b09155] font-semibold text-sm'>
                      {companyInfo('labels.executives')}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(companyInfo('executives'), 'executives')}
                    className='p-2 rounded-lg bg-white/10 hover:bg-[#b09155]/20 transition-colors duration-200'
                    title='Copy to clipboard'
                  >
                    {copiedField === 'executives' ? (
                      <Check className='w-4 h-4 text-green-400' />
                    ) : (
                      <Copy className='w-4 h-4 text-gray-400 hover:text-[#b09155]' />
                    )}
                  </motion.button>
                </div>
                <div className='text-white font-medium text-base leading-relaxed select-all'>
                  {companyInfo('executives')}
                </div>
              </div>
            </motion.div>

            {/* Registration Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className='group relative p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-[#b09155]/50 transition-all duration-300 md:col-span-2 lg:col-span-1'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-[#b09155]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300'></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 bg-gradient-to-br from-[#b09155]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center mr-3'>
                      <FileText className='w-5 h-5 text-[#b09155]' />
                    </div>
                    <span className='text-[#b09155] font-semibold text-sm'>
                      {companyInfo('labels.registration')}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(companyInfo('registration'), 'registration')}
                    className='p-2 rounded-lg bg-white/10 hover:bg-[#b09155]/20 transition-colors duration-200'
                    title='Copy to clipboard'
                  >
                    {copiedField === 'registration' ? (
                      <Check className='w-4 h-4 text-green-400' />
                    ) : (
                      <Copy className='w-4 h-4 text-gray-400 hover:text-[#b09155]' />
                    )}
                  </motion.button>
                </div>
                <div className='text-gray-300 text-sm leading-relaxed select-all'>
                  {companyInfo('registration')}
                </div>
              </div>
            </motion.div>
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
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <div className='text-gray-400 text-sm'>
              {t('copyright', { year: currentYear })}
            </div>
            <div className='flex space-x-6'>
              {footerLinks.support.slice(2).map((item, index) => (
                <Link
                  key={index}
                  href='#'
                  className='text-gray-400 hover:text-[#b09155] transition-colors duration-300 text-sm'
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className='mt-12 p-8 bg-gradient-to-r from-[#b09155]/20 to-[#9a7f4b]/20 backdrop-blur-sm border border-white/10 rounded-2xl text-center'
        >
          <h3 className='text-2xl font-bold text-white mb-4'>
            {t('cta.title')}
          </h3>
          <p className='text-gray-300 mb-6 max-w-2xl mx-auto'>
            {t('cta.description')}
          </p>
          <motion.a
            href='#contact'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#b09155] to-[#9a7f4b] hover:from-[#9a7f4b] hover:to-[#b09155] text-white font-bold rounded-lg transition-all duration-300'
          >
            {t('cta.button')}
            <ExternalLink className='w-5 h-5 ml-2' />
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
}
