'use client';

import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-20 bg-[var(--secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}{' '}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6">
              {t('title')}
            </h2>
            <p className="text-lg text-[var(--neutral-dark)] mb-6 leading-relaxed">
              {t('description')}
            </p>{' '}
            <p className="text-lg text-[var(--neutral-dark)] mb-8 leading-relaxed">
              {t('secondDescription')}
            </p>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary)] mb-2">
                  50+
                </div>
                <div className="text-sm text-[var(--accent)]">
                  {t('projectsDelivered')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary)] mb-2">
                  5+
                </div>
                <div className="text-sm text-[var(--accent)]">
                  {t('yearsExperience')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary)] mb-2">
                  100%
                </div>
                <div className="text-sm text-[var(--accent)]">
                  {t('clientSatisfaction')}
                </div>
              </div>
            </div>
          </div>
          {/* Right side - Quote */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--border)]">
            {' '}
            <blockquote className="text-xl text-[var(--neutral-dark)] italic mb-6 leading-relaxed">
              &ldquo;{t('quote')}&rdquo;
            </blockquote>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                AJ
              </div>
              <div>
                <div className="font-semibold text-[var(--foreground)]">
                  {t('founderName')}
                </div>
                <div className="text-[var(--accent)]">{t('founderTitle')}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Services preview */}
        <div className="mt-16 pt-16 border-t border-[var(--border)]">
          <h3 className="text-2xl font-bold text-[var(--foreground)] text-center mb-12">
            {t('whatWeDoBest')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                🚀
              </div>
              <h4 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                {t('webDevTitle')}
              </h4>
              <p className="text-[var(--neutral-dark)]">{t('webDevDesc')}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                🎨
              </div>
              <h4 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                {t('designTitle')}
              </h4>
              <p className="text-[var(--neutral-dark)]">{t('designDesc')}</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                ⚡
              </div>
              <h4 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                {t('performanceTitle')}
              </h4>
              <p className="text-[var(--neutral-dark)]">
                {t('performanceDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
