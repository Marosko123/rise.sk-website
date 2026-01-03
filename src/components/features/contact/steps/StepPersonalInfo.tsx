import { FormData } from '@/hooks/useContactForm';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface StepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

export default function StepPersonalInfo({ formData, handleChange, isSubmitting }: StepProps) {
  const t = useTranslations('contact');

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='grid md:grid-cols-2 gap-6'>
        <div>
          <label htmlFor='name' className='block text-white font-semibold mb-2'>
            {t('fullName')} *
          </label>
          <input
            type='text'
            id='name'
            name='name'
            required
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary focus:border-transparent transition-colors duration-150 disabled:opacity-50'
            placeholder={t('placeholders.name')}
          />
        </div>
        <div>
          <label htmlFor='company' className='block text-white font-semibold mb-2'>
            {t('company')}
          </label>
          <input
            type='text'
            id='company'
            name='company'
            value={formData.company}
            onChange={handleChange}
            disabled={isSubmitting}
            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary focus:border-transparent transition-colors duration-150 disabled:opacity-50'
            placeholder={t('placeholders.company')}
          />
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <div>
          <label htmlFor='email' className='block text-white font-semibold mb-2'>
            {t('email')} *
          </label>
          <input
            type='email'
            id='email'
            name='email'
            required
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary focus:border-transparent transition-colors duration-150 disabled:opacity-50'
            placeholder={t('placeholders.email')}
          />
        </div>
        <div>
          <label htmlFor='phone' className='block text-white font-semibold mb-2'>
            {t('phone')} *
          </label>
          <input
            type='tel'
            id='phone'
            name='phone'
            required
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary focus:border-transparent transition-colors duration-150 disabled:opacity-50'
            placeholder={t('placeholders.phone')}
          />
        </div>
      </div>
    </motion.div>
  );
}
