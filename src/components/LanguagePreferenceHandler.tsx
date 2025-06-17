'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const languages = ['en', 'sk', 'cs', 'de', 'es', 'hu', 'fr'];

export default function LanguagePreferenceHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      const pathSegments = pathname.split('/').filter(Boolean);
      const urlLocale =
        pathSegments.length > 0 && languages.includes(pathSegments[0])
          ? pathSegments[0]
          : null;

      if (urlLocale) {
        // URL HAS a locale -> Store it in localStorage (URL wins)
        localStorage.setItem('preferred-locale', urlLocale);
      } else {
        // URL has NO locale -> Use localStorage preference and redirect
        const storedLocale = localStorage.getItem('preferred-locale');

        if (storedLocale && languages.includes(storedLocale)) {
          // Redirect to stored locale
          const newPath = `/${storedLocale}${pathname}`;
          router.replace(newPath);
        } else {
          // No stored preference, redirect to default locale
          const newPath = `/en${pathname}`;
          router.replace(newPath);
        }
      }
    } catch {
      // Ignore localStorage errors - fallback to English if needed
      if (
        !pathname.startsWith('/en') &&
        !languages.some(lang => pathname.startsWith(`/${lang}`))
      ) {
        router.replace(`/en${pathname}`);
      }
    }
  }, [pathname, router]);

  // This component doesn't render anything
  return null;
}
