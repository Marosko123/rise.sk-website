'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    // Validate required fields
    if (!formData.email || !formData.phone || !formData.message) {
      setSubmitStatus({
        type: 'error',
        message: t('error'),
      });
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      setIsSubmitting(false);
      return;
    }    try {
      // EmailJS configuration from environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;      if (!serviceId || !templateId || !publicKey) {
        console.error('EmailJS configuration missing:', { serviceId, templateId, publicKey });
        throw new Error('EmailJS configuration missing. Please check environment variables.');
      }

      console.log('EmailJS configuration:', { serviceId, templateId, publicKey: publicKey.substring(0, 10) + '...' });

      // Template parameters for EmailJS
      const templateParams = {
        from_name: formData.email,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.message,
        to_email: 'davarinskt@gmail.com',
        reply_to: formData.email,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setSubmitStatus({
        type: 'success',
        message: t('success'),
      });
      setFormData({ email: '', phone: '', message: '' });    } catch (error) {
      console.error('EmailJS error:', error);
      let errorMessage = t('networkError');
      
      if (error instanceof Error) {
        if (error.message.includes('Account not found') || error.message.includes('404')) {
          errorMessage = 'EmailJS account not found. Please check your EmailJS configuration.';
        } else if (error.message.includes('Template')) {
          errorMessage = 'EmailJS template not found. Please check your template ID.';
        } else if (error.message.includes('Service')) {
          errorMessage = 'EmailJS service not found. Please check your service ID.';
        }
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };return (
    <section id="contact" className="py-20 gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl text-[var(--neutral-dark)] max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div><div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-[var(--border)] max-w-2xl mx-auto backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {submitStatus.type && (
              <div className={`p-4 rounded-lg font-medium ${
                submitStatus.type === 'success' 
                  ? 'bg-green-100 border-2 border-green-300 text-green-800' 
                  : 'bg-red-100 border-2 border-red-300 text-red-800'
              }`}>
                {submitStatus.message}
              </div>
            )}            <div>
              <label htmlFor="email" className="block text-base font-bold text-[var(--primary)] mb-3 tracking-wide uppercase">
                {t('email')} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isSubmitting}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-4 text-[var(--foreground)] bg-[var(--secondary)] border-2 border-[var(--border)] rounded-lg focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-[var(--accent)]"
                placeholder="your@email.com"
              />
            </div>            <div>
              <label htmlFor="phone" className="block text-base font-bold text-[var(--primary)] mb-3 tracking-wide uppercase">
                {t('phone')} *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                disabled={isSubmitting}
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-4 text-[var(--foreground)] bg-[var(--secondary)] border-2 border-[var(--border)] rounded-lg focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-[var(--accent)]"
                placeholder="+1 (555) 123-4567"
              />
            </div>            <div>
              <label htmlFor="message" className="block text-base font-bold text-[var(--primary)] mb-3 tracking-wide uppercase">
                {t('message')} *
              </label>
              <textarea
                id="message"
                name="message"
                required
                disabled={isSubmitting}
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-4 text-[var(--foreground)] bg-[var(--secondary)] border-2 border-[var(--border)] rounded-lg focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-[var(--accent)] resize-vertical"
                placeholder={t('messagePlaceholder')}
              />
            </div><button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-4 px-8 rounded-lg font-bold text-lg tracking-wide uppercase transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('sending')}
                </span>
              ) : t('submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
