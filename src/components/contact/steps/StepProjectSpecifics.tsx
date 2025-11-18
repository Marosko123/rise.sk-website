import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { FormData } from '@/hooks/useContactForm';
import { getFormOptions } from '@/data/form-options';

interface StepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => void;
  isSubmitting: boolean;
}

export default function StepProjectSpecifics({ formData, handleChange, isSubmitting }: StepProps) {
  const t = useTranslations('contact');
  const { budgetRanges, timelineOptions } = getFormOptions(t);

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='grid md:grid-cols-2 gap-6'>
        <div>
          <label htmlFor='budget' className='block text-white font-semibold mb-2'>
            {t('multistep.budget')}
          </label>
          <div className="relative">
            <select
              id='budget'
              name='budget'
              value={formData.budget}
              onChange={handleChange}
              disabled={isSubmitting}
              className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-150 disabled:opacity-50 appearance-none cursor-pointer'
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
            >
              <option value='' className='bg-gray-800'>{t('multistep.selectBudget')}</option>
              {budgetRanges.map((range, index) => (
                <option key={index} value={range} className='bg-gray-800'>{range}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor='timeline' className='block text-white font-semibold mb-2'>
            {t('multistep.timeline')}
          </label>
          <div className="relative">
            <select
              id='timeline'
              name='timeline'
              value={formData.timeline}
              onChange={handleChange}
              disabled={isSubmitting}
              className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-150 disabled:opacity-50 appearance-none cursor-pointer'
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
            >
              <option value='' className='bg-gray-800'>{t('multistep.selectTimeline')}</option>
              {timelineOptions.map((timeline, index) => (
                <option key={index} value={timeline} className='bg-gray-800'>{timeline}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor='message' className='block text-white font-semibold mb-2'>
          {t('message')}
        </label>
        <textarea
          id='message'
          name='message'
          rows={4}
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-150 resize-none disabled:opacity-50'
          placeholder={t('messagePlaceholder')}
        />
      </div>
    </motion.div>
  );
}
