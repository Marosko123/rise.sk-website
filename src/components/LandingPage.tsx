'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import companyConfig from '@/config/company';
import { Link } from '@/i18n/routing';

import LanguageSwitcher from './LanguageSwitcher';

export default function LandingPage() {
  const t = useTranslations('landing');

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800'>
      {/* Header */}
      <header className='relative z-10 px-6 py-8'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <div className='flex items-center space-x-3'>
            <Image
              src={companyConfig.website.logo.circle}
              alt={companyConfig.company.name}
              width={40}
              height={40}
              className='rounded-full'
            />
            <span className='text-2xl font-bold text-white'>
              {companyConfig.company.domain}
            </span>
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className='relative z-10 px-6'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* Title Section */}
          <div className='mb-16'>
            <h1 className='text-5xl md:text-6xl font-bold text-white mb-6'>
              {t('title.welcome')}{' '}
              <span style={{ color: '#B09155' }}>
                {companyConfig.company.name.toUpperCase()}
              </span>
            </h1>
            <p className='text-xl text-white/80 max-w-2xl mx-auto'>
              {t('subtitle')}
            </p>
          </div>

          {/* Service Cards */}
          <div className='grid md:grid-cols-2 gap-8 mb-16'>
            {/* Education Card */}
            <Link href='/education'>
              <div className='group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 cursor-pointer'>
                <div className='flex flex-col items-center space-y-6'>
                  <div
                    className='w-20 h-20 rounded-full flex items-center justify-center text-4xl'
                    style={{ backgroundColor: '#B09155' }}
                  >
                    🎓
                  </div>
                  <h2 className='text-2xl font-bold text-white'>
                    {t('education.title')}
                  </h2>
                  <p className='text-white/70 text-center'>
                    {t('education.description')}
                  </p>
                  <div className='flex items-center text-white/60 group-hover:text-white transition-colors'>
                    <span className='mr-2'>{t('education.cta')}</span>
                    <svg
                      className='w-5 h-5 transform group-hover:translate-x-1 transition-transform'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Development Card */}
            <Link href='/development'>
              <div className='group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 cursor-pointer'>
                <div className='flex flex-col items-center space-y-6'>
                  <div
                    className='w-20 h-20 rounded-full flex items-center justify-center text-4xl'
                    style={{ backgroundColor: '#B09155' }}
                  >
                    &lt;/&gt;
                  </div>
                  <h2 className='text-2xl font-bold text-white'>
                    {t('development.title')}
                  </h2>
                  <p className='text-white/70 text-center'>
                    {t('development.description')}
                  </p>
                  <div className='flex items-center text-white/60 group-hover:text-white transition-colors'>
                    <span className='mr-2'>{t('development.cta')}</span>
                    <svg
                      className='w-5 h-5 transform group-hover:translate-x-1 transition-transform'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='relative z-10 px-6 py-8 mt-16'>
        <div className='max-w-7xl mx-auto text-center'>
          <p className='text-white/60 text-sm'>{t('footer')}</p>
        </div>
      </footer>

      {/* Background decorative elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div
          className='absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20'
          style={{ backgroundColor: '#B09155' }}
        ></div>
        <div
          className='absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20'
          style={{ backgroundColor: '#B09155' }}
        ></div>
      </div>
    </div>
  );
}
