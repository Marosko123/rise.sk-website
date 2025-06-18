'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', nativeName: 'Slovenčina' },
  // { code: 'cs', name: 'Čeština', flag: '🇨🇿', nativeName: 'Čeština' },
  // { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  // { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  // { code: 'hu', name: 'Magyar', flag: '🇭🇺', nativeName: 'Magyar' },
  // { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
];

export default function LanguageSwitcher() {
  const nextIntlLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');

  // Get the actual current locale from URL
  const getCurrentLocale = useCallback(() => {
    // Priority 1: Extract from current URL in browser (URL is source of truth)
    if (typeof window !== 'undefined') {
      const urlPath = window.location.pathname;
      const segments = urlPath.split('/').filter(Boolean);
      if (segments.length > 0) {
        const firstSegment = segments[0];
        const foundLang = languages.find(lang => lang.code === firstSegment);
        if (foundLang) {
          return firstSegment;
        }
      }
    }

    // Priority 2: Extract from Next.js pathname
    if (pathname) {
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        const firstSegment = segments[0];
        const foundLang = languages.find(lang => lang.code === firstSegment);
        if (foundLang) {
          return firstSegment;
        }
      }
    }

    // Priority 3: Use next-intl locale
    if (
      nextIntlLocale &&
      languages.find(lang => lang.code === nextIntlLocale)
    ) {
      return nextIntlLocale;
    }

    // Priority 4: From localStorage (only as last resort)
    try {
      const storedLocale = localStorage.getItem('preferred-locale');
      if (storedLocale && languages.find(lang => lang.code === storedLocale)) {
        return storedLocale;
      }
    } catch {
      // Ignore localStorage errors
    }

    // Default fallback
    return 'en';
  }, [pathname, nextIntlLocale]);

  const currentLanguage =
    languages.find(lang => lang.code === currentLocale) || languages[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update current locale whenever pathname or nextIntlLocale changes
  useEffect(() => {
    const newLocale = getCurrentLocale();
    setCurrentLocale(newLocale);
  }, [getCurrentLocale]);

  const handleLanguageChange = (newLocale: string) => {
    // Immediately update the state for instant UI feedback
    setCurrentLocale(newLocale);
    setIsOpen(false);

    // Save to localStorage FIRST (critical for other pages)
    try {
      localStorage.setItem('preferred-locale', newLocale);
    } catch {
      // Ignore errors
    }

    // Navigate to new locale
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/').filter(Boolean);

    // Remove current locale if it exists
    if (
      segments.length > 0 &&
      languages.find(lang => lang.code === segments[0])
    ) {
      segments.shift(); // Remove first segment (locale)
    }

    // Build new path
    const pathSuffix = segments.length > 0 ? `/${segments.join('/')}` : '';
    const newPath = `/${newLocale}${pathSuffix}`;

    // Navigate immediately
    router.push(newPath);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className='relative z-50'>
        <div className='flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm'>
          <span className='text-lg'>🇺🇸</span>
          <span className='text-sm font-medium text-white hidden sm:block'>
            English
          </span>
          <span className='text-sm font-medium text-white sm:hidden'>EN</span>
          <svg
            className='w-4 h-4 text-white/80'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className='relative z-50'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg'
        aria-label='Select language'
      >
        <span className='text-lg'>{currentLanguage.flag}</span>
        <span className='text-sm font-medium text-white hidden sm:block'>
          {currentLanguage.nativeName}
        </span>
        <span className='text-sm font-medium text-white sm:hidden'>
          {currentLanguage.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 text-white/80 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className='fixed inset-0 z-40'
            onClick={() => setIsOpen(false)}
          />
          <div className='absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 z-[9999] overflow-hidden'>
            {languages.map((language, index) => (
              <button
                key={language.code}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLanguageChange(language.code);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-all duration-200 cursor-pointer ${
                  index === 0 ? 'rounded-t-xl' : ''
                } ${index === languages.length - 1 ? 'rounded-b-xl' : ''} ${
                  language.code === currentLocale
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:text-blue-700'
                }`}
                type="button"
              >
                <span className='text-lg'>{language.flag}</span>
                <div className='flex-1'>
                  <span className='font-medium block'>
                    {language.nativeName}
                  </span>
                  <span className='text-xs text-gray-500 uppercase'>
                    {language.code}
                  </span>
                </div>
                {language.code === currentLocale && (
                  <svg
                    className='w-4 h-4 text-blue-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
