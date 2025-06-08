'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';


export default function Contact() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    service: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: t('success'),
        });
        setFormData({ email: '', phone: '', service: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || t('error'),
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: t('networkError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="py-20 gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {' '}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl text-[var(--neutral-dark)] max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-[var(--border)] max-w-2xl mx-auto backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {submitStatus.type && (
              <div
                className={`p-4 rounded-lg font-medium ${
                  submitStatus.type === 'success'
                    ? 'bg-green-100 border-2 border-green-300 text-green-800'
                    : 'bg-red-100 border-2 border-red-300 text-red-800'
                }`}
              >
                {submitStatus.message}
              </div>
            )}{' '}
            <div>
              <label
                htmlFor="email"
                className="block text-base font-bold text-[var(--primary)] mb-3 tracking-wide uppercase"
              >
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
            </div>{' '}
            <div>
              <label
                htmlFor="phone"
                className="block text-base font-bold text-[var(--primary)] mb-3 tracking-wide uppercase"
              >
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
            </div>{' '}
            <div>
              <label
                htmlFor="service"
                className="block text-base font-bold text-[var(--primary)] mb-3 tracking-wide uppercase"
              >
                {t('service')} *
              </label>
              <select
                id="service"
                name="service"
                required
                disabled={isSubmitting}
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-4 text-[var(--foreground)] bg-[var(--secondary)] border-2 border-[var(--border)] rounded-lg focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="text-[var(--accent)]">
                  {t('selectService')}
                </option>
                <option value="web-development">
                  {t('services.webDevelopment')}
                </option>
                <option value="e-commerce">{t('services.ecommerce')}</option>
                <option value="digital-transformation">
                  {t('services.digitalTransformation')}
                </option>
                <option value="ui-ux-design">{t('services.uiUxDesign')}</option>
                <option value="maintenance">{t('services.maintenance')}</option>
                <option value="consulting">{t('services.consulting')}</option>
                <option value="other">{t('services.other')}</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-4 px-8 rounded-lg font-bold text-lg tracking-wide uppercase transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  {' '}
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('sending')}
                </span>
              ) : (
                t('submit')
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
