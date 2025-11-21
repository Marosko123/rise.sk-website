import { useAnalytics } from '@/hooks/useAnalytics';
import { useTranslations } from '@/hooks/useTranslations';
import { useCallback, useEffect, useState } from 'react';

export interface FormData {
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

export interface SubmitStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export function useContactForm() {
  const t = useTranslations('contact');
  const { trackContactFormSubmit } = useAnalytics();
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
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: '' });

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
            localStorage.removeItem('contactFormData');
          }
        } catch {
          localStorage.removeItem('contactFormData');
        }
      }
    };

    loadStoredData();
    const handleStorageChange = () => loadStoredData();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('contactFormUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contactFormUpdate', handleStorageChange);
    };
  }, []);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  }, [currentStep]);

  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1: return !!(formData.name && formData.email);
      case 2: return !!formData.service;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  }, [currentStep, formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    if (!formData.name || !formData.email || !formData.service) {
      setSubmitStatus({ type: 'error', message: t('requiredFields') });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({ type: 'error', message: t('invalidEmail') });
      setIsSubmitting(false);
      return;
    }

    try {
      const emailjs = (await import('@emailjs/browser')).default;
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const autoReplyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_AUTO_REPLY_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration missing');
      }

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

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      // Track successful submission
      trackContactFormSubmit(formData.service || 'General Inquiry');

      if (autoReplyTemplateId) {
        try {
          await emailjs.send(serviceId, autoReplyTemplateId, {
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
          }, publicKey);
        } catch {
          // Ignore auto-reply failure
        }
      }

      setSubmitStatus({ type: 'success', message: t('success') });
      setFormData({
        name: '', email: '', phone: '', company: '', service: '',
        message: '', budget: '', timeline: '', projectType: '',
      });
      setCurrentStep(1);
    } catch (error) {
      let errorMessage = t('networkError');
      if (error instanceof Error && (error.message.includes('Account not found') || error.message.includes('404'))) {
        errorMessage = t('error');
      }
      setSubmitStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, t, trackContactFormSubmit]);

  return {
    currentStep,
    formData,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
    nextStep,
    prevStep,
    isStepValid,
  };
}
