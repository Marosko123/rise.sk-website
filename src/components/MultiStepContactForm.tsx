'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Mail,
  MapPin,
  Phone,
  Send,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  Settings,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useEffect, useState, useCallback, useMemo } from 'react';

import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Section } from './ui/Section';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  budget: string;
  timeline: string;
  projectType: string;
}

export default function MultiStepContactForm() {
  const t = useTranslations('contact');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    budget: '',
    timeline: '',
    projectType: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Copy functionality state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Copy to clipboard function
  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Silently fail if clipboard API is not available
    }
  };

  // Read localStorage and prefill form
  useEffect(() => {
    const loadStoredData = () => {
      const storedData = localStorage.getItem('contactFormData');
      if (storedData) {
        try {
          const { service, message } = JSON.parse(storedData);
          if (service || message) {
            setFormData((prev) => ({
              ...prev,
              ...(service && { service }),
              ...(message && { message }),
            }));

            // Clear stored data after setting form data
            localStorage.removeItem('contactFormData');
          }
        } catch {
          // Silently handle parsing errors and clear invalid data
          localStorage.removeItem('contactFormData');
        }
      }
    };

    // Load initial data
    loadStoredData();

    // Listen for storage events (when localStorage changes)
    const handleStorageChange = () => {
      loadStoredData();
    };

    // Add custom event listener for localStorage updates
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('contactFormUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contactFormUpdate', handleStorageChange);
    };
  }, []);

  // Memoized form handlers for better performance
  const handleChange = useCallback((
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    // Validate required fields
    if (!formData.name || !formData.email || !formData.service) {
      setSubmitStatus({
        type: 'error',
        message: t('requiredFields'),
      });
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: 'error',
        message: t('invalidEmail'),
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Dynamic import of EmailJS to reduce bundle size and improve performance
      const emailjs = (await import('@emailjs/browser')).default;
      
      // EmailJS configuration from environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const autoReplyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_AUTO_REPLY_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          'EmailJS configuration missing. Please check environment variables.'
        );
      }

      // Enhanced template parameters for EmailJS with multistep data
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        company: formData.company || 'Not specified',
        service: formData.service,
        subject: formData.service,
        message: formData.message || 'No additional message provided',
        budget: formData.budget || 'Not specified',
        timeline: formData.timeline || 'Not specified',
        project_type: formData.projectType || 'Not specified',
        to_email: 'rise@rise.sk',
        to_name: 'Rise.sk Team',
        reply_to: formData.email,
      };

      // Send main notification email to you
      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      // Send auto-reply email to user (if template ID is configured)
      if (autoReplyTemplateId) {
        try {
          const autoReplyParams = {
            from_name: 'Rise.sk Team',
            from_email: 'rise@rise.sk',
            to_name: formData.name,
            to_email: formData.email,
            service: formData.service,
            company: formData.company || 'Not specified',
            message: formData.message || 'No additional message provided',
            budget: formData.budget || 'Not specified',
            timeline: formData.timeline || 'Not specified',
            project_type: formData.projectType || 'Not specified',
            reply_to: 'rise@rise.sk',
          };

          await emailjs.send(serviceId, autoReplyTemplateId, autoReplyParams, publicKey);
        } catch {
          // Don't fail the whole form if auto-reply fails
          // Auto-reply email failed, but main email was sent
        }
      }

      setSubmitStatus({
        type: 'success',
        message: t('success'),
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
        budget: '',
        timeline: '',
        projectType: '',
      });
      setCurrentStep(1);
    } catch (error) {
      let errorMessage = t('networkError');

      if (error instanceof Error) {
        if (
          error.message.includes('Account not found') ||
          error.message.includes('404')
        ) {
          errorMessage = t('error');
        } else if (error.message.includes('Template')) {
          errorMessage = t('error');
        } else if (error.message.includes('Service')) {
          errorMessage = t('error');
        }
      }

      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, t]);

  const contactInfo = useMemo(() => [
    {
      icon: Mail,
      label: t('contactInfo.email'),
      value: t('contactInfo.values.email'),
      href: `mailto:${t('contactInfo.values.email')}`,
    },
    {
      icon: Phone,
      label: t('contactInfo.phone'),
      value: t('contactInfo.values.phone'),
      href: `tel:${t('contactInfo.values.phone').replace(/\s/g, '')}`,
    },
    {
      icon: MapPin,
      label: t('contactInfo.office'),
      value: t('contactInfo.values.office'),
      href: `https://maps.google.com/?q=${encodeURIComponent(
        t('contactInfo.values.office')
      )}`,
    },
  ], [t]);

  const services = useMemo(() => [
    t('services.webDevelopment'),
    t('services.mobileApps'),
    t('services.customSoftware'),
    t('services.ecommerce'),
    t('services.aiAnalytics'),
    t('services.digitalMarketing'),
    t('services.specialRequests'),
    t('services.jobApplication'),
    t('services.other'),
  ], [t]);

  const budgetRanges = useMemo(() => [
    t('multistep.budgetRanges.under5k'),
    t('multistep.budgetRanges.5k15k'),
    t('multistep.budgetRanges.15k50k'),
    t('multistep.budgetRanges.50k100k'),
    t('multistep.budgetRanges.over100k'),
    t('multistep.budgetRanges.discuss'),
  ], [t]);

  const timelineOptions = useMemo(() => [
    t('multistep.timelineOptions.asap'),
    t('multistep.timelineOptions.1to3months'),
    t('multistep.timelineOptions.3to6months'),
    t('multistep.timelineOptions.6plusmonths'),
    t('multistep.timelineOptions.flexible'),
  ], [t]);

  const projectTypes = useMemo(() => [
    t('multistep.projectTypes.newProject'),
    t('multistep.projectTypes.existingUpdate'),
    t('multistep.projectTypes.maintenance'),
    t('multistep.projectTypes.consultation'),
    t('multistep.projectTypes.partnership'),
  ], [t]);

  const nextStep = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.service;
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Review step
      default:
        return false;
    }
  }, [currentStep, formData.name, formData.email, formData.service]);

  const stepIcons = useMemo(() => [User, Building, Settings, MessageSquare], []);
  const stepTitles = useMemo(() => [
    t('multistep.steps.personalInfo'),
    t('multistep.steps.serviceDetails'),
    t('multistep.steps.projectSpecifics'),
    t('multistep.steps.reviewSend'),
  ], [t]);

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
            <span className='bg-gradient-to-r from-[#b09155] via-[#d4af37] to-[#b8860b] bg-clip-text text-transparent block'>
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
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='space-y-6'
          >
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className='p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/8 transition-colors duration-200'
                >
                  <div className='flex items-center'>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={
                        item.href.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#b09155] to-[#9a7f4b] rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200'
                      data-cursor='link'
                    >
                      <item.icon className='w-6 h-6 text-white' />
                    </a>
                    <div className='ml-4 flex-1'>
                      <div className='text-sm text-gray-400 uppercase tracking-wide'>
                        {item.label}
                      </div>
                      <div className='text-white font-semibold'>
                        {item.value}
                      </div>
                    </div>
                    {/* Copy Button */}
                    <button
                      onClick={() => copyToClipboard(item.value, `contact-${index}`)}
                      className='ml-3 p-2 rounded-lg bg-white/10 hover:bg-[#b09155]/20 transition-colors duration-200'
                      title='Copy to clipboard'
                    >
                      {copiedField === `contact-${index}` ? (
                        <CheckCircle className='w-4 h-4 text-green-400' />
                      ) : (
                        <Copy className='w-4 h-4 text-gray-400 hover:text-[#b09155]' />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}

            {/* Calendar Booking Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className='p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/8 transition-colors duration-200'
            >
              <div className='flex items-center'>
                <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#b09155] to-[#9a7f4b] rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div className='ml-4 flex-1'>
                  <div className='text-sm text-gray-400 uppercase tracking-wide mb-1'>
                    {t('bookMeeting')}
                  </div>
                  <div className='text-white font-semibold mb-3'>
                    {t('meetingDescription')}
                  </div>
                  <button
                    onClick={() => window.open('https://calendar.app.google/NWkLNFqSZffB36of6', '_blank')}
                    className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#b09155] to-[#9a7f4b] hover:from-[#9a7f4b] hover:to-[#b09155] text-white text-sm font-medium rounded-lg transition-colors duration-200'
                  >
                    {t('meetingCta')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Multi-Step Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className='bg-white/5 backdrop-blur-sm border-white/10 p-8'>
              {/* Progress Indicator */}
              <div className='mb-8'>
                <div className='flex items-center justify-between mb-4'>
                  {stepTitles.map((title, index) => {
                    const StepIcon = stepIcons[index];
                    const stepNumber = index + 1;
                    const isActive = currentStep === stepNumber;
                    const isCompleted = currentStep > stepNumber;
                    
                    return (
                      <div key={index} className='flex items-center'>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                            isCompleted
                              ? 'bg-[#b09155] border-[#b09155] text-white'
                              : isActive
                              ? 'border-[#b09155] text-[#b09155] bg-white/10'
                              : 'border-white/20 text-gray-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className='w-5 h-5' />
                          ) : (
                            <StepIcon className='w-5 h-5' />
                          )}
                        </div>
                        {index < stepTitles.length - 1 && (
                          <div
                            className={`w-16 h-0.5 mx-2 transition-colors duration-200 ${
                              isCompleted ? 'bg-[#b09155]' : 'bg-white/20'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className='text-center'>
                  <h3 className='text-xl font-semibold text-white mb-2'>
                    {stepTitles[currentStep - 1]}
                  </h3>
                  <p className='text-gray-400 text-sm'>
                    {t('multistep.step')} {currentStep} {t('multistep.of')} {stepTitles.length}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
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
                          <label
                            htmlFor='name'
                            className='block text-white font-semibold mb-2'
                          >
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
                            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-colors duration-150 disabled:opacity-50'
                            placeholder={t('placeholders.name')}
                            data-cursor='text'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='company'
                            className='block text-white font-semibold mb-2'
                          >
                            {t('company')}
                          </label>
                          <input
                            type='text'
                            id='company'
                            name='company'
                            value={formData.company}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-colors duration-150 disabled:opacity-50'
                            placeholder={t('placeholders.company')}
                          />
                        </div>
                      </div>

                      <div className='grid md:grid-cols-2 gap-6'>
                        <div>
                          <label
                            htmlFor='email'
                            className='block text-white font-semibold mb-2'
                          >
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
                            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-colors duration-150 disabled:opacity-50'
                            placeholder={t('placeholders.email')}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='phone'
                            className='block text-white font-semibold mb-2'
                          >
                            {t('phone')}
                          </label>
                          <input
                            type='tel'
                            id='phone'
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-colors duration-150 disabled:opacity-50'
                            placeholder={t('placeholders.phone')}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Service Selection */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className='space-y-6'
                    >
                      <div>
                        <label
                          htmlFor='service'
                          className='block text-white font-semibold mb-2'
                        >
                          {t('service')} *
                        </label>
                        <select
                          id='service'
                          name='service'
                          required
                          value={formData.service}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-colors duration-150 disabled:opacity-50'
                          data-cursor='pointer'
                        >
                          <option value='' className='bg-gray-800'>
                            {t('selectService')}
                          </option>
                          {services.map((service, index) => (
                            <option key={index} value={service} className='bg-gray-800'>
                              {service}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor='projectType'
                          className='block text-white font-semibold mb-2'
                        >
                          {t('multistep.projectType')}
                        </label>
                        <select
                          id='projectType'
                          name='projectType'
                          value={formData.projectType}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-colors duration-150 disabled:opacity-50'
                        >
                          <option value='' className='bg-gray-800'>
                            {t('multistep.selectProjectType')}
                          </option>
                          {projectTypes.map((type, index) => (
                            <option key={index} value={type} className='bg-gray-800'>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Project Details */}
                  {currentStep === 3 && (
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
                          <label
                            htmlFor='budget'
                            className='block text-white font-semibold mb-2'
                          >
                            {t('multistep.budget')}
                          </label>
                          <select
                            id='budget'
                            name='budget'
                            value={formData.budget}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-colors duration-150 disabled:opacity-50'
                          >
                            <option value='' className='bg-gray-800'>
                              {t('multistep.selectBudget')}
                            </option>
                            {budgetRanges.map((range, index) => (
                              <option key={index} value={range} className='bg-gray-800'>
                                {range}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor='timeline'
                            className='block text-white font-semibold mb-2'
                          >
                            {t('multistep.timeline')}
                          </label>
                          <select
                            id='timeline'
                            name='timeline'
                            value={formData.timeline}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-colors duration-150 disabled:opacity-50'
                          >
                            <option value='' className='bg-gray-800'>
                              {t('multistep.selectTimeline')}
                            </option>
                            {timelineOptions.map((timeline, index) => (
                              <option key={index} value={timeline} className='bg-gray-800'>
                                {timeline}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor='message'
                          className='block text-white font-semibold mb-2'
                        >
                          {t('message')}
                        </label>
                        <textarea
                          id='message'
                          name='message'
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-colors duration-150 resize-none disabled:opacity-50'
                          placeholder={t('messagePlaceholder')}
                          data-cursor='text'
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 4 && (
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
                <div className='flex justify-between items-center pt-6'>
                  <Button
                    type='button'
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className='flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <ChevronLeft className='w-5 h-5 mr-2' />
                    {t('multistep.previous')}
                  </Button>

                  {currentStep < 4 ? (
                    <Button
                      type='button'
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className='flex items-center px-6 py-3 bg-gradient-to-r from-[#b09155] to-[#9a7f4b] hover:from-[#9a7f4b] hover:to-[#b09155] text-white disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {t('multistep.next')}
                      <ChevronRight className='w-5 h-5 ml-2' />
                    </Button>
                  ) : (
                    <Button
                      type='submit'
                      disabled={isSubmitting}
                      className='flex items-center px-8 py-3 bg-gradient-to-r from-[#b09155] to-[#9a7f4b] hover:from-[#9a7f4b] hover:to-[#b09155] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isSubmitting ? (
                        <>
                          <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3' />
                          {t('sending')}
                        </>
                      ) : (
                        <>
                          <Send className='w-5 h-5 mr-2' />
                          {t('submit')}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}