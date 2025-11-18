import { useTranslations } from '@/hooks/useTranslations';
import { motion } from 'framer-motion';
import { Banknote, Check, Copy, CreditCard, Hash } from 'lucide-react';

interface FooterBankingProps {
  copyToClipboard: (text: string, fieldName: string) => void;
  copiedField: string | null;
}

export default function FooterBanking({ copyToClipboard, copiedField }: FooterBankingProps) {
  const t = useTranslations('footer');
  const companyInfo = useTranslations('companyInfo');

  return (
    <div className='space-y-4'>
      <h4 className='text-lg font-semibold text-primary mb-4 flex items-center'>
        <Banknote className='w-5 h-5 mr-2' />
        {t('sections.banking')}
      </h4>

      {/* Banka */}
      <div className='flex items-start space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'>
          <Banknote className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {companyInfo('labels.bank')}
          </div>
          <div className='text-white font-medium text-sm'>
            {companyInfo('banking.bank')}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => copyToClipboard(companyInfo('banking.bank'), 'bank')}
          className='p-1.5 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors duration-200 flex-shrink-0 flex items-center justify-center'
          title='Copy to clipboard'
        >
          {copiedField === 'bank' ? (
            <Check className='w-3 h-3 text-green-400' />
          ) : (
            <Copy className='w-3 h-3 text-gray-400 hover:text-primary' />
          )}
        </motion.button>
      </div>

      {/* SWIFT */}
      <div className='flex items-center space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0'>
          <CreditCard className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {companyInfo('labels.swift')}
          </div>
          <div className='text-white font-mono text-sm'>
            {companyInfo('banking.swift')}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => copyToClipboard(companyInfo('banking.swift'), 'swift')}
          className='p-1.5 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors duration-200 flex-shrink-0'
          title='Copy to clipboard'
        >
          {copiedField === 'swift' ? (
            <Check className='w-3 h-3 text-green-400' />
          ) : (
            <Copy className='w-3 h-3 text-gray-400 hover:text-primary' />
          )}
        </motion.button>
      </div>

      {/* IBAN */}
      <div className='flex items-center space-x-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center flex-shrink-0'>
          <Hash className='w-4 h-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-primary text-xs font-semibold uppercase tracking-wide'>
            {companyInfo('labels.iban')}
          </div>
          <div className='text-white font-mono text-sm'>
            {companyInfo('banking.iban')}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => copyToClipboard(companyInfo('banking.iban'), 'iban')}
          className='p-1.5 rounded-lg bg-white/10 hover:bg-primary/20 transition-colors duration-200 flex-shrink-0'
          title='Copy to clipboard'
        >
          {copiedField === 'iban' ? (
            <Check className='w-3 h-3 text-green-400' />
          ) : (
            <Copy className='w-3 h-3 text-gray-400 hover:text-primary' />
          )}
        </motion.button>
      </div>
    </div>
  );
}
