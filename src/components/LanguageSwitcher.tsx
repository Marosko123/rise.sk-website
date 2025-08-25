'use client';

import { useCallback, useEffect, useState } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', nativeName: 'Slovenčina' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('sk');

  // Get locale from localStorage
  const getCurrentLocale = useCallback(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred-language');
      return stored || 'sk';
    }
    return 'sk';
  }, []);

  // Set locale in localStorage
  const setLocale = useCallback((locale: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', locale);
      setCurrentLocale(locale);
      // Reload page to apply new language
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    setCurrentLocale(getCurrentLocale());
  }, [getCurrentLocale]);

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="relative">
        <button className="flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-200">
          <span className="text-lg">🇸🇰</span>
          <span className="hidden sm:inline">SK</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    );
  }

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[1];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
        aria-label="Change language"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 py-2 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50 min-w-[140px]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLocale(language.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-white/10 transition-colors ${
                currentLocale === language.code 
                  ? 'bg-white/20 text-yellow-400' 
                  : 'text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-sm text-gray-400">{language.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
