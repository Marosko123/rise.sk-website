import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

type SupportedLocale = 'en' | 'sk' | 'cs' | 'de' | 'es' | 'hu' | 'fr';

export default getRequestConfig(async ({ requestLocale }) => {
  // This can either be defined statically at the top-level or based on the user's locale.
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as SupportedLocale)) {
    locale = routing.defaultLocale;
  }

  // Try to load the messages for the locale, fallback to English if not found
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      `Failed to load messages for locale ${locale}, falling back to English`
    );
    messages = (await import(`../../messages/sk.json`)).default;
    locale = 'sk';
  }

  return {
    locale,
    messages,
    defaultTranslationValues: {
      // Global default values for interpolation
    },
    onError(error) {
      // eslint-disable-next-line no-console
      console.error('Translation error:', error);
    },
    getMessageFallback({ namespace, key }) {
      const path = [namespace, key].filter(part => part != null).join('.');
      return `Translation missing: ${path}`;
    },
  };
});
