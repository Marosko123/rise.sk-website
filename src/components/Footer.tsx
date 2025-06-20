'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

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
    <footer className='bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#1a1a1a] text-white relative overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.1),transparent_50%)]' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10'>
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
