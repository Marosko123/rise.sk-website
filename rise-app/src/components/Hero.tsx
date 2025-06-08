'use client';

import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {' '}
          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--foreground)] mb-6 leading-tight">
            {t('title')}
            <span className="text-[var(--primary)] block">
              {t('titleHighlight')}
            </span>
          </h1>
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[var(--neutral-dark)] mb-8 leading-relaxed max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          {/* Company description */}
          <div className="mb-12">
            <p className="text-lg text-[var(--accent)] max-w-2xl mx-auto leading-relaxed">
              {t('description')}
            </p>
          </div>
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {t('startProject')}
            </button>
            <button className="border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300">
              {t('getInTouch')}
            </button>
          </div>
          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--accent)] mb-4">
              Trusted by innovative companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="h-8 w-24 bg-[var(--accent)] rounded opacity-50"></div>
              <div className="h-8 w-32 bg-[var(--accent)] rounded opacity-50"></div>
              <div className="h-8 w-28 bg-[var(--accent)] rounded opacity-50"></div>
              <div className="h-8 w-20 bg-[var(--accent)] rounded opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
