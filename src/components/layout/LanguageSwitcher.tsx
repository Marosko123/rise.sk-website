'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useState, useTransition } from 'react';

const languages = [
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', nativeName: 'Slovenčina' },
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (nextLocale: string) => {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-200 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Change language"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 py-2 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50 min-w-[140px]"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => onSelectChange(language.code)}
                disabled={isPending}
                className={`w-full px-4 py-2 text-left hover:bg-white/10 transition-colors ${
                  locale === language.code
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
