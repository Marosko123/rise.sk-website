'use client';

import { useTranslations } from 'next-intl';

export default function Services() {
  const t = useTranslations('services');
  const services = [
    {
      title: t('webDev.title'),
      description: t('webDev.description'),
      features: [
        t('webDev.feature1'),
        t('webDev.feature2'),
        t('webDev.feature3'),
        t('webDev.feature4'),
      ],
      icon: '💻',
    },
    {
      title: t('ecommerce.title'),
      description: t('ecommerce.description'),
      features: [
        t('ecommerce.feature1'),
        t('ecommerce.feature2'),
        t('ecommerce.feature3'),
        t('ecommerce.feature4'),
      ],
      icon: '🛒',
    },
    {
      title: t('digital.title'),
      description: t('digital.description'),
      features: [
        t('digital.feature1'),
        t('digital.feature2'),
        t('digital.feature3'),
        t('digital.feature4'),
      ],
      icon: '🚀',
    },
    {
      title: t('design.title'),
      description: t('design.description'),
      features: [
        t('design.feature1'),
        t('design.feature2'),
        t('design.feature3'),
        t('design.feature4'),
      ],
      icon: '🎨',
    },
    {
      title: t('maintenance.title'),
      description: t('maintenance.description'),
      features: [
        t('maintenance.feature1'),
        t('maintenance.feature2'),
        t('maintenance.feature3'),
        t('maintenance.feature4'),
      ],
      icon: '🛠️',
    },
    {
      title: t('consulting.title'),
      description: t('consulting.description'),
      features: [
        t('consulting.feature1'),
        t('consulting.feature2'),
        t('consulting.feature3'),
        t('consulting.feature4'),
      ],
      icon: '💡',
    },
  ];

  return (
    <section id='services' className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4'>
            {t('title')}
          </h2>
          <p className='text-xl text-[var(--neutral-dark)] max-w-3xl mx-auto'>
            {t('subtitle')}
          </p>
        </div>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {services.map((service, index) => (
            <div
              key={index}
              className='bg-[var(--secondary)] p-8 rounded-2xl border border-[var(--border)] hover:shadow-lg transition-shadow duration-300'
            >
              <div className='text-4xl mb-4'>{service.icon}</div>
              <h3 className='text-xl font-bold text-[var(--foreground)] mb-3'>
                {service.title}
              </h3>
              <p className='text-[var(--neutral-dark)] mb-6 leading-relaxed'>
                {service.description}
              </p>
              <ul className='space-y-2'>
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className='flex items-center text-[var(--accent)]'
                  >
                    <svg
                      className='w-4 h-4 text-[var(--primary)] mr-2'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>{' '}
        <div className='text-center mt-12'>
          <button className='bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'>
            {t('discussProject')}
          </button>
        </div>
      </div>
    </section>
  );
}
