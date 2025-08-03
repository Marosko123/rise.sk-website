'use client';

import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Section } from './ui/Section';

export default function Contact() {
  const t = useTranslations('contact');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Template parameters for EmailJS
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
      });
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
  };

  const contactInfo = [
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
  ];

  const services = [
    t('services.webDevelopment'),
    t('services.mobileApps'),
    t('services.customSoftware'),
    t('services.ecommerce'),
    t('services.aiAnalytics'),
    t('services.digitalMarketing'),
    t('services.specialRequests'),
    t('services.jobApplication'),
    t('services.other'),
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
            <span className='bg-gradient-to-r from-[#b09155] via-[#d4af37] to-[#b8860b] bg-clip-text text-transparent block'>
              {t('mainTitleHighlight')}
            </span>
          </h2>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-12 items-start'>
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='space-y-8'
          >
            <div>
              <h3 className='text-2xl font-bold text-white mb-6'>
                {t('getInTouch')}
              </h3>
              <p className='text-gray-300 text-lg leading-relaxed mb-8'>
                {t('description')}
              </p>
            </div>

            <div className='space-y-6'>
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
            </div>

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

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className='bg-white/5 backdrop-blur-sm border-white/10 p-8'>
              <form onSubmit={handleSubmit} className='space-y-6'>
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

                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-gradient-to-r from-[#b09155] to-[#9a7f4b] hover:from-[#9a7f4b] hover:to-[#b09155] text-white font-bold py-4 px-8 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
                  data-cursor='button'
                >
                  {isSubmitting ? (
                    <div className='flex items-center'>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3' />
                      {t('sending')}
                    </div>
                  ) : (
                    <div className='flex items-center'>
                      <Send className='w-5 h-5 mr-2' />
                      {t('submit')}
                    </div>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
