'use client';

import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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
        phone: formData.phone || 'Not provided',
        company: formData.company || 'Not specified',
        service: formData.service,
        message: formData.message || 'No additional message provided',
        to_email: 'info@rise.sk',
        reply_to: formData.email,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

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
    t('services.other'),
  ];

  return (
    <section
      id='contact'
      className='py-20 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#1a1a1a] relative overflow-hidden'
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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='inline-flex items-center px-4 py-2 bg-[#b09155]/20 border border-[#b09155]/30 rounded-full text-[#b09155] text-sm font-medium mb-6 backdrop-blur-sm'
          >
            <span className='w-2 h-2 bg-[#b09155] rounded-full mr-2 animate-pulse'></span>
            {t('badge')}
          </motion.div>
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
                <motion.a
                  key={index}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    item.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className='flex items-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group'
                  data-cursor='link'
                >
                  <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#b09155] to-[#9a7f4b] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                    <item.icon className='w-6 h-6 text-white' />
                  </div>
                  <div className='ml-4'>
                    <div className='text-sm text-gray-400 uppercase tracking-wide'>
                      {item.label}
                    </div>
                    <div className='text-white font-semibold'>{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='bg-gradient-to-r from-[#b09155]/20 to-[#9a7f4b]/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mt-8'
            >
              <h4 className='text-white font-bold mb-4'>{t('whyChoose')}</h4>
              <div className='grid grid-cols-2 gap-4 text-center'>
                <div>
                  <div className='text-2xl font-bold text-[#b09155]'>100%</div>
                  <div className='text-sm text-gray-300'>
                    {t('onTimeDelivery')}
                  </div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-[#b09155]'>
                    7 days
                  </div>
                  <div className='text-sm text-gray-300'>{t('teamReady')}</div>
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
            className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8'
          >
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
                    className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-all duration-300 disabled:opacity-50'
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
                    className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-all duration-300 disabled:opacity-50'
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
                    className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-all duration-300 disabled:opacity-50'
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
                    className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-all duration-300 disabled:opacity-50'
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
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-all duration-300 disabled:opacity-50'
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
                  className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b09155] focus:border-transparent transition-all duration-300 resize-none disabled:opacity-50'
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

              <motion.button
                type='submit'
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full bg-gradient-to-r from-[#b09155] to-[#9a7f4b] hover:from-[#9a7f4b] hover:to-[#b09155] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
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
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
