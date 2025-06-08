import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This can either be defined statically at the top-level or based on the user's locale.
  let locale = await requestLocale;
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as 'en' | 'sk')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
