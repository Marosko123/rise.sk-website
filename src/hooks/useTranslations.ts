'use client';

import { useCallback, useEffect, useState } from 'react';

// Import translation files
import enMessages from '../../messages/en.json';
import skMessages from '../../messages/sk.json';

const messages = {
  en: enMessages,
  sk: skMessages,
};

export function useTranslations(namespace?: string) {
  const [locale, setLocale] = useState<'en' | 'sk'>('sk'); // Start with default

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred-language') as 'en' | 'sk';
      if (stored) {
        setLocale(stored);
      }

      // Listen for storage changes
      const handleStorageChange = () => {
        const newLocale = localStorage.getItem('preferred-language') as 'en' | 'sk';
        setLocale(newLocale || 'sk');
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const currentMessages = messages[locale];

    if (namespace) {
      // Handle nested namespaces like 'services.webDevelopment'
      const namespaceKeys = namespace.split('.');
      let namespaceData: unknown = currentMessages;

      for (const nsKey of namespaceKeys) {
        if (namespaceData && typeof namespaceData === 'object' && nsKey in namespaceData) {
          namespaceData = (namespaceData as Record<string, unknown>)[nsKey];
        } else {
          return key;
        }
      }

      if (namespaceData && typeof namespaceData === 'object') {
        // Handle nested keys within namespace
        if (key.includes('.')) {
          const keys = key.split('.');
          let value: unknown = namespaceData;

          for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
              value = (value as Record<string, unknown>)[k];
            } else {
              return key;
            }
          }

          let translation = typeof value === 'string' ? value : key;

          // Replace parameters if provided
          if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
              translation = translation.replace(`{${paramKey}}`, String(paramValue));
            });
          }

          return translation;
        } else {
          let translation = (namespaceData as Record<string, string>)[key] || key;

          // Replace parameters if provided
          if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
              translation = translation.replace(`{${paramKey}}`, String(paramValue));
            });
          }

          return translation;
        }
      } else {
        return key;
      }
    }

    // Handle direct keys
    const keys = key.split('.');
    let value: unknown = currentMessages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    let result = typeof value === 'string' ? value : key;

    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return result;
  }, [locale, namespace]);

  // Add raw method for getting complex data
  const tWithRaw = Object.assign(t, {
    raw: (key: string) => {
      const currentMessages = messages[locale];

      if (namespace) {
        // Handle nested namespaces like 'services.webDevelopment'
        const namespaceKeys = namespace.split('.');
        let namespaceData: unknown = currentMessages;

        for (const nsKey of namespaceKeys) {
          if (namespaceData && typeof namespaceData === 'object' && nsKey in namespaceData) {
            namespaceData = (namespaceData as Record<string, unknown>)[nsKey];
          } else {
            return undefined;
          }
        }

        if (namespaceData && typeof namespaceData === 'object') {
          return (namespaceData as Record<string, unknown>)[key];
        }
        return undefined;
      }

      const keys = key.split('.');
      let value: unknown = currentMessages;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return undefined;
        }
      }

      return value;
    }
  });

  return tWithRaw;
}

export function useLocale() {
  const [locale, setLocale] = useState<'en' | 'sk'>('sk');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred-language') as 'en' | 'sk';
      setLocale(stored || 'sk');
    }
  }, []);

  return locale;
}
