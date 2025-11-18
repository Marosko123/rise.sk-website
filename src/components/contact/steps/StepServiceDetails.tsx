import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { FormData } from '@/hooks/useContactForm';
import { getFormOptions } from '@/data/form-options';

interface StepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isSubmitting: boolean;
}

export default function StepServiceDetails({ formData, handleChange, isSubmitting }: StepProps) {
  const t = useTranslations('contact');
  const { services, projectTypes } = getFormOptions(t);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div>
        <label htmlFor='service' className='block text-white font-semibold mb-2'>
          {t('service')} *
        </label>
        <div className="relative">
          <select
            id='service'
            name='service'
            required
            value={formData.service}
            onChange={handleChange}
            disabled={isSubmitting}
            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-150 disabled:opacity-50 appearance-none cursor-pointer'
            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
          >
            <option value='' className='bg-gray-800'>{t('selectService')}</option>
            {services.map((service, index) => (
              <option key={index} value={service} className='bg-gray-800'>{service}</option>
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
        <label htmlFor='projectType' className='block text-white font-semibold mb-2'>
          {t('multistep.projectType')}
        </label>
        <div className="relative">
          <select
            id='projectType'
            name='projectType'
            value={formData.projectType}
            onChange={handleChange}
            disabled={isSubmitting}
            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-150 disabled:opacity-50 appearance-none cursor-pointer'
            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
          >
            <option value='' className='bg-gray-800'>{t('multistep.selectProjectType')}</option>
            {projectTypes.map((type, index) => (
              <option key={index} value={type} className='bg-gray-800'>{type}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
