'use client';

import { useContactForm } from '@/hooks/useContactForm';
import { useTranslations } from '@/hooks/useTranslations';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Building, CheckCircle, CheckCircle2, ChevronLeft, ChevronRight, MessageSquare, Send, Settings, User } from 'lucide-react';

import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Section } from '../../ui/Section';

import ContactInfo from './ContactInfo';
import StepPersonalInfo from './steps/StepPersonalInfo';
import StepProjectSpecifics from './steps/StepProjectSpecifics';
import StepReview from './steps/StepReview';
import StepServiceDetails from './steps/StepServiceDetails';

export default function ContactForm() {
  const t = useTranslations('contact');
  const {
    currentStep,
    formData,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
    nextStep,
    prevStep,
    isStepValid,
  } = useContactForm();

  const stepIcons = [User, Building, Settings, MessageSquare];
  const stepTitles = [
    t('multistep.steps.personalInfo'),
    t('multistep.steps.serviceDetails'),
    t('multistep.steps.projectSpecifics'),
    t('multistep.steps.reviewSend'),
  ];

  return (
    <Section
      id="contact"
      className="bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#1a1a1a] relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,200,255,0.2),transparent_50%)]' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            {t('mainTitle')}
            <span className='bg-gradient-to-r from-primary via-primary-light to-primary-dark bg-clip-text text-transparent block'>
              {t('mainTitleHighlight')}
            </span>
          </h2>
        </motion.div>

        {/* Centered Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <h3 className='text-2xl font-bold text-white mb-6'>
            {t('getInTouch')}
          </h3>
          <p className='text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto'>
            {t('description')}
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-12 items-start'>
          {/* Contact Information */}
          <ContactInfo />

          {/* Multi-Step Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className='bg-white/5 backdrop-blur-sm border-white/10 p-4 md:p-8 relative overflow-hidden'>
              {/* Progress Indicator */}
              <div className='mb-6 md:mb-8'>
                <div className='flex items-center justify-between mb-3 md:mb-4 px-2 md:px-0'>
                  {stepTitles.map((title, index) => {
                    const StepIcon = stepIcons[index];
                    const stepNumber = index + 1;
                    const isActive = currentStep === stepNumber;
                    const isCompleted = currentStep > stepNumber;

                    return (
                      <div key={index} className='flex items-center'>
                        <div
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                            isCompleted
                              ? 'bg-primary border-primary text-white'
                              : isActive
                              ? 'border-primary text-primary bg-white/10'
                              : 'border-white/20 text-gray-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className='w-4 h-4 md:w-5 md:h-5' />
                          ) : (
                            <StepIcon className='w-4 h-4 md:w-5 md:h-5' />
                          )}
                        </div>
                        {index < stepTitles.length - 1 && (
                          <div
                            className={`w-8 md:w-16 h-0.5 mx-1 md:mx-2 transition-colors duration-200 ${
                              isCompleted ? 'bg-primary' : 'bg-white/20'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className='text-center px-4'>
                  <h3 className='text-lg md:text-xl font-semibold text-white mb-2'>
                    {stepTitles[currentStep - 1]}
                  </h3>
                  <p className='text-gray-400 text-xs md:text-sm'>
                    {t('multistep.step')} {currentStep} {t('multistep.of')} {stepTitles.length}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6 relative z-10'>
                <div className="w-full max-w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <StepPersonalInfo
                        formData={formData}
                        handleChange={handleChange}
                        isSubmitting={isSubmitting}
                      />
                    )}
                    {currentStep === 2 && (
                      <StepServiceDetails
                        formData={formData}
                        handleChange={handleChange}
                        isSubmitting={isSubmitting}
                      />
                    )}
                    {currentStep === 3 && (
                      <StepProjectSpecifics
                        formData={formData}
                        handleChange={handleChange}
                        isSubmitting={isSubmitting}
                      />
                    )}
                    {currentStep === 4 && (
                      <StepReview formData={formData} />
                    )}
                  </AnimatePresence>

                  {/* Status Message */}
                  {submitStatus.type && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center p-4 rounded-lg ${
                        submitStatus.type === 'success'
                          ? 'bg-green-500/20 border border-green-400/30 text-green-300'
                          : 'bg-red-500/20 border border-red-400/30 text-red-300'
                      }`}
                    >
                      {submitStatus.type === 'success' ? (
                        <CheckCircle className='w-5 h-5 mr-3 flex-shrink-0' />
                      ) : (
                        <AlertCircle className='w-5 h-5 mr-3 flex-shrink-0' />
                      )}
                      <span>{submitStatus.message}</span>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className='flex justify-between items-center pt-4 md:pt-6 gap-3'>
                    <Button
                      type='button'
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className='flex items-center px-3 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base'
                    >
                      <ChevronLeft className='w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2' />
                      <span className="hidden sm:inline">{t('multistep.previous')}</span>
                      <span className="sm:hidden">←</span>
                    </Button>

                    {currentStep < 4 ? (
                      <Button
                        type='button'
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className='flex items-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base font-semibold'
                      >
                        <span className="hidden sm:inline">{t('multistep.next')}</span>
                        <span className="sm:hidden">→</span>
                        <ChevronRight className='w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2' />
                      </Button>
                    ) : (
                      <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='flex items-center px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base'
                      >
                        {isSubmitting ? (
                          <>
                            <div className='w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 md:mr-3' />
                            <span className="hidden sm:inline">{t('sending')}</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <Send className='w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2' />
                            <span className="hidden sm:inline">{t('submit')}</span>
                            <span className="sm:hidden">✓</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
