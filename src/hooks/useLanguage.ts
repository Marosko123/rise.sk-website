'use client';

import { useState, useEffect } from 'react';

export function useLanguage() {
  const [language, setLanguage] = useState('sk');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem('preferredLanguage') || 'sk';
    setLanguage(savedLang);
    setIsLoaded(true);

    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    setLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: langCode }));
  };

  return {
    language,
    changeLanguage,
    isLoaded
  };
}
