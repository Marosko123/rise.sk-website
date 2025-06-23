'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Reviews from '@/components/Reviews';
import companyConfig from '@/config/company';
import { Link } from '@/i18n/routing';

export default function EducationPage() {
  const t = useTranslations('education');

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800'>
      {/* Header */}
      <header className='relative z-10 px-6 py-8'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <Link href='/' className='flex items-center space-x-3'>
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
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className='relative z-10 px-6'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* Title Section */}
          <div className='mb-16'>
            <div
              className='w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center text-6xl'
              style={{ backgroundColor: '#B09155' }}
            >
              🎓
            </div>
            <h1 className='text-5xl md:text-6xl font-bold text-white mb-6'>
              {t('title')}
            </h1>
            <p className='text-xl text-white/80 max-w-2xl mx-auto mb-8'>
              {t('subtitle')}
            </p>
          </div>

          {/* In Progress Section */}
          <div className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12'>
            <div className='flex flex-col items-center space-y-6'>
              <div
                className='w-24 h-24 rounded-full flex items-center justify-center text-4xl animate-pulse'
                style={{ backgroundColor: 'rgba(176, 145, 85, 0.3)' }}
              >
                🚧
              </div>
              <h2 className='text-3xl font-bold text-white'>
                {t('inProgress.title')}
              </h2>
              <p className='text-lg text-white/70 text-center max-w-md'>
                {t('inProgress.description')}
              </p>

              {/* Contact Information */}
              <div className='mt-8 p-6 bg-white/5 rounded-xl border border-white/10'>
                <h3 className='text-xl font-semibold text-white mb-4'>
                  {t('contact.title')}
                </h3>
                <div className='space-y-2 text-white/80'>
                  <p>
                    <strong style={{ color: '#B09155' }}>
                      {companyConfig.founders.michael.name}
                    </strong>
                  </p>
                  <p>{companyConfig.founders.michael.title}</p>
                  <p>
                    <a
                      href={`mailto:${companyConfig.founders.michael.email}`}
                      className='hover:underline'
                      style={{ color: '#B09155' }}
                    >
                      {companyConfig.founders.michael.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reviews Section */}
      <Reviews />

      {/* Footer */}
      <footer className='relative z-10 px-6 py-8 mt-16'>
        <div className='max-w-7xl mx-auto text-center'>
          <p className='text-white/60 text-sm'>
            © {companyConfig.company.establishedYear}{' '}
            {companyConfig.company.fullName}
          </p>
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
