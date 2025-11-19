'use client';

import { useEffect } from 'react';
import { getLogoTheme } from '@/config/company';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set theme from company config
    const theme = getLogoTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return <>{children}</>;
}
