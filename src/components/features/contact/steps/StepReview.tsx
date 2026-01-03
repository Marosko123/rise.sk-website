import { FormData } from '@/hooks/useContactForm';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface StepProps {
  formData: FormData;
}

export default function StepReview({ formData }: StepProps) {
  const t = useTranslations('contact');

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='bg-white/5 rounded-lg p-6 space-y-4'>
        <h4 className='text-lg font-semibold text-white mb-4'>{t('multistep.reviewTitle')}</h4>

        <div className='grid md:grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='text-gray-400'>{t('fullName')}:</span>
            <span className='text-white ml-2'>{formData.name}</span>
          </div>
          <div>
            <span className='text-gray-400'>{t('email')}:</span>
            <span className='text-white ml-2'>{formData.email}</span>
          </div>
          {formData.phone && (
            <div>
              <span className='text-gray-400'>{t('phone')}:</span>
              <span className='text-white ml-2'>{formData.phone}</span>
            </div>
          )}
          {formData.company && (
            <div>
              <span className='text-gray-400'>{t('company')}:</span>
              <span className='text-white ml-2'>{formData.company}</span>
            </div>
          )}
          <div>
            <span className='text-gray-400'>{t('service')}:</span>
            <span className='text-white ml-2'>{formData.service}</span>
          </div>
          {formData.projectType && (
            <div>
              <span className='text-gray-400'>{t('multistep.projectType')}:</span>
              <span className='text-white ml-2'>{formData.projectType}</span>
            </div>
          )}
          {formData.budget && (
            <div>
              <span className='text-gray-400'>{t('multistep.budget')}:</span>
              <span className='text-white ml-2'>{formData.budget}</span>
            </div>
          )}
          {formData.timeline && (
            <div>
              <span className='text-gray-400'>{t('multistep.timeline')}:</span>
              <span className='text-white ml-2'>{formData.timeline}</span>
            </div>
          )}
        </div>

        {formData.message && (
          <div>
            <span className='text-gray-400'>{t('message')}:</span>
            <p className='text-white mt-2 p-3 bg-white/5 rounded border border-white/10'>
              {formData.message}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
