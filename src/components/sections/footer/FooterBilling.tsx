import { motion } from 'framer-motion';
import { Check, Copy, CreditCard, FileText, Hash } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FooterBillingProps {
  copyToClipboard: (text: string, fieldName: string) => void;
  copiedField: string | null;
}

export default function FooterBilling({ copyToClipboard, copiedField }: FooterBillingProps) {
  const t = useTranslations('footer');
  const companyInfo = useTranslations('companyInfo');

  return (
    <div className='space-y-4'>
      <h4 className='text-lg font-semibold text-primary mb-4 flex items-center'>
        <FileText className='w-5 h-5 mr-2' />
        {t('sections.billing')}
      </h4>

      {/* IČO */}
      <div className='flex items-center space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0'>
          <Hash className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {companyInfo('labels.businessId')}
          </div>
          <div className='text-white font-mono text-sm'>
            {companyInfo('businessId')}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard(companyInfo('businessId'), 'businessId')}
          className='p-2 rounded-md hover:bg-white/5 transition-colors duration-200 flex-shrink-0 flex items-center justify-center group'
          title='Copy to clipboard'
        >
          {copiedField === 'businessId' ? (
            <Check className='w-4 h-4 text-green-400' />
          ) : (
            <Copy className='w-4 h-4 text-white/30 group-hover:text-primary transition-colors' />
          )}
        </motion.button>
      </div>

      {/* DIČ */}
      <div className='flex items-center space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0'>
          <CreditCard className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {companyInfo('labels.vatId')}
          </div>
          <div className='text-white font-mono text-sm'>
            {companyInfo('vatId')}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard(companyInfo('vatId'), 'vatId')}
          className='p-2 rounded-md hover:bg-white/5 transition-colors duration-200 flex-shrink-0 flex items-center justify-center group'
          title='Copy to clipboard'
        >
          {copiedField === 'vatId' ? (
            <Check className='w-4 h-4 text-green-400' />
          ) : (
            <Copy className='w-4 h-4 text-white/30 group-hover:text-primary transition-colors' />
          )}
        </motion.button>
      </div>

      {/* VAT Status */}
      <div className='flex items-center space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0'>
          <CreditCard className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {companyInfo('labels.vatStatus')}
          </div>
          <div className='text-white text-sm font-medium'>
            {companyInfo('vatStatus')}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard(companyInfo('vatStatus'), 'vatStatus')}
          className='p-2 rounded-md hover:bg-white/5 transition-colors duration-200 flex-shrink-0 flex items-center justify-center group'
          title='Copy to clipboard'
        >
          {copiedField === 'vatStatus' ? (
            <Check className='w-4 h-4 text-green-400' />
          ) : (
            <Copy className='w-4 h-4 text-white/30 group-hover:text-primary transition-colors' />
          )}
        </motion.button>
      </div>

      {/* ORSR */}
      <div className='flex items-start space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'>
          <FileText className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {companyInfo('labels.registration')}
          </div>
          <div className='text-white text-sm leading-relaxed'>
            {companyInfo('registration')}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard(companyInfo('registration'), 'orsr')}
          className='p-2 rounded-md hover:bg-white/5 transition-colors duration-200 flex-shrink-0 flex items-center justify-center group'
          title='Copy to clipboard'
        >
          {copiedField === 'orsr' ? (
            <Check className='w-4 h-4 text-green-400' />
          ) : (
            <Copy className='w-4 h-4 text-white/30 group-hover:text-primary transition-colors' />
          )}
        </motion.button>
      </div>
    </div>
  );
}
