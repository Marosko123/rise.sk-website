import { useTranslations } from '@/hooks/useTranslations';
import { motion } from 'framer-motion';
import { Check, Copy, Mail, MapPin, Phone, Users } from 'lucide-react';

interface FooterContactProps {
  copyToClipboard: (text: string, fieldName: string) => void;
  copiedField: string | null;
}

export default function FooterContact({ copyToClipboard, copiedField }: FooterContactProps) {
  const t = useTranslations('footer');
  const companyInfo = useTranslations('companyInfo');

  return (
    <div className='space-y-4'>
      <h4 className='text-lg font-semibold text-primary mb-4 flex items-center'>
        <Mail className='w-5 h-5 mr-2' />
        {t('contact.title')}
      </h4>

      {/* Zodpovedný zástupca */}
      <div className='flex items-start space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'>
          <Users className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {companyInfo('labels.executives')}
          </div>
          <div className='text-white font-medium text-sm'>
            {companyInfo('executives')}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => copyToClipboard(companyInfo('executives'), 'representative')}
          className='p-1.5 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors duration-200 flex-shrink-0 flex items-center justify-center'
          title='Copy to clipboard'
        >
          {copiedField === 'representative' ? (
            <Check className='w-3 h-3 text-green-400' />
          ) : (
            <Copy className='w-3 h-3 text-gray-400 hover:text-primary' />
          )}
        </motion.button>
      </div>

      {/* Phone */}
      <div className='flex items-center space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0'>
          <Phone className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {t('contact.phone')}
          </div>
          <a
            href={`tel:${companyInfo('phone').replace(/\s/g, '')}`}
            className='text-white hover:text-primary transition-colors duration-300 font-medium text-sm'
          >
            {companyInfo('phone')}
          </a>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => copyToClipboard(companyInfo('phone'), 'phone')}
          className='p-1.5 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors duration-200 flex-shrink-0'
          title='Copy to clipboard'
        >
          {copiedField === 'phone' ? (
            <Check className='w-3 h-3 text-green-400' />
          ) : (
            <Copy className='w-3 h-3 text-gray-400 hover:text-primary' />
          )}
        </motion.button>
      </div>

      {/* Email */}
      <div className='flex items-center space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0'>
          <Mail className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {t('contact.email')}
          </div>
          <a
            href={`mailto:${t('contact.values.email')}`}
            className='text-white hover:text-primary transition-colors duration-300 font-medium text-sm'
          >
            {t('contact.values.email')}
          </a>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => copyToClipboard(t('contact.values.email'), 'email')}
          className='p-1.5 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors duration-200 flex-shrink-0'
          title='Copy to clipboard'
        >
          {copiedField === 'email' ? (
            <Check className='w-3 h-3 text-green-400' />
          ) : (
            <Copy className='w-3 h-3 text-gray-400 hover:text-primary' />
          )}
        </motion.button>
      </div>

      {/* Address */}
      <div className='flex items-start space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'>
          <MapPin className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {companyInfo('labels.address')}
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(companyInfo('address'))}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-white hover:text-primary transition-colors duration-300 font-medium text-sm leading-relaxed'
          >
            {companyInfo('address')}
          </a>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => copyToClipboard(companyInfo('address'), 'address')}
          className='p-1.5 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors duration-200 flex-shrink-0 flex items-center justify-center'
          title='Copy to clipboard'
        >
          {copiedField === 'address' ? (
            <Check className='w-3 h-3 text-green-400' />
          ) : (
            <Copy className='w-3 h-3 text-gray-400 hover:text-primary' />
          )}
        </motion.button>
      </div>
    </div>
  );
}
