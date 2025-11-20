'use client';

import { Link, usePathname } from '@/i18n/routing';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useState } from 'react';

const languages = [
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', nativeName: 'Slovenčina' },
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
        aria-label="Change language"
      >
        <span className="text-2xl shadow-sm">{currentLanguage.flag}</span>
        <span className="font-medium uppercase tracking-wide text-sm">{currentLanguage.code}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 py-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[180px] overflow-hidden"
          >
            {languages.map((language) => (
              <Link
                key={language.code}
                href={pathname}
                locale={language.code}
                onClick={() => setIsOpen(false)}
                className={`block w-full px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                  locale === language.code
                    ? 'bg-white/5 text-[var(--primary)]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.nativeName}</div>
                  </div>
                  {locale === language.code && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                  )}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
